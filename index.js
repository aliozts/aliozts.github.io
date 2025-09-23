document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const homeContent = data.home;

            // Populate Hero Section
            const heroTitle = document.getElementById('hero-title');
            const heroSubtitle = document.getElementById('hero-subtitle');
            if (heroTitle) heroTitle.textContent = homeContent.hero.title;
            if (heroSubtitle) heroSubtitle.textContent = homeContent.hero.subtitle;

            // Populate Commitment Section
            const commitmentTitle = document.getElementById('commitment-title');
            if(commitmentTitle) commitmentTitle.textContent = homeContent.commitment.title;

            const featuresGrid = document.getElementById('commitment-features-grid');
            if (featuresGrid && homeContent.commitment.features) {
                const featureCount = homeContent.commitment.features.length;

                if (featureCount === 2) {
                    featuresGrid.classList.remove('lg:grid-cols-3');
                    featuresGrid.classList.add('lg:grid-cols-2');
                } else if (featureCount === 1) {
                    featuresGrid.classList.remove('lg:grid-cols-3', 'lg:grid-cols-2');
                    featuresGrid.classList.add('lg:grid-cols-1');
                }

                featuresGrid.innerHTML = ''; // Clear existing static content
                homeContent.commitment.features.forEach(feature => {
                    const featureHtml = `
                        <div class="flex flex-col items-center">
                            <div class="bg-blue-100 rounded-full p-4 mb-4">
                                <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 class="text-2xl font-bold mb-2">${feature.title}</h3>
                            <p class="text-gray-600">${feature.description}</p>
                        </div>
                    `;
                    featuresGrid.innerHTML += featureHtml;
                });
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing content:', error);
        });
});
