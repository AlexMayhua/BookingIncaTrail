/**
 * Service for filtering and sorting trips on the client side.
 */

export const SORT_OPTIONS = {
  TITLE: 'title',
  PRICE_ASC: 'price-low',
  PRICE_DESC: 'price-high',
  DURATION: 'duration',
};

export const FILTER_OPTIONS = {
  ALL: 'all',
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
};

export function sortTrips(trips, sortType) {
  if (!trips?.length) return [];
  const sorted = [...trips];
  switch (sortType) {
    case SORT_OPTIONS.PRICE_ASC:
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    case SORT_OPTIONS.PRICE_DESC:
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    case SORT_OPTIONS.DURATION:
      return sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
    case SORT_OPTIONS.TITLE:
    default:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
}

export function filterTripsByDuration(trips, filterType) {
  if (!trips?.length) return [];
  switch (filterType) {
    case FILTER_OPTIONS.SHORT:
      return trips.filter((trip) => (trip.duration || 0) <= 3);
    case FILTER_OPTIONS.MEDIUM:
      return trips.filter(
        (trip) => (trip.duration || 0) > 3 && (trip.duration || 0) <= 7,
      );
    case FILTER_OPTIONS.LONG:
      return trips.filter((trip) => (trip.duration || 0) > 7);
    case FILTER_OPTIONS.ALL:
    default:
      return trips;
  }
}

export function processTrips(trips, { sortBy, filterBy }) {
  const filtered = filterTripsByDuration(trips, filterBy);
  return sortTrips(filtered, sortBy);
}
