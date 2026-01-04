document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const pageTitle = body.dataset.title || 'Avukat Deniz Naz Baydar';
    const activeLink = body.dataset.activeLink || 'index.html';

    const setupLayout = (title, link) => {
        // Only set the title if it's empty; otherwise keep the static/SEO-optimized one
        if (!document.title || document.title.trim() === '') {
            document.title = `${title} - Avukat Deniz Naz Baydar`;
        }

        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(html => {
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = html;
                }

                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(navLink => {
                    if (navLink.getAttribute('href') === link) {
                        navLink.classList.add('active');
                    }
                });

                const mobileMenuButton = document.getElementById('mobile-menu-button');
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenuButton && mobileMenu) {
                    mobileMenuButton.addEventListener('click', function() {
                        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
                        mobileMenu.classList.toggle('hidden');
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching header:', error);
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = '<p class="text-red-500 text-center">Error: Could not load page header.</p>';
                }
            });
    };

    setupLayout(pageTitle, activeLink);
});
