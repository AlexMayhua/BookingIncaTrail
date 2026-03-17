<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Sitemap</title>
        <style>
          :root {
            color-scheme: light;
            --bg: #f4efe7;
            --surface: rgba(255, 255, 255, 0.88);
            --border: #d9c8af;
            --text: #1f2937;
            --muted: #6b7280;
            --accent: #b45309;
            --accent-soft: rgba(180, 83, 9, 0.12);
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--text);
            background:
              radial-gradient(circle at top left, rgba(245, 158, 11, 0.16), transparent 30%),
              linear-gradient(180deg, #fcfaf7 0%, var(--bg) 100%);
          }

          .wrap {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px 56px;
          }

          .hero {
            margin-bottom: 24px;
            padding: 24px 28px;
            border: 1px solid var(--border);
            border-radius: 24px;
            background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,248,235,0.92));
            box-shadow: 0 18px 48px rgba(146, 64, 14, 0.08);
          }

          h1 {
            margin: 0 0 8px;
            font-size: 2rem;
            line-height: 1.1;
          }

          p {
            margin: 0;
            color: var(--muted);
            line-height: 1.6;
          }

          .badge {
            display: inline-flex;
            margin-top: 14px;
            padding: 8px 12px;
            border-radius: 999px;
            background: var(--accent-soft);
            color: var(--accent);
            font-weight: 600;
            font-size: 0.92rem;
          }

          .table-shell {
            overflow: hidden;
            border: 1px solid var(--border);
            border-radius: 24px;
            background: var(--surface);
            box-shadow: 0 22px 54px rgba(15, 23, 42, 0.08);
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead {
            background: rgba(255, 248, 235, 0.96);
          }

          th,
          td {
            padding: 14px 18px;
            text-align: left;
            border-bottom: 1px solid rgba(217, 200, 175, 0.55);
            vertical-align: top;
          }

          th {
            font-size: 0.8rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--muted);
          }

          tbody tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.74);
          }

          td a {
            color: var(--accent);
            text-decoration: none;
            word-break: break-word;
          }

          td a:hover {
            text-decoration: underline;
          }

          .mono {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="hero">
            <h1>Sitemap Explorer</h1>
            <xsl:choose>
              <xsl:when test="sitemap:sitemapindex">
                <p>This sitemap index lists the sitemap files available for search engines.</p>
                <div class="badge">
                  <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)" />
                  <xsl:text> sitemap files</xsl:text>
                </div>
              </xsl:when>
              <xsl:otherwise>
                <p>This sitemap lists canonical URLs ready for crawling.</p>
                <div class="badge">
                  <xsl:value-of select="count(sitemap:urlset/sitemap:url)" />
                  <xsl:text> URLs</xsl:text>
                </div>
              </xsl:otherwise>
            </xsl:choose>
          </div>

          <div class="table-shell">
            <xsl:choose>
              <xsl:when test="sitemap:sitemapindex">
                <table>
                  <thead>
                    <tr>
                      <th>Sitemap</th>
                      <th>Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                      <tr>
                        <td class="mono">
                          <a href="{sitemap:loc}">
                            <xsl:value-of select="sitemap:loc" />
                          </a>
                        </td>
                        <td class="mono">
                          <xsl:value-of select="sitemap:lastmod" />
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:when>
              <xsl:otherwise>
                <table>
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th>Last Modified</th>
                      <th>Changefreq</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                      <tr>
                        <td class="mono">
                          <a href="{sitemap:loc}">
                            <xsl:value-of select="sitemap:loc" />
                          </a>
                        </td>
                        <td class="mono">
                          <xsl:value-of select="sitemap:lastmod" />
                        </td>
                        <td>
                          <xsl:value-of select="sitemap:changefreq" />
                        </td>
                        <td>
                          <xsl:value-of select="sitemap:priority" />
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:otherwise>
            </xsl:choose>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>