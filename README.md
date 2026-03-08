# lawyer-website
Lawyer website

## SEO Optimization

### Pre-rendering Blog Posts

To ensure fast Google indexing and proper social media sharing previews, blog posts are pre-rendered with all meta tags filled in.

**After adding or updating blog posts in `content.json`, run:**

```bash
node prerender-blog-posts.js
node generate-sitemap.js
```

This will:
1. Generate static HTML files in `blog-posts/` with all meta tags AND full content pre-rendered
2. Update the sitemap with the new URLs
3. Enable social media platforms (Facebook, Twitter, LinkedIn) to show proper previews
4. Allow Google to index full blog content without JavaScript execution
5. Speed up Google's indexing process significantly
