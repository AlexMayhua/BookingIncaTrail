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
  const [englishGroups, spanishGroups] = await Promise.all([
    getCategoriesWithTours('en'),
    getCategoriesWithTours('es'),
  ]);

  const sitemap = renderUrlSet(
    getTourSitemapEntries({
      groups: englishGroups,
      locale: 'en',
      siteUrl: BRAND.siteUrl,
      alternateCategorySet: createCategorySet(spanishGroups),
      alternateTourSet: createTourSet(spanishGroups),
    }),
  );

  writeXmlResponse(res, sitemap);

  return { props: {} };
}

export default function SitemapEn() {
  return null;
}
