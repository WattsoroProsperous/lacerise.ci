/**
 * LA CERISE - Pâtisserie & Glacier
 * Main JavaScript File
 * Handles loading, navigation, animations, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Loading Screen & Asset Preloading
    // ============================================

    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('.loader-progress-bar');
    const body = document.body;

    // Critical assets to preload (logo, hero, about)
    const criticalAssets = [
        'assets/logo.jpg',
        'assets/bienvenue à La Cerise,  Laissez-vous séduire par nos gourmandises, uniques.jpg',
        'assets/about us.jpg'
    ];

    // Secondary assets to load progressively
    const secondaryAssets = [
        'assets/lacerise.mp4',
        'assets/our cake.mp4',
        'assets/special noel.mp4'
    ];

    let loadedCount = 0;
    const totalCritical = criticalAssets.length;

    // Add loading class to body
    body.classList.add('loading');

    // Preload critical images
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(src); // Resolve anyway to not block
            img.src = src;
        });
    }

    // Update progress bar
    function updateProgress(loaded, total) {
        const progress = (loaded / total) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Load critical assets
    async function loadCriticalAssets() {
        for (const asset of criticalAssets) {
            await preloadImage(asset);
            loadedCount++;
            updateProgress(loadedCount, totalCritical);
        }
    }

    // Hide loader and show content
    function hideLoader() {
        loader.classList.add('hidden');
        body.classList.remove('loading');

        // Trigger entrance animations
        setTimeout(() => {
            initScrollAnimations();
        }, 300);
    }

    // Progressive loading of secondary assets
    function loadSecondaryAssets() {
        // Videos will load automatically when they come into view
        const videos = document.querySelectorAll('video[data-src]');

        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        const source = video.querySelector('source');
                        if (source && source.dataset.src) {
                            source.src = source.dataset.src;
                            video.load();
                        }
                        videoObserver.unobserve(video);
                    }
                });
            }, { rootMargin: '100px' });

            videos.forEach(video => videoObserver.observe(video));
        }
    }

    // Start loading sequence
    loadCriticalAssets().then(() => {
        // Minimum loader display time for smooth UX
        setTimeout(hideLoader, 500);
        loadSecondaryAssets();
    });

    // Fallback: hide loader after max time
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            hideLoader();
        }
    }, 5000);

    // ============================================
    // Header & Navigation
    // ============================================

    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for header
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();

        // Show/hide back to top button
        updateBackToTop();
    }

    window.addEventListener('scroll', throttle(handleScroll, 100));

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            body.style.overflow = 'hidden';
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Update active nav link based on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============================================
    // Smooth Scrolling
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Scroll Animations
    // ============================================

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            animatedElements.forEach(el => el.classList.add('aos-animate'));
        }
    }

    // ============================================
    // Back to Top Button
    // ============================================

    const backToTop = document.getElementById('back-to-top');

    function updateBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Contact Form
    // ============================================

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const product = formData.get('product');
            const message = formData.get('message');

            // Create WhatsApp message
            const whatsappMessage = encodeURIComponent(
                `Bonjour La Cerise! 🍒\n\n` +
                `Je suis ${name}.\n` +
                `Téléphone: ${phone}\n` +
                `Produit souhaité: ${product}\n\n` +
                `Message: ${message || 'Aucun message supplémentaire'}`
            );

            // Open WhatsApp with pre-filled message
            const whatsappUrl = `https://wa.me/2250100026464?text=${whatsappMessage}`;
            window.open(whatsappUrl, '_blank');

            // Show success feedback
            showNotification('Redirection vers WhatsApp...', 'success');

            // Reset form
            this.reset();
        });
    }

    // ============================================
    // Notification System
    // ============================================

    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 16px 24px;
            background: ${type === 'success' ? '#C5E0C5' : '#C41E3A'};
            color: ${type === 'success' ? '#1A1A1A' : '#FFFFFF'};
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideUp 0.3s ease;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: inherit;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        closeBtn.addEventListener('click', () => notification.remove());

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add notification animations
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        @keyframes slideDown {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // ============================================
    // Specialty Cards Interaction
    // ============================================

    const specialtyCards = document.querySelectorAll('.specialty-card');

    specialtyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ============================================
    // Gallery Lightbox Effect
    // ============================================

    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const video = this.querySelector('video');

            if (img) {
                openLightbox(img.src, 'image');
            } else if (video) {
                openLightbox(video.querySelector('source').src, 'video');
            }
        });
    });

    function openLightbox(src, type) {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            animation: fadeIn 0.3s ease;
        `;

        let content;
        if (type === 'image') {
            content = document.createElement('img');
            content.src = src;
            content.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 0 50px rgba(0,0,0,0.5);
            `;
        } else {
            content = document.createElement('video');
            content.src = src;
            content.controls = true;
            content.autoplay = true;
            content.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 8px;
            `;
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 40px;
            color: white;
            background: none;
            border: none;
            cursor: pointer;
            z-index: 10001;
        `;

        lightbox.appendChild(content);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Close handlers
        const closeLightbox = () => {
            lightbox.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        };

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // Add lightbox animations
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(lightboxStyles);

    // ============================================
    // Parallax Effect for Hero
    // ============================================

    const heroImg = document.querySelector('.hero-img');

    if (heroImg && window.innerWidth > 768) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
            }
        }, 16));
    }

    // ============================================
    // Video Autoplay on Visibility
    // ============================================

    const videos = document.querySelectorAll('.bg-video, .gallery-video');

    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });

        videos.forEach(video => videoObserver.observe(video));
    }

    // ============================================
    // Utility Functions
    // ============================================

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ============================================
    // Keyboard Navigation
    // ============================================

    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // ============================================
    // Performance: Lazy Load Images
    // ============================================

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // Cherry Animation on Logo Hover
    // ============================================

    const logoImg = document.querySelector('.nav-logo');

    if (logoImg) {
        logoImg.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(-2deg)';
            this.style.transition = 'transform 0.3s ease';
        });

        logoImg.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // ============================================
    // Initialize
    // ============================================

    // Initial scroll check
    handleScroll();

    // Log initialization
    console.log('🍒 La Cerise - Site initialisé avec succès!');
});

// ============================================
// Service Worker Registration (Optional PWA)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
