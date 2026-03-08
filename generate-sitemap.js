const fs = require('fs');
const path = require('path');

// Read content.json
const contentPath = path.join(__dirname, 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Base URL
const BASE_URL = 'https://deniznazbaydar.av.tr';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Start building sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/blog.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/contact.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Blog Posts -->
`;

// Add all blog posts from content.json (pre-rendered versions)
content.blogs.forEach(blog => {
  sitemap += `  <url>
    <loc>${BASE_URL}/blog-posts/${blog.id}.html</loc>
    <lastmod>${blog.date}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1.0</priority>
  </url>
`;
});

// Close sitemap
sitemap += `</urlset>
`;

// Write sitemap.xml
const sitemapPath = path.join(__dirname, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

console.log('✅ Sitemap generated successfully!');
console.log(`📄 Total blog posts: ${content.blogs.length}`);
