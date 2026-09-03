/* ============================================
   RAJ ADMISSION - JAVASCRIPT
   ============================================ */

    // Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const navLinks = document.querySelectorAll('.navbar-menu a[data-page]');
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });

    // Navbar scroll effect: shrink/shadow on scroll, hide on scroll down, reveal on scroll up
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollY = window.scrollY;
        let ticking = false;
        const REVEAL_DELTA = 5;    // ignore micro-scrolls / trackpad jitter
        const HIDE_AFTER = 200;    // don't hide until we're this far down the page

        const updateNavbar = function() {
            const currentY = window.scrollY;

            // Solid background + shadow once scrolled past the top
            navbar.classList.toggle('scrolled', currentY > 50);

            const diff = currentY - lastScrollY;

            // Keep the navbar visible while the mobile menu is open
            const menuOpen = document.querySelector('.navbar-menu.active');

            if (Math.abs(diff) > REVEAL_DELTA && !menuOpen) {
                if (diff > 0 && currentY > HIDE_AFTER) {
                    navbar.classList.add('nav-hidden');   // scrolling down
                } else if (diff < 0) {
                    navbar.classList.remove('nav-hidden'); // scrolling up
                }
            }

            // Always show at the very top
            if (currentY <= HIDE_AFTER) {
                navbar.classList.remove('nav-hidden');
            }

            lastScrollY = currentY;
            ticking = false;
        };

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (mobileMenuToggle && navbarMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            // Never leave the navbar hidden while the menu is open
            if (navbar) navbar.classList.remove('nav-hidden');
            this.innerHTML = navbarMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking on a link
        const menuLinks = navbarMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarMenu.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Apply Form Handling
    const applyForm = document.getElementById('applyForm');
    if (applyForm) {
        applyForm.addEventListener('submit', handleFormSubmit);
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // University partners auto-scroll: in view = small scroll right; every 5s one step; at end = small scroll left
    const uniScroll = document.querySelector('#universityScroll');
    const partnersSection = document.querySelector('#partners');
    if (uniScroll && partnersSection) {
        const oneLogo = 250;
        const stepDelay = 1500; /* 2x faster: step every 1.5s */
        let direction = 1;
        let stepTimer = null;
        let isInView = false;

        function doSmallScroll() {
            const maxScroll = uniScroll.scrollWidth - uniScroll.clientWidth;
            if (maxScroll <= 0) return;

            const current = uniScroll.scrollLeft;

            if (direction === 1) {
                let target = Math.min(current + oneLogo, maxScroll);
                if (target >= maxScroll) direction = -1;
                uniScroll.scrollTo({ left: target, behavior: 'smooth' });
            } else {
                let target = Math.max(current - oneLogo, 0);
                if (target <= 0) direction = 1;
                uniScroll.scrollTo({ left: target, behavior: 'smooth' });
            }
        }

        function scheduleNext() {
            if (!isInView) return;
            stepTimer = setTimeout(function() {
                doSmallScroll();
                scheduleNext();
            }, stepDelay);
        }

        function stopScroll() {
            if (stepTimer) {
                clearTimeout(stepTimer);
                stepTimer = null;
            }
        }

        function startAutoScroll() {
            isInView = true;
            stopScroll();
            // Small delay so layout/scrollWidth is ready
            setTimeout(function() {
                doSmallScroll();
                scheduleNext();
            }, 400);
        }

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                isInView = entry.isIntersecting;
                if (isInView) {
                    startAutoScroll();
                } else {
                    stopScroll();
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        observer.observe(partnersSection);

        uniScroll.addEventListener('mouseenter', stopScroll);
        uniScroll.addEventListener('mouseleave', function() {
            if (isInView) scheduleNext();
        });
    }

    // Testimonials slider with dots
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        const slides = testimonialSlider.querySelectorAll('.testimonials-slide');
        const dots = testimonialSlider.querySelectorAll('.testimonial-dot');
        let currentIndex = 0;

        const showSlide = (index) => {
            if (!slides.length) return;
            currentIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIndex);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.getAttribute('data-index'), 10);
                showSlide(idx);
            });
        });

        // Auto-rotate every 5 seconds (2x faster)
        const testimonialInterval = 5000;
        let testimonialTimer = setInterval(() => showSlide(currentIndex + 1), testimonialInterval);
        testimonialSlider.addEventListener('mouseenter', () => clearInterval(testimonialTimer));
        testimonialSlider.addEventListener('mouseleave', () => {
            testimonialTimer = setInterval(() => showSlide(currentIndex + 1), testimonialInterval);
        });

        showSlide(0);
    }
});

