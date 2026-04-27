document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const pageTitle = body.dataset.title || 'Avukat Deniz Naz Baydar';
    const activeLink = body.dataset.activeLink || 'index.html';

    const setupLayout = (title, link) => {
        // Normalize link for active class matching
        const normalizedActiveLink = (link === 'index.html' || link === '/' || link === '') ? '/' : (link.startsWith('/') ? link : '/' + link);

        // Only set the title if it's empty; otherwise keep the static/SEO-optimized one
        if (!document.title || document.title.trim() === '') {
            document.title = `${title} - Avukat Deniz Naz Baydar`;
        }

        fetch('/header.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(html => {
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = html;
                }

                // Add Floating Action Button (Mobile Only)
                const fabContainer = document.createElement('div');
                fabContainer.className = 'fixed bottom-6 right-6 flex flex-col space-y-4 z-50 md:hidden';
                fabContainer.innerHTML = `
                    <a href="https://wa.me/905343349235" target="_blank" rel="noopener noreferrer" 
                       class="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-transform hover:scale-110 flex items-center justify-center"
                       aria-label="WhatsApp üzerinden iletişime geçin">
                        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </a>
                    <a href="tel:+905343349235" 
                       class="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-transform hover:scale-110 flex items-center justify-center"
                       aria-label="Telefon ile arayın">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </a>
                `;
                document.body.appendChild(fabContainer);

                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(navLink => {
                    const href = navLink.getAttribute('href');
                    const normalizedHref = (href === 'index.html' || href === '/') ? '/' : (href.startsWith('/') ? href : '/' + href);
                    if (normalizedHref === normalizedActiveLink) {
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
