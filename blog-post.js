document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        const contentDiv = document.querySelector('main');
        if(contentDiv) contentDiv.innerHTML = '<p class="text-center text-red-500">Makale bulunamadı.</p>';
        return;
    }

    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const post = data.blogs.find(p => p.id === postId);

            if (post) {
                const BASE_URL = 'https://deniznazbaydar.av.tr';
                const absoluteUrl = `${BASE_URL}/blog-post.html?id=${post.id}`;
                const desc = post.description || '';
                const imgAbs = post.image ? `${BASE_URL}/${post.image}` : `${BASE_URL}/images/portrait.jpeg`;

                // Title & heading
                document.title = `${post.title} - Av. Deniz Naz Baydar`;
                const titleElement = document.getElementById('post-title');
                if (titleElement) titleElement.textContent = post.title;

                // Render optional post image if provided in content.json
                const imageWrapper = document.getElementById('post-image-wrapper');
                const imageEl = document.getElementById('post-image');
                if (post.image && imageWrapper && imageEl) {
                    imageEl.src = post.image;
                    imageEl.alt = post.title || 'Blog yazısı görseli';
                    imageWrapper.classList.remove('hidden');
                }

                // Canonical & URL
                let canonicalEl = document.querySelector('link[rel="canonical"]');
                if (canonicalEl) {
                    canonicalEl.href = absoluteUrl;
                }
                const ogUrl = document.getElementById('og-url');
                if (ogUrl) ogUrl.setAttribute('content', absoluteUrl);

                // Descriptions
                const md = document.getElementById('meta-description');
                if (md) md.setAttribute('content', desc);

                // Keywords
                const keywords = document.getElementById('meta-keywords');
                if (keywords && post.keywords) keywords.setAttribute('content', post.keywords);

                // OG / Twitter
                const ogTitle = document.getElementById('og-title'); if (ogTitle) ogTitle.setAttribute('content', post.title);
                const ogDesc  = document.getElementById('og-description'); if (ogDesc) ogDesc.setAttribute('content', desc);
                const ogImg   = document.getElementById('og-image'); if (ogImg) ogImg.setAttribute('content', imgAbs);
                const twTitle = document.getElementById('twitter-title'); if (twTitle) twTitle.setAttribute('content', post.title);
                const twDesc  = document.getElementById('twitter-description'); if (twDesc) twDesc.setAttribute('content', desc);
                const twImg   = document.getElementById('twitter-image'); if (twImg) twImg.setAttribute('content', imgAbs);

                // Article meta tags
                const articleAuthor = document.getElementById('article-author');
                if (articleAuthor) articleAuthor.setAttribute('content', 'Av. Deniz Naz Baydar');

                const articlePublished = document.getElementById('article-published');
                if (articlePublished && post.date) articlePublished.setAttribute('content', post.date);

                const articleSection = document.getElementById('article-section');
                if (articleSection && post.category) articleSection.setAttribute('content', post.category);

                const articleTags = document.getElementById('article-tags');
                if (articleTags && post.tags) articleTags.setAttribute('content', post.tags.join(', '));

                // Fetch the markdown file content
                fetch(post.file)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Markdown file not found: ${post.file}`);
                        }
                        return response.text();
                    })
                    .then(markdown => {
                        const contentElement = document.getElementById('post-content');
                        if (contentElement) {
                            // Use marked library to convert markdown to HTML
                            if (typeof marked.parse === 'function') {
                                contentElement.innerHTML = marked.parse(markdown);
                            } else {
                                contentElement.innerHTML = marked(markdown);
                            }
                        }
                    })
                    .catch(err => {
                        console.error('Error fetching markdown:', err);
                        const contentElement = document.getElementById('post-content');
                        if (contentElement) {
                            contentElement.innerHTML = `<p class="text-center text-red-500">Makale içeriği yüklenemedi: ${err.message}</p>`;
                        }
                    });

                // JSON-LD: BlogPosting + Breadcrumbs
                const jsonLd = {
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": post.title,
                    "description": desc,
                    "image": [imgAbs],
                    "datePublished": post.datePublished || undefined,
                    "dateModified": post.dateModified || post.datePublished || undefined,
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

                function addLd(obj){
                    const s = document.createElement('script');
                    s.type = 'application/ld+json';
                    s.text = JSON.stringify(obj);
                    document.head.appendChild(s);
                }
                addLd(jsonLd);
                addLd(breadcrumbLd);

            } else {
                const contentDiv = document.querySelector('main');
                if(contentDiv) contentDiv.innerHTML = '<p class="text-center text-red-500">Makale bulunamadı.</p>';
            }
        })
        .catch(error => console.error('Error loading blog post:', error));
});