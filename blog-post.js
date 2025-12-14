document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        const contentDiv = document.querySelector('main');
        if(contentDiv) contentDiv.innerHTML = '<p class="text-center text-red-500">Article not found.</p>';
        return;
    }

    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const post = data.blogs.find(p => p.id === postId);

            if (post) {
                document.title = `${post.title} - Av. Deniz Naz Baydar`;
                const titleElement = document.getElementById('post-title');
                if (titleElement) titleElement.textContent = post.title;

                // Render optional post image if provided in content.json
                const imageWrapper = document.getElementById('post-image-wrapper');
                const imageEl = document.getElementById('post-image');
                if (post.image && imageWrapper && imageEl) {
                    imageEl.src = post.image;
                    imageEl.alt = post.title || 'Blog post image';
                    imageWrapper.classList.remove('hidden');
                }

                // Fetch the markdown file content
                fetch(post.file)
                    .then(response => response.text())
                    .then(markdown => {
                        const contentElement = document.getElementById('post-content');
                        if (contentElement) {
                            // Use marked library to convert markdown to HTML
                            contentElement.innerHTML = marked.parse(markdown);
                        }
                    });
            } else {
                const contentDiv = document.querySelector('main');
                if(contentDiv) contentDiv.innerHTML = '<p class="text-center text-red-500">Article not found.</p>';
            }
        })
        .catch(error => console.error('Error loading blog post:', error));
});