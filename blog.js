document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const blogPosts = data.blogs;
            const blogContainer = document.getElementById('blog-posts-container');

            if (blogContainer && blogPosts) {
                blogContainer.innerHTML = ''; // Clear static content
                blogPosts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'bg-white p-8 rounded-lg shadow-md';
                    postElement.innerHTML = `
                        <h3 class="text-2xl font-bold mb-2">${post.title}</h3>
                        <p class="text-lg leading-relaxed">${post.description}</p>
                        <a href="blog-post.html?id=${post.id}" class="text-blue-600 hover:underline mt-4 inline-block">Devamını Oku &rarr;</a>
                    `;
                    blogContainer.appendChild(postElement);
                });
            }
        })
        .catch(error => console.error('Error loading blog content:', error));
});