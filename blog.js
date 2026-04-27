document.addEventListener('DOMContentLoaded', () => {
    fetch('/content.json')
        .then(response => response.json())
        .then(data => {
            let blogPosts = data.blogs;
            const blogContainer = document.getElementById('blog-posts-container');

            if (blogContainer && blogPosts) {
                // Sort blog posts by date (newest first)
                blogPosts = blogPosts.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA; // Descending order (newest first)
                });

                blogContainer.innerHTML = ''; // Clear static content
                blogPosts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100';
                    postElement.innerHTML = `
                        <h3 class="text-2xl font-bold mb-3 text-gray-900">${post.title}</h3>
                        <p class="text-gray-600 leading-relaxed mb-4">${post.description}</p>
                        <a href="blog-posts/${post.id}.html" class="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center">
                            Devamını Oku 
                            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    `;
                    blogContainer.appendChild(postElement);
                });
            }
        })
        .catch(error => console.error('Error loading blog content:', error));
});