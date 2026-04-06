import { connectDB } from '@/lib/mongodb';
import Trip from '../model/trip.model';

// ── Queries públicas ──────────────────────────────────────────

export async function findTrips(filter, selectedFields) {
  await connectDB();

  const query = Trip.find(filter).lean();

  if (selectedFields) {
    query.select(selectedFields);
  }

  return query;
}

export async function findTripBySlug(slug, lang) {
  await connectDB();
  return Trip.findOne({ slug, lang }).lean();
}

export async function getDistinctCategories() {
  await connectDB();
  return Trip.distinct('category');
}

export async function findTripsGroupedByCategory(lang) {
  await connectDB();
  const filter = {};
  if (lang && lang !== 'all') {
    filter.$or = [{ lang }, { lang: 'all' }];
  }
  return Trip.find(filter)
    .select(
      'title slug category meta_description gallery price duration discount quickstats updatedAt',
    )
    .lean();
}

export async function findDeals(lang) {
  await connectDB();
  return Trip.find({ lang, isDeals: true }).lean();
}

export async function findNavbarTripsByCategories(
  categories = [],
  locale = 'all',
) {
  await connectDB();

  const filter = { category: { $in: categories } };

  if (locale && locale !== 'all') {
    filter.$or = [{ lang: locale }, { lang: 'all' }];
  }

  return Trip.find(filter)
    .select('title sub_title navbar_description gallery category slug')
    .lean();
}

// ── Queries admin ─────────────────────────────────────────────

export async function findTripsWithPagination(filter, page, limit) {
  await connectDB();

  const skip = (page - 1) * limit;

  return Trip.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      'title category price slug lang createdAt duration discount isDeals gallery',
    )
    .lean();
}

export async function countTrips(filter) {
  await connectDB();
  return Trip.countDocuments(filter);
}

export async function findTripById(id) {
  await connectDB();
  return Trip.findById(id).lean();
}

export async function createTrip(data) {
  await connectDB();
  return Trip.create(data);
}

export async function updateTripById(id, data) {
  await connectDB();
  return Trip.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteTripById(id) {
  await connectDB();
  return Trip.findByIdAndDelete(id);
}
