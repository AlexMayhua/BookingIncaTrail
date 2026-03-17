import { BRAND } from '../../lib/brandConfig';
import {
  getBaseSitemapEntries,
  renderUrlSet,
  writeXmlResponse,
} from '../../lib/sitemap';

export async function getServerSideProps({ res }) {
  const sitemap = renderUrlSet(getBaseSitemapEntries(BRAND.siteUrl));

  writeXmlResponse(res, sitemap);

  return { props: {} };
}

export default function SitemapBase() {
  return null;
}
