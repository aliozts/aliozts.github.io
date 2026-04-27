const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Read content.json
const contentData = JSON.parse(fs.readFileSync('./content.json', 'utf8'));
const blogs = contentData.blogs;

// Read the blog-post.html template
const templateHtml = fs.readFileSync('./blog-post.html', 'utf8');

// Create a directory for pre-rendered pages if it doesn't exist
const outputDir = './blog-posts';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Pre-render each blog post
blogs.forEach(post => {
    const BASE_URL = 'https://deniznazbaydar.av.tr';
    const absoluteUrl = `${BASE_URL}/blog-posts/${post.id}.html`;
    const desc = post.description || '';
    const imgAbs = post.image ? `${BASE_URL}/${post.image}` : `${BASE_URL}/images/portrait.jpeg`;

    // Read and convert markdown to HTML
    let markdownContent = '';
    let htmlContent = '';
    try {
        markdownContent = fs.readFileSync(post.file, 'utf8');
        htmlContent = marked.parse(markdownContent);
    } catch (err) {
        console.error(`Error reading markdown file ${post.file}:`, err.message);
        htmlContent = '<p class="text-center text-red-500">Makale içeriği yüklenemedi.</p>';
    }

    // Replace meta tags in the template
    let renderedHtml = templateHtml;

    // Update title
    renderedHtml = renderedHtml.replace(
        '<title>Makale – Av. Deniz Naz Baydar</title>',
        `<title>${post.title} - Av. Deniz Naz Baydar</title>`
    );

    // Update canonical URL
    renderedHtml = renderedHtml.replace(
        /const canonicalUrl = postId[^;]+;/,
        `const canonicalUrl = '${absoluteUrl}';`
    );

    // Update OG meta tags
    renderedHtml = renderedHtml.replace(
        '<meta id="og-title" property="og:title" content="" />',
        `<meta id="og-title" property="og:title" content="${post.title}" />`
    );

    renderedHtml = renderedHtml.replace(
        '<meta id="og-description" property="og:description" content="" />',
        `<meta id="og-description" property="og:description" content="${desc}" />`
    );

    renderedHtml = renderedHtml.replace(
        '<meta id="og-image" property="og:image" content="" />',
        `<meta id="og-image" property="og:image" content="${imgAbs}" />`
    );

    renderedHtml = renderedHtml.replace(
        '<meta id="og-url" property="og:url" content="" />',
        `<meta id="og-url" property="og:url" content="${absoluteUrl}" />`
    );

    // Update Twitter meta tags
    renderedHtml = renderedHtml.replace(
        '<meta id="twitter-title" name="twitter:title" content="" />',
        `<meta id="twitter-title" name="twitter:title" content="${post.title}" />`
    );

    renderedHtml = renderedHtml.replace(
        '<meta id="twitter-description" name="twitter:description" content="" />',
        `<meta id="twitter-description" name="twitter:description" content="${desc}" />`
    );

    renderedHtml = renderedHtml.replace(
        '<meta id="twitter-image" name="twitter:image" content="" />',
        `<meta id="twitter-image" name="twitter:image" content="${imgAbs}" />`
    );

    // Update article meta tags
    renderedHtml = renderedHtml.replace(
        '<meta id="article-author" property="article:author" content="" />',
        `<meta id="article-author" property="article:author" content="Av. Deniz Naz Baydar" />`
    );

    if (post.date) {
        renderedHtml = renderedHtml.replace(
            '<meta id="article-published" property="article:published_time" content="" />',
            `<meta id="article-published" property="article:published_time" content="${post.date}" />`
        );
    }

    if (post.category) {
        renderedHtml = renderedHtml.replace(
            '<meta id="article-section" property="article:section" content="" />',
            `<meta id="article-section" property="article:section" content="${post.category}" />`
        );
    }

    if (post.tags) {
        renderedHtml = renderedHtml.replace(
            '<meta id="article-tags" property="article:tag" content="" />',
            `<meta id="article-tags" property="article:tag" content="${post.tags.join(', ')}" />`
        );
    }

    // Update standard meta description
    renderedHtml = renderedHtml.replace(
        '<meta id="meta-description" name="description" content="Hukuki konularda bilgilendirici makale." />',
        `<meta id="meta-description" name="description" content="${desc}" />`
    );

    // Update keywords
    if (post.keywords) {
        renderedHtml = renderedHtml.replace(
            '<meta id="meta-keywords" name="keywords" content="" />',
            `<meta id="meta-keywords" name="keywords" content="${post.keywords}" />`
        );
    }

    // Update post title in the H1
    renderedHtml = renderedHtml.replace(
        '<h1 id="post-title" class="text-4xl font-bold mb-6 text-center"></h1>',
        `<h1 id="post-title" class="text-4xl font-bold mb-6 text-center">${post.title}</h1>`
    );

    // Show image if it exists
    if (post.image) {
        renderedHtml = renderedHtml.replace(
            '<div id="post-image-wrapper" class="mb-6 hidden flex justify-center">',
            '<div id="post-image-wrapper" class="mb-6 flex justify-center">'
        );
        renderedHtml = renderedHtml.replace(
            '<img id="post-image" src="" alt=""',
            `<img id="post-image" src="/${post.image}" alt="${post.title}"`
        );
    }

    // Inject the actual markdown content into the article tag
    renderedHtml = renderedHtml.replace(
        '<article id="post-content" class="text-lg md:text-xl leading-relaxed md:leading-loose space-y-6 max-w-4xl mx-auto text-justify">\n                    <!-- Full post content will be injected here -->\n                </article>',
        `<article id="post-content" class="text-lg md:text-xl leading-relaxed md:leading-loose space-y-6 max-w-4xl mx-auto text-justify">\n${htmlContent}\n                </article>`
    );

    // Extract potential FAQ items from markdown content
    const faqItems = [];
    const questionMatches = markdownContent.matchAll(/\*\*([^*?]+\?)\*\*/g);
    for (const match of questionMatches) {
        const question = match[1].trim();
        // Look for the next paragraph after the question
        const startIndex = match.index + match[0].length;
        const remainingContent = markdownContent.substring(startIndex).trim();
        const answerMatch = remainingContent.split('\n\n')[0].trim();
        
        if (answerMatch && answerMatch.length > 20 && answerMatch.length < 500) {
            faqItems.push({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answerMatch.replace(/\*\*/g, '').replace(/·/g, '').trim()
                }
            });
        }
    }

    // Add JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": desc,
        "image": [imgAbs],
        "datePublished": post.date || undefined,
        "dateModified": post.dateModified || post.date || undefined,
        "author": { "@type": "Person", "name": "Av. Deniz Naz Baydar" },
        "publisher": {
            "@type": "Organization",
            "name": "Av. Deniz Naz Baydar",
            "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/images/buro_logo.png`
            }
        },
        "mainEntityOfPage": absoluteUrl
    };

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type":"ListItem","position":1,"name":"Ana Sayfa","item":`${BASE_URL}/`},
            {"@type":"ListItem","position":2,"name":"Makaleler","item":`${BASE_URL}/blog.html`},
            {"@type":"ListItem","position":3,"name":post.title,"item":absoluteUrl}
        ]
    };

    let faqLdScript = '';
    if (faqItems.length > 0) {
        const faqLd = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.slice(0, 5) // Limit to first 5 FAQ items
        };
        faqLdScript = `
    <script type="application/ld+json">
    ${JSON.stringify(faqLd, null, 2)}
    </script>`;
    }

    // Insert JSON-LD before </head>
    const jsonLdScript = `
    <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
    </script>
    <script type="application/ld+json">
    ${JSON.stringify(breadcrumbLd, null, 2)}
    </script>${faqLdScript}
</head>`;

    renderedHtml = renderedHtml.replace('</head>', jsonLdScript);

    // Remove/disable the JavaScript that would fetch and render content
    // Replace the blog-post.js script tag with a comment
    renderedHtml = renderedHtml.replace(
        '<script src="blog-post.js" defer></script>',
        '<!-- Content is pre-rendered, blog-post.js not needed -->'
    );

    // Remove the marked.js dependency since content is pre-rendered
    renderedHtml = renderedHtml.replace(
        '<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>',
        '<!-- marked.js not needed for pre-rendered content -->'
    );

    // Fix "Geri Dön" link for pre-rendered pages in subdirectory
    renderedHtml = renderedHtml.replace(
        'href="blog.html"',
        'href="../blog.html"'
    );

    // Fix layout.js path for pre-rendered pages in subdirectory
    renderedHtml = renderedHtml.replace(
        'src="layout.js"',
        'src="../layout.js"'
    );

    // Write the pre-rendered HTML file
    const outputPath = path.join(outputDir, `${post.id}.html`);
    fs.writeFileSync(outputPath, renderedHtml);
    console.log(`✓ Pre-rendered: ${post.id}.html`);
});

console.log(`\n✓ Successfully pre-rendered ${blogs.length} blog posts to ${outputDir}/`);
console.log('  ✓ Full markdown content is now server-side rendered');
console.log('  ✓ Social sharing previews will work correctly');
console.log('  ✓ Google can index full content without JavaScript');
