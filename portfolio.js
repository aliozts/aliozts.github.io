document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const portfolioContent = data.portfolio;
            const accordionContainer = document.getElementById('accordion-container');
            const pageTitleElement = document.getElementById('portfolio-title');

            if (pageTitleElement && portfolioContent.title) {
                pageTitleElement.textContent = portfolioContent.title;
            }

            if (accordionContainer && portfolioContent.practiceAreas) {
                portfolioContent.practiceAreas.forEach(area => {
                    const item = document.createElement('div');
                    item.className = 'border-b border-gray-200';
                    item.innerHTML = `
                        <button class="accordion-button w-full text-left p-4 focus:outline-none flex justify-between items-center">
                            <span class="text-xl font-bold">${area.title}</span>
                            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="accordion-content">
                            <p class="p-4 text-lg text-gray-700 text-left">${area.content}</p>
                        </div>
                    `;
                    accordionContainer.appendChild(item);
                });

                accordionContainer.addEventListener('click', (event) => {
                    const button = event.target.closest('.accordion-button');
                    if (!button) return;

                    const content = button.nextElementSibling;
                    button.classList.toggle('active');

                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        })
        .catch(error => console.error('Error loading portfolio content:', error));
});