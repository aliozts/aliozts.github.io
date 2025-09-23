document.addEventListener('DOMContentLoaded', function() {
    const addPostBtn = document.getElementById('add-blog-post-btn');
    if (addPostBtn) {
        addPostBtn.addEventListener('click', handleAddBlogPost);
    }
});

function handleAddBlogPost() {
    const blogSection = document.getElementById('blog-posts-container');
    const newPostContainer = document.querySelector('.new-post-container');
    
    if (newPostContainer) {
        newPostContainer.remove();
    }

    const formHtml = `
        <div class="new-post-container bg-white p-8 rounded-lg shadow-md mt-8">
            <h3 class="text-2xl font-bold mb-4">Create New Post</h3>
            <div class="space-y-4">
                <div>
                    <label for="post-title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" id="post-title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div>
                    <label for="post-content" class="block text-sm font-medium text-gray-700">Content</label>
                    <textarea id="post-content" rows="5" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                </div>
                <div class="text-right">
                    <button id="cancel-post-btn" class="bg-gray-300 text-gray-800 font-bold rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors duration-300 mr-2">Cancel</button>
                    <button id="save-post-btn" class="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors duration-300">Save Post</button>
                </div>
            </div>
        </div>
    `;
    
    blogSection.parentElement.insertAdjacentHTML('beforeend', formHtml);

    document.getElementById('save-post-btn').addEventListener('click', handleSavePost);
    document.getElementById('cancel-post-btn').addEventListener('click', handleCancelPost);
}

function handleSavePost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (title && content) {
        const newPostHtml = `
            <div class="bg-white p-8 rounded-lg shadow-md">
                <h3 class="text-2xl font-bold mb-2">${title}</h3>
                <p class="text-gray-500 mb-4">Published on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p class="text-lg leading-relaxed">${content}</p>
                <a href="#" class="text-blue-600 hover:underline mt-4 inline-block">Read More</a>
            </div>
        `;
        document.getElementById('blog-posts-container').insertAdjacentHTML('afterbegin', newPostHtml);
        document.querySelector('.new-post-container').remove();
    } else {
        console.log("Please fill out both title and content."); 
    }
}

function handleCancelPost() {
    document.querySelector('.new-post-container').remove();
}