// Form Submission Handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.form-submit');
    const originalButtonText = submitButton.textContent;
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Collect form data
    const formData = {
        fullName: form.querySelector('#fullName').value.trim(),
        phone: form.querySelector('#phone').value.trim(),
        email: form.querySelector('#email').value.trim(),
        settlementStatus: form.querySelector('#settlementStatus').value,
        universityHistory: form.querySelector('#universityHistory').value,
        postalCode: form.querySelector('#postalCode').value.trim(),
        city: form.querySelector('#city').value.trim(),
        termsAccepted: form.querySelector('#termsAccepted').checked
    };
    
    // Validate form
    if (!validateForm(formData)) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        return;
    }
    
    try {
        // Send data to PHP endpoint
        const response = await fetch('send-mail.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Show success message
            showAlert('success', 'Application Submitted! We will contact you soon.');
            
            // Reset form
            form.reset();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Show error message
            showAlert('error', result.message || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'Network error. Please check your connection and try again.');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Form Validation
function validateForm(data) {
    // Check required fields
    if (!data.fullName) {
        showAlert('error', 'Please enter your full name.');
        return false;
    }
    
    if (!data.phone) {
        showAlert('error', 'Please enter your phone number.');
        return false;
    }
    
    if (!data.email) {
        showAlert('error', 'Please enter your email address.');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showAlert('error', 'Please enter a valid email address.');
        return false;
    }
    
    if (!data.settlementStatus) {
        showAlert('error', 'Please select your settlement status.');
        return false;
    }
    
    if (!data.universityHistory) {
        showAlert('error', 'Please indicate if you have university history.');
        return false;
    }
    
    if (!data.postalCode) {
        showAlert('error', 'Please enter your postal code.');
        return false;
    }
    
    if (!data.city) {
        showAlert('error', 'Please enter your city.');
        return false;
    }
    
    if (!data.termsAccepted) {
        showAlert('error', 'Please accept the Terms & Privacy Policy to continue.');
        return false;
    }
    
    return true;
}

// Alert Notification System
function showAlert(type, message) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert-notification');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert-notification alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('alert-styles')) {
        const style = document.createElement('style');
        style.id = 'alert-styles';
        style.textContent = `
            .alert-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                min-width: 300px;
                max-width: 500px;
                animation: slideInRight 0.3s ease;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .alert-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            }
            .alert-success .alert-content {
                background: #25D366;
                color: white;
            }
            .alert-error .alert-content {
                background: #e74c3c;
                color: white;
            }
            .alert-icon {
                font-size: 1.5rem;
                font-weight: bold;
            }
            .alert-message {
                flex: 1;
                font-weight: 500;
            }
            .alert-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.3s;
            }
            .alert-close:hover {
                opacity: 1;
            }
            @media (max-width: 768px) {
                .alert-notification {
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Append to body
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

// Add slideOutRight animation
if (!document.getElementById('alert-animations')) {
    const style = document.createElement('style');
    style.id = 'alert-animations';
    style.textContent = `
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Contact Form Submission Handler
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.contact-submit-btn');
    const originalButtonText = submitButton.textContent;
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Collect form data
    const formData = {
        name: form.querySelector('#contactName').value.trim(),
        email: form.querySelector('#contactEmail').value.trim(),
        message: form.querySelector('#contactMessage').value.trim()
    };
    
    // Validate form
    if (!validateContactForm(formData)) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        return;
    }
    
    try {
        // Send data to PHP endpoint
        const response = await fetch('send-contact-mail.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Show success message
            showAlert('success', result.message || 'Message sent successfully. We will get back to you soon.');
            
            // Reset form
            form.reset();
        } else {
            // Show error message
            showAlert('error', result.message || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'Network error. Please check your connection and try again.');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Contact Form Validation
function validateContactForm(data) {
    // Check required fields
    if (!data.name) {
        showAlert('error', 'Please enter your name.');
        return false;
    }
    
    if (!data.email) {
        showAlert('error', 'Please enter your email address.');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showAlert('error', 'Please enter a valid email address.');
        return false;
    }
    
    if (!data.message) {
        showAlert('error', 'Please enter your message.');
        return false;
    }
    
    if (data.message.length < 10) {
        showAlert('error', 'Please enter a message with at least 10 characters.');
        return false;
    }
    
    return true;
}
