import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import navbarSnapshot from '@/data/navbarSnapshot.json';
import {
  buildNavbarCategoryGroups,
  NAVBAR_CATEGORY_KEYS,
} from '@/utils/categoryHelpers';

const CACHE_DURATION = 30 * 60 * 1000;
const SESSION_CACHE_PREFIX = 'bookingincatrail:navbar:';

const navbarCache = {
  en: null,
  es: null,
};

function hasTrips(categories = []) {
  return categories.some(
    (category) =>
      Array.isArray(category?.trips) && category.trips.length > 0,
  );
}

function getSnapshotGroups(locale) {
  return Array.isArray(navbarSnapshot?.locales?.[locale])
    ? navbarSnapshot.locales[locale]
    : [];
}

function getSnapshotState(locale) {
  const categories = buildNavbarCategoryGroups(
    locale,
    getSnapshotGroups(locale),
  );

  return {
    categories,
    hasData: hasTrips(categories),
  };
}

function isCacheValid(entry) {
  return (
    entry?.data &&
    Date.now() - Number(entry.timestamp || 0) < CACHE_DURATION
  );
}

function readSessionCache(locale) {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(
      `${SESSION_CACHE_PREFIX}${locale}`,
    );
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return isCacheValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCaches(locale, data) {
  const entry = {
    data,
    timestamp: Date.now(),
  };

  navbarCache[locale] = entry;

  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(
      `${SESSION_CACHE_PREFIX}${locale}`,
      JSON.stringify(entry),
    );
  } catch {
    // Storage may be unavailable in private browsing or restricted contexts.
  }
}

function getFreshCache(locale) {
  if (isCacheValid(navbarCache[locale])) {
    return navbarCache[locale];
  }

  const sessionCache = readSessionCache(locale);
  if (sessionCache) {
    navbarCache[locale] = sessionCache;
    return sessionCache;
  }

  return null;
}

export default function useNavbarData() {
  const { locale } = useRouter();
  const localeToUse = locale || 'es';
  const [categories, setCategories] = useState(
    () => getSnapshotState(localeToUse).categories,
  );
  const [loading, setLoading] = useState(
    () => !getSnapshotState(localeToUse).hasData,
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchNavbarTrips = async () => {
      const snapshotState = getSnapshotState(localeToUse);
      const freshCache = getFreshCache(localeToUse);
      const hasUsableCache = Boolean(freshCache?.data);
      const initialCategories = hasUsableCache
        ? buildNavbarCategoryGroups(localeToUse, freshCache.data)
        : snapshotState.categories;
      const hasInitialData = hasUsableCache || snapshotState.hasData;

      setCategories(initialCategories);
      setLoading(!hasInitialData);
      setError(null);

      if (hasUsableCache) {
        return;
      }

      try {
        const categoryParam = encodeURIComponent(NAVBAR_CATEGORY_KEYS.join(','));
        const localeParam = encodeURIComponent(localeToUse);
        const response = await fetch(
          `/api/trip/navbar?category=${categoryParam}&locale=${localeParam}`,
        );

        if (!response.ok) {
          throw new Error(`Error fetching navbar trips: ${response.status}`);
        }

        const data = await response.json();
        const grouped = buildNavbarCategoryGroups(localeToUse, data);

        writeCaches(localeToUse, grouped);

        if (cancelled) return;
        setCategories(grouped);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        setCategories(snapshotState.categories);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    fetchNavbarTrips();

    return () => {
      cancelled = true;
    };
  }, [localeToUse]);

  return { categories, loading, error };
}
