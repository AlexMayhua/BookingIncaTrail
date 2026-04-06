import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  buildNavbarCategoryGroups,
  NAVBAR_CATEGORY_KEYS,
} from '@/utils/categoryHelpers';

const navbarCache = {
  data: null,
  locale: null,
  timestamp: 0,
  CACHE_DURATION: 30 * 60 * 1000,
};

export default function useNavbarData() {
  const { locale } = useRouter();
  const localeToUse = locale || 'es';
  const [categories, setCategories] = useState(() =>
    buildNavbarCategoryGroups(localeToUse),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNavbarTrips = async () => {
      const preloadedCategories = buildNavbarCategoryGroups(localeToUse);

      try {
        setCategories(preloadedCategories);

        const now = Date.now();
        const cacheValid =
          navbarCache.data &&
          navbarCache.locale === localeToUse &&
          now - navbarCache.timestamp < navbarCache.CACHE_DURATION;

        if (cacheValid) {
          setCategories(buildNavbarCategoryGroups(localeToUse, navbarCache.data));
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

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

        navbarCache.data = grouped;
        navbarCache.locale = localeToUse;
        navbarCache.timestamp = Date.now();

        setCategories(grouped);
      } catch (err) {
        setError(err.message);
        setCategories(preloadedCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchNavbarTrips();
  }, [localeToUse]);

  return { categories, loading, error };
}
