import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

const MIME_EXTENSION_MAP = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
};

function sanitizePathSegment(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getCategoryFolder(category = '') {
  return sanitizePathSegment(category || 'others') || 'others';
}

function isRemoteImageUrl(value = '') {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function inferExtensionFromContentType(contentType = '') {
  const normalized = String(contentType).split(';')[0].trim().toLowerCase();
  return MIME_EXTENSION_MAP[normalized] || null;
}

function inferExtensionFromUrl(fileUrl = '') {
  try {
    const parsed = new URL(fileUrl);
    const ext = path.extname(parsed.pathname).replace('.', '').toLowerCase();

    if (!ext) return null;

    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }

    return null;
  } catch {
    return null;
  }
}

async function saveRemoteImageToLocalStorage(url, categoryFolder) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error ${response.status} al descargar ${url}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const ext =
    inferExtensionFromContentType(contentType) ||
    inferExtensionFromUrl(url) ||
    'jpg';

  const arrayBuffer = await response.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  if (!imageBuffer.length) {
    throw new Error(`Imagen vacia: ${url}`);
  }

  if (imageBuffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`Imagen supera 15MB (${imageBuffer.length} bytes): ${url}`);
  }

  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  const absoluteDir = path.join(
    process.cwd(),
    'public',
    'storage',
    categoryFolder,
  );
  const absoluteFilePath = path.join(absoluteDir, fileName);

  await fs.mkdir(absoluteDir, { recursive: true });
  await fs.writeFile(absoluteFilePath, imageBuffer);

  return `/storage/${categoryFolder}/${fileName}`;
}

function parseArgs(argv = []) {
  const apply = argv.includes('--apply');
  const limitArg = argv.find((item) => item.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.replace('--limit=', '')) : null;

  return {
    apply,
    limit: Number.isFinite(limit) && limit > 0 ? limit : null,
  };
}

async function run() {
  const { apply, limit } = parseArgs(process.argv.slice(2));

  if (!process.env.MONGODB_URI) {
    throw new Error('Falta MONGODB_URI en variables de entorno.');
  }

  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });

  const Trip =
    mongoose.models.trip_migration ||
    mongoose.model(
      'trip_migration',
      new mongoose.Schema({}, { strict: false, collection: 'trips' }),
      'trips',
    );

  const rawTrips = await Trip.find({ gallery: { $exists: true, $ne: [] } })
    .select('_id title category gallery')
    .lean();

  const trips = limit ? rawTrips.slice(0, limit) : rawTrips;

  let processedTrips = 0;
  let updatedTrips = 0;
  let downloadedImages = 0;
  let failedImages = 0;

  for (const trip of trips) {
    processedTrips += 1;

    const currentGallery = Array.isArray(trip.gallery) ? trip.gallery : [];
    const categoryFolder = getCategoryFolder(trip.category);
    const downloadCache = new Map();

    let changed = false;
    const newGallery = [];

    for (const item of currentGallery) {
      if (!item || typeof item !== 'object') {
        newGallery.push(item);
        continue;
      }

      const currentUrl = String(item.url || '').trim();

      if (!isRemoteImageUrl(currentUrl)) {
        newGallery.push(item);
        continue;
      }

      try {
        let localUrl = downloadCache.get(currentUrl);

        if (!localUrl) {
          localUrl = await saveRemoteImageToLocalStorage(
            currentUrl,
            categoryFolder,
          );
          downloadCache.set(currentUrl, localUrl);
          downloadedImages += 1;
        }

        changed = true;
        newGallery.push({ ...item, url: localUrl });
      } catch (error) {
        failedImages += 1;
        console.error(
          `[ERROR] Trip ${trip._id} - ${trip.title || '(sin titulo)'}: ${error.message}`,
        );
        newGallery.push(item);
      }
    }

    if (!changed) {
      continue;
    }

    updatedTrips += 1;

    if (apply) {
      await Trip.updateOne(
        { _id: trip._id },
        {
          $set: {
            gallery: newGallery,
          },
        },
      );
    }
  }

  console.log('--- Migration summary ---');
  console.log(`Mode: ${apply ? 'APPLY' : 'DRY-RUN'}`);
  console.log(`Trips scanned: ${processedTrips}`);
  console.log(`Trips with changes: ${updatedTrips}`);
  console.log(`Images downloaded: ${downloadedImages}`);
  console.log(`Image download failures: ${failedImages}`);

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('[FATAL]', error.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
