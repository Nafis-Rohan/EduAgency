/**
 * Load HTML includes for navbar and footer
 */
async function loadIncludes() {
    try {
        // Load navbar
        const navbarResponse = await fetch('includes/navbar.html');
        const navbarHTML = await navbarResponse.text();
        const navbarPlaceholder = document.querySelector('nav.navbar') || document.querySelector('[data-include="navbar"]');
        if (navbarPlaceholder) {
            navbarPlaceholder.outerHTML = navbarHTML;
        } else {
            // Insert before body content
            const body = document.body;
            const firstChild = body.firstElementChild;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = navbarHTML;
            body.insertBefore(tempDiv.firstElementChild, firstChild);
        }

        // Load footer
        const footerResponse = await fetch('includes/footer.html');
        const footerHTML = await footerResponse.text();
        const footerPlaceholder = document.querySelector('footer.footer') || document.querySelector('[data-include="footer"]');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = footerHTML;
        } else {
            // Append to body
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = footerHTML;
            while (tempDiv.firstChild) {
                document.body.appendChild(tempDiv.firstChild);
            }
        }

        // Set active nav link after loading
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        const navLinks = document.querySelectorAll('.navbar-menu a[data-page]');
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            }
        });

        // Re-initialize mobile menu toggle after loading
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navbarMenu = document.querySelector('.navbar-menu');
        
        if (mobileMenuToggle && navbarMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                navbarMenu.classList.toggle('active');
                this.innerHTML = navbarMenu.classList.contains('active') ? '✕' : '☰';
            });

            const menuLinks = navbarMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navbarMenu.classList.remove('active');
                    mobileMenuToggle.innerHTML = '☰';
                });
            });
        }
    } catch (error) {
        console.error('Error loading includes:', error);
    }
}

// Load includes when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
} else {
    loadIncludes();
}
