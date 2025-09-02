// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggleButton = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggleButton.querySelector('.theme-icon');
        this.currentTheme = localStorage.getItem('portfolio-theme') || 'light';
        
        this.initializeTheme();
        this.bindEvents();
    }
    
    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }
    
    updateThemeIcon() {
        if (this.currentTheme === 'dark') {
            this.themeIcon.className = 'fas fa-sun theme-icon';
        } else {
            this.themeIcon.className = 'fas fa-moon theme-icon';
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('portfolio-theme', this.currentTheme);
        this.updateThemeIcon();
    }
    
    bindEvents() {
        this.themeToggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.main-navigation');
        this.navigationLinks = document.querySelectorAll('.navigation-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.bindEvents();
        this.updateActiveLink();
    }
    
    bindEvents() {
        // Smooth scrolling for navigation links
        this.navigationLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navbarHeight = this.navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveLink();
            this.handleNavbarBackground();
        });
    }
    
    updateActiveLink() {
        const scrollPosition = window.scrollY + this.navbar.offsetHeight + 50;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.navigation-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navigationLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    handleNavbarBackground() {
        if (window.scrollY > 50) {
            this.navbar.style.backgroundColor = 'var(--background-primary)';
            this.navbar.style.backdropFilter = 'blur(10px)';
        } else {
            this.navbar.style.backgroundColor = 'var(--background-primary)';
            this.navbar.style.backdropFilter = 'blur(10px)';
        }
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.animatedElements = document.querySelectorAll('.fade-in, .stat-item, .education-item, .project-card, .certification-card, .skill-category, .contact-item');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.initializeObserver();
        this.addFadeInClasses();
    }
    
    addFadeInClasses() {
        // Add fade-in class to elements that should animate
        const elementsToAnimate = [
            '.stat-item',
            '.education-item',
            '.project-card',
            '.certification-card',
            '.skill-category',
            '.contact-item'
        ];
        
        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.add('fade-in');
            });
        });
    }
    
    initializeObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);
        
        this.animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Certificate Manager
class CertificateManager {
    constructor() {
        this.certificateImages = document.querySelectorAll('.certificate-image');
        this.initializeCertificateImages();
    }
    
    initializeCertificateImages() {
        this.certificateImages.forEach(img => {
            img.addEventListener('load', () => {
                const placeholder = img.nextElementSibling;
                if (placeholder && placeholder.classList.contains('certificate-placeholder')) {
                    placeholder.style.display = 'none';
                }
            });
            
            img.addEventListener('error', () => {
                const placeholder = img.nextElementSibling;
                if (placeholder && placeholder.classList.contains('certificate-placeholder')) {
                    placeholder.style.display = 'flex';
                }
            });
        });
    }
    
    // Method to dynamically add new certificates
    addCertificate(title, provider, year, imageUrl, certificateUrl) {
        const certificationsGrid = document.getElementById('certificationsGrid');
        
        const certificateHtml = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="certification-card fade-in">
                    <div class="certification-image">
                        <img src="${imageUrl}" alt="${title} Certificate" class="certificate-image">
                        <div class="certificate-placeholder">
                            <i class="fas fa-certificate"></i>
                            <p>Certificate Image</p>
                        </div>
                    </div>
                    <div class="certification-content">
                        <h4 class="certification-title">${title}</h4>
                        <p class="certification-provider">${provider}</p>
                        <p class="certification-year">${year}</p>
                        <a href="${certificateUrl}" class="btn certificate-link" target="_blank">
                            View Certificate
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        certificationsGrid.insertAdjacentHTML('beforeend', certificateHtml);
        
        // Re-initialize observers for new elements
        const newCertificate = certificationsGrid.lastElementChild.querySelector('.certification-card');
        if (this.animationManager) {
            this.animationManager.observer.observe(newCertificate);
        }
    }
}

// Profile Photo Manager
class ProfilePhotoManager {
    constructor() {
        this.profilePhoto = document.querySelector('.profile-photo');
        this.photoPlaceholder = document.querySelector('.photo-placeholder');
        
        this.initializeProfilePhoto();
    }
    
    initializeProfilePhoto() {
        if (this.profilePhoto) {
            this.profilePhoto.addEventListener('load', () => {
                if (this.photoPlaceholder) {
                    this.photoPlaceholder.style.display = 'none';
                }
            });
            
            this.profilePhoto.addEventListener('error', () => {
                if (this.photoPlaceholder) {
                    this.photoPlaceholder.style.display = 'flex';
                }
            });
        }
    }
    
    updateProfilePhoto(imageUrl) {
        if (this.profilePhoto) {
            this.profilePhoto.src = imageUrl;
        }
    }
}

