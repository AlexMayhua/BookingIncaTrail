import { getCategoriesWithTours } from '@/modules/trips/service/trip.service';
import { BRAND } from '../../lib/brandConfig';
import {
  createCategorySet,
  createTourSet,
  getTourSitemapEntries,
  renderUrlSet,
  writeXmlResponse,
} from '../../lib/sitemap';

export async function getServerSideProps({ res }) {
  const [spanishGroups, englishGroups] = await Promise.all([
    getCategoriesWithTours('es'),
    getCategoriesWithTours('en'),
  ]);

  const sitemap = renderUrlSet(
    getTourSitemapEntries({
      groups: spanishGroups,
      locale: 'es',
      siteUrl: BRAND.siteUrl,
      alternateCategorySet: createCategorySet(englishGroups),
      alternateTourSet: createTourSet(englishGroups),
    }),
  );

  writeXmlResponse(res, sitemap);

  return { props: {} };
}

export default function SitemapEs() {
  return null;
}
