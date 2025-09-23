document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const pageTitle = body.dataset.title || 'Avukat Deniz Naz Baydar';
    const activeLink = body.dataset.activeLink || 'index.html';

    const setupLayout = (title, link) => {
        document.title = `${title} - John Doe, Attorney at Law`;

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
                if (mobileMenuButton) {
                    mobileMenuButton.addEventListener('click', function() {
                        document.getElementById('mobile-menu').classList.toggle('hidden');
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
