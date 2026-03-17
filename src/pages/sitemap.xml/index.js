import { BRAND } from '../../lib/brandConfig';
import {
  absoluteSitemapUrl,
  renderSitemapIndex,
  writeXmlResponse,
} from '../../lib/sitemap';

export async function getServerSideProps({ res }) {
  const now = new Date().toISOString();
  const sitemap = renderSitemapIndex([
    {
      loc: absoluteSitemapUrl('/sitemap-base.xml', BRAND.siteUrl),
      lastmod: now,
    },
    { loc: absoluteSitemapUrl('/sitemap-en.xml', BRAND.siteUrl), lastmod: now },
    { loc: absoluteSitemapUrl('/sitemap-es.xml', BRAND.siteUrl), lastmod: now },
  ]);

  writeXmlResponse(res, sitemap);

  return { props: {} };
}

export default function SitemapIndex() {
  return null;
}
