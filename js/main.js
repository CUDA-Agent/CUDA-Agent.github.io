// CUDA Agent project page - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initScrollAnimations();
    initSmoothScroll();
    initNavigationHighlight();
    initTaglineRotation();
    initProgressIndicator();
});

/* ========================================
   Scroll Animations
   ======================================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observe stagger items
    document.querySelectorAll('.stagger-item').forEach(item => {
        observer.observe(item);
    });
}

/* ========================================
   Smooth Scrolling
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for sticky nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/* ========================================
   Navigation Highlight
   ======================================== */
function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ========================================
   Tagline Rotation
   ======================================== */
function initTaglineRotation() {
    const taglineElement = document.querySelector('.tagline-text');
    if (!taglineElement) return;
    
    const taglines = [
        "High-Quality Training Tasks via a Scalable Data Pipeline",
        "Skill-Augmented Environment with Reliable Rewards",
        "Stable Large-Scale Agentic RL",
        "State-of-the-Art Results on KernelBench"
    ];
    
    let currentIndex = 0;
    
    function rotateTagline() {
        taglineElement.style.opacity = '0';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % taglines.length;
            taglineElement.textContent = taglines[currentIndex];
            taglineElement.style.opacity = '1';
        }, 500);
    }
    
    // Rotate every 5 seconds
    setInterval(rotateTagline, 5000);
}

/* ========================================
   Progress Indicator
   ======================================== */
function initProgressIndicator() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    // Add styles if not in CSS
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(229, 231, 235, 0.5);
            z-index: 9999;
            pointer-events: none;
        }
        .reading-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
    
    const progressBarFill = progressBar.querySelector('.reading-progress-bar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        progressBarFill.style.width = scrollPercent + '%';
    });
}

/* ========================================
   Scroll to Top Button
   ======================================== */
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
            z-index: 1000;
        }
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        .scroll-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
        }
    `;
    document.head.appendChild(style);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
initScrollToTop();

/* ========================================
   Lazy Loading Images
   ======================================== */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

initLazyLoading();

/* ========================================
   Tab Functionality (for case studies, etc.)
   ======================================== */
function initTabs() {
    const tabButtons = document.querySelectorAll('[data-tab-button]');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tabButton;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

initTabs();

/* ========================================
   Copy to Clipboard (for citation, code, etc.)
   ======================================== */
function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', async () => {
            const textToCopy = button.dataset.copy || button.closest('.copy-container').querySelector('code, pre').textContent;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Visual feedback
                const originalText = button.textContent;
                button.textContent = '✓ Copied!';
                button.style.background = '#10b981';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

initCopyButtons();

/* ========================================
   Mobile Menu Toggle
   ======================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('mobile-open');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('mobile-open');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

initMobileMenu();

/* ========================================
   Analytics Event Tracking (optional)
   ======================================== */
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track CTA clicks
document.querySelectorAll('.btn, .cta-button').forEach(button => {
    button.addEventListener('click', () => {
        const label = button.textContent.trim() || button.getAttribute('aria-label');
        trackEvent('CTA', 'click', label);
    });
});
