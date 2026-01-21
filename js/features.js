/**
 * Features Module
 * Handles preloader, scroll animations, lazy loading, accessibility, and interactive features
 */

class PortfolioFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.initPreloader();
        this.initScrollAnimations();
        this.initScrollToTop();
        this.initLazyLoading();
        this.initAccessibility();
        this.initFooter();
        this.initCarousels();
        this.initParallax();
        this.initDropdowns();
    }

    /**
     * Preloader Animation
     */
    initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        // If already loaded, skip
        if (preloader.classList.contains('loaded')) return;

        // Hide preloader with fallback timeout
        const hidePreloader = () => {
            if (preloader && !preloader.classList.contains('loaded')) {
                preloader.classList.add('loaded');
                document.body.classList.add('content-loaded');
            }
        };

        // Fallback: Hide after 5 seconds if not already hidden
        setTimeout(() => {
            hidePreloader();
        }, 5000);
    }

    /**
     * Scroll Reveal Animations
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Unobserve after revealing to improve performance
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with reveal classes
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        revealElements.forEach(el => revealObserver.observe(el));

        // Add reveal classes to portfolio items
        setTimeout(() => {
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            portfolioItems.forEach((item, index) => {
                item.classList.add('reveal');
                item.style.transitionDelay = `${index * 0.1}s`;
            });
            portfolioItems.forEach(el => revealObserver.observe(el));
        }, 1000);
    }

    /**
     * Scroll to Top Button
     */
    initScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTop');
        if (!scrollBtn) return;

        let ticking = false;

        const updateScrollBtn = () => {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollBtn);
                ticking = true;
            }
        }, { passive: true });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Lazy Loading Images
     */
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /**
     * Accessibility Enhancements
     */
    initAccessibility() {
        // Add ARIA labels to interactive elements
        this.addAriaLabels();

        // Add keyboard navigation
        this.initKeyboardNav();

        // Add focus visible styles
        this.initFocusVisible();

        // Skip to content link
        this.addSkipLink();
    }

    addAriaLabels() {
        // Add aria-label to nav items
        const navItems = document.querySelectorAll('.nav-menu a');
        navItems.forEach(link => {
            if (!link.hasAttribute('aria-label')) {
                link.setAttribute('aria-label', `Navigate to ${link.textContent}`);
            }
        });

        // Add role and aria-label to sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            if (!section.hasAttribute('role')) {
                section.setAttribute('role', 'region');
            }
            const heading = section.querySelector('h2');
            if (heading && !section.hasAttribute('aria-labelledby')) {
                heading.id = heading.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
                section.setAttribute('aria-labelledby', heading.id);
            }
        });
    }

    initKeyboardNav() {
        // Allow Enter key to activate clickable elements
        const clickables = document.querySelectorAll('[onclick], .clickable');
        clickables.forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
            
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });

        // Trap focus in modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                modal.addEventListener('keydown', (e) => {
                    if (e.key !== 'Tab') return;

                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                });
            }
        });
    }

    initFocusVisible() {
        // Add focus-visible class for keyboard navigation
        let isMouseDown = false;

        document.addEventListener('mousedown', () => {
            isMouseDown = true;
        });

        document.addEventListener('keydown', () => {
            isMouseDown = false;
        });

        document.addEventListener('focusin', (e) => {
            if (!isMouseDown) {
                e.target.classList.add('focus-visible');
            }
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.setAttribute('aria-label', 'Skip to main content');
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Footer Initialization
     */
    initFooter() {
        const footerNav = document.getElementById('footerNav');
        const footerSocial = document.getElementById('footerSocial');
        const footerContact = document.getElementById('footerContact');
        const footerName = document.getElementById('footerName');
        const copyrightYear = document.getElementById('copyrightYear');

        // Set copyright year
        if (copyrightYear) {
            copyrightYear.textContent = new Date().getFullYear();
        }

        // Wait for data to be loaded
        setTimeout(() => {
            if (window.portfolioData) {
                const data = window.portfolioData;

                // Set footer name
                if (footerName && data.personal) {
                    footerName.textContent = data.personal.name || '';
                }

                // Add footer navigation
                if (footerNav && data.navigation) {
                    const navHTML = data.navigation.order
                        .filter(key => data.sections[key] && data.sections[key].enabled !== false)
                        .slice(0, 8) // Limit to 8 items
                        .map(key => {
                            const section = data.sections[key];
                            return `<li><a href="#${key}">${section.title}</a></li>`;
                        })
                        .join('');
                    footerNav.innerHTML = navHTML;
                }

                // Add footer social
                if (footerSocial && data.sections.social && data.sections.social.items) {
                    const socialHTML = data.sections.social.items
                        .slice(0, 6) // Limit to 6 icons
                        .map(item => {
                            const iconPath = this.getSocialIcon(item.platform);
                            return `
                                <a href="${item.url}" target="_blank" rel="noopener noreferrer" 
                                   class="footer-social-icon" aria-label="${item.platform}">
                                    ${iconPath ? `<img src="${iconPath}" alt="${item.platform}" width="24" height="24" />` : item.platform.charAt(0)}
                                </a>
                            `;
                        })
                        .join('');
                    footerSocial.innerHTML = socialHTML;
                }

                // Add footer contact
                if (footerContact && data.personal) {
                    const contactHTML = `
                        ${data.personal.location ? `<p>📍 ${data.personal.location}</p>` : ''}
                        ${data.personal.email ? `<p>✉️ <a href="mailto:${data.personal.email}">${data.personal.email}</a></p>` : ''}
                    `;
                    footerContact.innerHTML = contactHTML;
                }
            }
        }, 500);
    }

    getSocialIcon(platform) {
        const iconMap = {
            'linkedin': 'Assets/Icons/style-glossy-blue/linkedin.png',
            'github': 'Assets/Icons/style-glossy-blue/linkedin.png', // placeholder
            'youtube': 'Assets/Icons/style-glossy-blue/youtube.png',
            'instagram': 'Assets/Icons/style-glossy-blue/instagram.png',
            'facebook': 'Assets/Icons/style-glossy-blue/facebook.png',
            'reddit': 'Assets/Icons/style-glossy-blue/reddit.png',
            'pinterest': 'Assets/Icons/style-glossy-blue/pinterest.png',
            'tumblr': 'Assets/Icons/style-glossy-blue/tumblr.png',
            'skype': 'Assets/Icons/style-glossy-blue/skype.png'
        };
        return iconMap[platform.toLowerCase()] || null;
    }

    /**
     * Image Carousels
     */
    initCarousels() {
        const carousels = document.querySelectorAll('.carousel-container');
        
        carousels.forEach(carousel => {
            const track = carousel.querySelector('.carousel-track');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const prevBtn = carousel.querySelector('.carousel-button.prev');
            const nextBtn = carousel.querySelector('.carousel-button.next');
            const indicators = carousel.querySelector('.carousel-indicators');
            
            if (!track || slides.length === 0) return;

            let currentIndex = 0;
            const totalSlides = slides.length;

            // Create indicators
            if (indicators) {
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('div');
                    dot.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
                    dot.addEventListener('click', () => goToSlide(i));
                    indicators.appendChild(dot);
                }
            }

            const updateCarousel = () => {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update indicators
                const dots = carousel.querySelectorAll('.carousel-indicator');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            };

            const goToSlide = (index) => {
                currentIndex = index;
                updateCarousel();
            };

            const nextSlide = () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            };

            const prevSlide = () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
            };

            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);

            // Auto-play (optional)
            // setInterval(nextSlide, 5000);
        });
    }

    /**
     * Parallax Effect
     */
    initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.scrollY;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Dropdown Menus
     */
    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!toggle || !menu) return;

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('open');
                    }
                });
            });

            // Close on outside click
            document.addEventListener('click', () => {
                dropdown.classList.remove('open');
            });

            // Prevent menu clicks from closing
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdown.classList.remove('open');
                }
            });
        });
    }
}

// Initialize features when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PortfolioFeatures();
    });
} else {
    new PortfolioFeatures();
}
