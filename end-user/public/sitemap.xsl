<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sitemap">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <!-- root handler: kalau urlset -->
  <xsl:template match="/sitemap:urlset">
    <html>
      <head>
        <title>XML Sitemap</title>
        <meta charset="UTF-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #fff; color: #333; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          p { margin-bottom: 16px; }
          table { border-collapse: collapse; width: 100%; max-width: 1080px; }
          th, td { border: 1px solid #ddd; padding: 6px 10px; font-size: 14px; }
          th { background: #f5f5f5; text-align: left; }
          tr:nth-child(even) { background: #fafafa; }
          .small { font-size: 13px; color: #666; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p class="small">This XML Sitemap contains <xsl:value-of select="count(sitemap:url)"/> URLs.</p>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Mod.</th>
          </tr>
          <xsl:for-each select="sitemap:url">
            <tr>
              <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
              <td><xsl:value-of select="sitemap:lastmod"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>

  <!-- root handler: kalau sitemapindex -->
  <xsl:template match="/sitemap:sitemapindex">
    <html>
      <head>
        <title>XML Sitemap Index</title>
        <meta charset="UTF-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #fff; color: #333; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          p { margin-bottom: 16px; }
          table { border-collapse: collapse; width: 100%; max-width: 1080px; }
          th, td { border: 1px solid #ddd; padding: 6px 10px; font-size: 14px; }
          th { background: #f5f5f5; text-align: left; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap Index</h1>
        <p>This XML Sitemap contains <xsl:value-of select="count(sitemap:sitemap)"/> sitemaps.</p>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Mod.</th>
          </tr>
          <xsl:for-each select="sitemap:sitemap">
            <tr>
              <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
              <td><xsl:value-of select="sitemap:lastmod"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