// Utility Functions
class UtilityManager {
    static smoothScrollTo(targetId, offset = 80) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    static formatPhoneNumber(phoneNumber) {
        // Format phone number for display
        const cleaned = phoneNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{4})(\d{6})$/);
        if (match) {
            return `+${match[1]} ${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    }
    
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy', 'error');
        });
    }
    
    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--background-primary);
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            box-shadow: var(--shadow-medium);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Contact Form Handler
class ContactManager {
    constructor() {
        this.contactItems = document.querySelectorAll('.contact-details a');
        this.initializeContactInteractions();
    }
    
    initializeContactInteractions() {
        this.contactItems.forEach(item => {
            // Add click to copy functionality for email and phone
            if (item.href.startsWith('mailto:') || item.href.startsWith('tel:')) {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    let textToCopy = '';
                    if (item.href.startsWith('mailto:')) {
                        textToCopy = item.href.replace('mailto:', '');
                    } else if (item.href.startsWith('tel:')) {
                        textToCopy = item.href.replace('tel:', '');
                    }
                    
                    UtilityManager.copyToClipboard(textToCopy);
                    
                    // Still trigger the default action after a delay
                    setTimeout(() => {
                        window.location.href = item.href;
                    }, 1000);
                });
            }
        });
    }
}

// Skills Progress Animation
class SkillsManager {
    constructor() {
        this.skillItems = document.querySelectorAll('.skill-item');
        this.initializeSkillAnimations();
    }
    
    initializeSkillAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkill(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        this.skillItems.forEach(skill => {
            observer.observe(skill);
        });
    }
    
    animateSkill(skillElement) {
        skillElement.style.animationDelay = Math.random() * 0.5 + 's';
        skillElement.classList.add('skill-animate');
    }
}

// Project Filtering (for future expansion)
class ProjectManager {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.initializeProjectInteractions();
    }
    
    initializeProjectInteractions() {
        // Add hover effects and interactions
        this.projectCards.forEach(card => {
            const techTags = card.querySelectorAll('.tech-tag');
            
            card.addEventListener('mouseenter', () => {
                techTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.transform = 'scale(1.05)';
                        tag.style.backgroundColor = 'var(--primary-color)';
                        tag.style.color = 'white';
                    }, index * 50);
                });
            });
            
            card.addEventListener('mouseleave', () => {
                techTags.forEach(tag => {
                    tag.style.transform = 'scale(1)';
                    tag.style.backgroundColor = 'var(--background-secondary)';
                    tag.style.color = 'var(--text-primary)';
                });
            });
        });
    }
}

// Performance Monitor
class PerformanceManager {
    constructor() {
        this.initializePerformanceOptimizations();
    }
    
    initializePerformanceOptimizations() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Optimize scroll events
        this.optimizeScrollEvents();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    optimizeScrollEvents() {
        // Use throttled scroll events for better performance
        const throttledScrollHandler = UtilityManager.throttle(() => {
            // Scroll-based animations or effects can be added here
        }, 16); // ~60fps
        
        window.addEventListener('scroll', throttledScrollHandler);
    }
    
    preloadResources() {
        // Preload important resources
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
}

// Main Application Class
class PortfolioApp {
    constructor() {
        this.themeManager = null;
        this.navigationManager = null;
        this.animationManager = null;
        this.certificateManager = null;
        this.profilePhotoManager = null;
        this.contactManager = null;
        this.skillsManager = null;
        this.projectManager = null;
        this.performanceManager = null;
        
        this.initializeApp();
    }
    
    initializeApp() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupManagers();
            });
        } else {
            this.setupManagers();
        }
    }
    
    setupManagers() {
        try {
            // Initialize all managers
            this.themeManager = new ThemeManager();
            this.navigationManager = new NavigationManager();
            this.animationManager = new AnimationManager();
            this.certificateManager = new CertificateManager();
            this.profilePhotoManager = new ProfilePhotoManager();
            this.contactManager = new ContactManager();
            this.skillsManager = new SkillsManager();
            this.projectManager = new ProjectManager();
            this.performanceManager = new PerformanceManager();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Initialize any additional features
            this.initializeAdditionalFeatures();
            
            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio app:', error);
        }
    }
    
    setupGlobalEvents() {
        // Handle window resize
        const debouncedResizeHandler = UtilityManager.debounce(() => {
            // Handle responsive adjustments
            this.handleWindowResize();
        }, 250);
        
        window.addEventListener('resize', debouncedResizeHandler);
        
        // Handle visibility change (for performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause animations or reduce activity when tab is not visible
                this.pauseAnimations();
            } else {
                // Resume animations when tab becomes visible
                this.resumeAnimations();
            }
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }
    
    handleWindowResize() {
        // Update any size-dependent calculations
        if (this.navigationManager) {
            this.navigationManager.updateActiveLink();
        }
    }
    
    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }
    
    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }
    
    handleKeyboardNavigation(event) {
        // Handle keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'd':
                    event.preventDefault();
                    this.themeManager.toggleTheme();
                    break;
                case 'h':
                    event.preventDefault();
                    UtilityManager.smoothScrollTo('#home');
                    break;
            }
        }
    }
    
    initializeAdditionalFeatures() {
        // Add any additional initialization here
        this.setupTypingEffect();
        this.setupScrollProgress();
    }
    
    setupTypingEffect() {
        // Optional typing effect for hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && heroTitle.dataset.typing) {
            this.createTypingEffect(heroTitle, heroTitle.dataset.typing);
        }
    }
    
    createTypingEffect(element, text) {
        let index = 0;
        element.textContent = '';
        
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 100);
            }
        };
        
        typeChar();
    }
    
    setupScrollProgress() {
        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        const updateProgress = UtilityManager.throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }, 16);
        
        window.addEventListener('scroll', updateProgress);
    }
    
    // Public methods for external use
    addCertificate(title, provider, year, imageUrl, certificateUrl) {
        if (this.certificateManager) {
            this.certificateManager.addCertificate(title, provider, year, imageUrl, certificateUrl);
        }
    }
    
    updateProfilePhoto(imageUrl) {
        if (this.profilePhotoManager) {
            this.profilePhotoManager.updateProfilePhoto(imageUrl);
        }
    }
    
    toggleTheme() {
        if (this.themeManager) {
            this.themeManager.toggleTheme();
        }
    }
}

// Initialize the application
const portfolioApp = new PortfolioApp();

// Export for external use (if needed)
window.PortfolioApp = PortfolioApp;
window.portfolioApp = portfolioApp;