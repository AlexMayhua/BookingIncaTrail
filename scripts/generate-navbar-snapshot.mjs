import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const SNAPSHOT_PATH = path.join(
  process.cwd(),
  'src',
  'data',
  'navbarSnapshot.json',
);

const NAVBAR_CATEGORY_KEYS = [
  'inca-trail',
  'salkantay',
  'rainbow-mountain',
  'ausangate',
  'day-tours',
  'peru-packages',
  'inca-jungle',
];

const CATEGORY_ALIASES = {
  'peru-packajes': 'peru-packages',
};

const CATEGORY_TITLES = {
  es: {
    'inca-trail': 'Camino Inca',
    salkantay: 'Salkantay Trek',
    'rainbow-mountain': 'Monta\u00f1a de Colores',
    ausangate: 'Ausangate Trek',
    'day-tours': 'Tours de un D\u00eda',
    'peru-packages': 'Paquetes Tur\u00edsticos Per\u00fa',
    'inca-jungle': 'Inca Jungle Trek',
  },
  en: {
    'inca-trail': 'Inca Trail',
    salkantay: 'Salkantay Trek',
    'rainbow-mountain': 'Rainbow Mountain',
    ausangate: 'Ausangate Trek',
    'day-tours': 'Day Tours',
    'peru-packages': 'Peru Packages',
    'inca-jungle': 'Inca Jungle Trek',
  },
};

const EMPTY_SNAPSHOT = {
  generatedAt: null,
  locales: {
    en: [],
    es: [],
  },
};

function normalizeCategorySlug(category = '') {
  const normalized = `${category || ''}`.trim().toLowerCase();
  return CATEGORY_ALIASES[normalized] || normalized;
}

function getCategoryTitle(category, locale) {
  const slug = normalizeCategorySlug(category);
  return (
    CATEGORY_TITLES[locale]?.[slug] ||
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
  );
}

function serializeTrip(trip) {
  const firstImage = Array.isArray(trip.gallery) ? trip.gallery[0] : null;

  return {
    title: trip.title || '',
    subtitle: trip.sub_title || '',
    category: normalizeCategorySlug(trip.category),
    slug: trip.slug || '',
    navbar_description: trip.navbar_description || '',
    gallery: {
      url: firstImage?.url || '',
      alt: firstImage?.alt || '',
    },
  };
}

function groupTripsByNavbarCategory(trips = [], locale = 'es') {
  const grouped = Object.fromEntries(
    NAVBAR_CATEGORY_KEYS.map((category) => [category, []]),
  );

  for (const trip of trips) {
    const category = normalizeCategorySlug(trip.category);
    if (!grouped[category]) continue;
    grouped[category].push(serializeTrip(trip));
  }

  return NAVBAR_CATEGORY_KEYS.map((category) => ({
    category,
    title: getCategoryTitle(category, locale),
    trips: grouped[category],
  }));
}

async function snapshotExists() {
  try {
    await fs.access(SNAPSHOT_PATH);
    return true;
  } catch {
    return false;
  }
}

async function writeSnapshot(snapshot) {
  await fs.mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
  await fs.writeFile(
    SNAPSHOT_PATH,
    `${JSON.stringify(snapshot, null, 2)}\n`,
    'utf8',
  );
}

async function ensureFallbackSnapshot() {
  if (await snapshotExists()) {
    console.warn('[navbar:generate] Keeping existing navbar snapshot.');
    return;
  }

  await writeSnapshot(EMPTY_SNAPSHOT);
  console.warn('[navbar:generate] Wrote empty navbar snapshot fallback.');
}

async function fetchTripsForLocale(Trip, locale) {
  return Trip.find({
    category: { $in: NAVBAR_CATEGORY_KEYS },
    $or: [{ lang: locale }, { lang: 'all' }],
  })
    .select('title sub_title navbar_description gallery category slug')
    .lean();
}

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI for navbar snapshot generation.');
  }

  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });

  const Trip =
    mongoose.models.trip_navbar_snapshot ||
    mongoose.model(
      'trip_navbar_snapshot',
      new mongoose.Schema({}, { strict: false, collection: 'trips' }),
      'trips',
    );

  const [enTrips, esTrips] = await Promise.all([
    fetchTripsForLocale(Trip, 'en'),
    fetchTripsForLocale(Trip, 'es'),
  ]);

  await writeSnapshot({
    generatedAt: new Date().toISOString(),
    locales: {
      en: groupTripsByNavbarCategory(enTrips, 'en'),
      es: groupTripsByNavbarCategory(esTrips, 'es'),
    },
  });

  console.log(
    `[navbar:generate] Snapshot written to ${path.relative(
      process.cwd(),
      SNAPSHOT_PATH,
    )}`,
  );
}

run()
  .catch(async (error) => {
    console.warn(`[navbar:generate] ${error.message}`);
    await ensureFallbackSnapshot();
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect errors during fallback.
    }
  });
