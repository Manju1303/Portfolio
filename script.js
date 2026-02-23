// ========================================
//   PORTFOLIO SCRIPT - ENHANCED ANIMATIONS
// ========================================

// Initialize Lucide icons
lucide.createIcons();

// ========================================
//   PAGE LOADER
// ========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    }
});

// ========================================
//   PARTICLE BACKGROUND
// ========================================
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse repulsion
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                this.x += dx / dist * 1.5;
                this.y += dy / dist * 1.5;
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles based on screen size
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Track mouse for particle interaction
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
})();

// ========================================
//   CUSTOM CURSOR (Enhanced)
// ========================================
(function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (!dot || !ring || window.innerWidth < 768) return;

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
    });

    function animateCursor() {
        // Dot follows immediately
        dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;

        // Ring follows with smooth lag
        ringX += (dotX - ringX) * 0.15;
        ringY += (dotY - ringY) * 0.15;
        ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .tool-card, .project-card-link, .glass-panel');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
        el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
    });
})();

// ========================================
//   TYPEWRITER EFFECT
// ========================================
(function initTypewriter() {
    const element = document.getElementById('heroTypewriter');
    if (!element) return;

    const texts = ['Manjunath', 'AI Engineer', 'Vibe Coder'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 400; // Pause before new word
        }

        setTimeout(type, typingSpeed);
    }

    // Start after loader
    setTimeout(type, 1200);
})();

// ========================================
//   MOBILE MENU TOGGLE
// ========================================
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileNav.classList.contains('active') ? 'x' : 'menu';
        mobileBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    });

    // Close menu on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileBtn.innerHTML = `<i data-lucide="menu"></i>`;
            lucide.createIcons();
        });
    });
}

// ========================================
//   NAVBAR SCROLL EFFECT
// ========================================
(function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
})();

// ========================================
//   SMOOTH SCROLL ANIMATIONS (Enhanced)
// ========================================
(function initScrollAnimations() {
    const animElements = document.querySelectorAll(
        '.anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, .anim-zoom-in, .reveal'
    );

    if (!animElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    animElements.forEach(el => observer.observe(el));

    // Safety fallback
    setTimeout(() => {
        animElements.forEach(el => {
            if (!el.classList.contains('active')) {
                el.classList.add('active');
            }
        });
    }, 3000);
})();

// ========================================
//   STAGGERED TOOL CARDS ANIMATION
// ========================================
(function initToolCardStagger() {
    const toolCards = document.querySelectorAll('.tool-card');
    if (!toolCards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.tool-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 50);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Set initial state
    const grids = document.querySelectorAll('.tools-grid');
    grids.forEach(grid => {
        grid.querySelectorAll('.tool-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        observer.observe(grid);
    });
})();

// ========================================
//   BACK TO TOP BUTTON
// ========================================
(function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ========================================
//   ACTIVE NAV LINK HIGHLIGHT
// ========================================
(function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = '#06b6d4';
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
})();

// ========================================
//   SMOOTH ANCHOR SCROLLING
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
//   GOOGLE SHEETS CONTACT FORM - FULLY FUNCTIONAL
// ========================================

/*
 * ============================================
 * GOOGLE SHEETS SETUP INSTRUCTIONS
 * ============================================
 * 
 * To make this contact form work with Google Sheets:
 * 
 * 1. Go to https://sheets.google.com and create a new spreadsheet
 * 2. Name it "Portfolio Contacts"
 * 3. Add these headers in Row 1: Date | Name | Email | Subject | Message
 * 4. Go to Extensions → Apps Script
 * 5. Delete existing code and paste this:
 * 
 *    function doPost(e) {
 *      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *      var data = JSON.parse(e.postData.contents);
 *      sheet.appendRow([
 *        new Date().toLocaleString(),
 *        data.name,
 *        data.email,
 *        data.subject || 'No subject',
 *        data.message
 *      ]);
 *      return ContentService.createTextOutput(JSON.stringify({
 *        success: true
 *      })).setMimeType(ContentService.MimeType.JSON);
 *    }
 * 
 * 6. Click Deploy → New deployment
 * 7. Select type: Web app
 * 8. Execute as: Me
 * 9. Who has access: Anyone
 * 10. Click Deploy and copy the URL
 * 11. Replace GOOGLE_SCRIPT_URL below with your URL
 * 
 * TO USE A DIFFERENT SHEET:
 * - Create a new Google Sheet with same headers
 * - Create a new Apps Script with the same code
 * - Deploy it and paste the new URL below
 * ============================================
 */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzRxQ9shgi44Ao1ORhQfKJylW5V7ySG-JxhKPFA_kHKU9j0OQL6zfi58oBOSecjm_QS8A/exec';

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        // Hide previous message
        if (formMessage) {
            formMessage.className = 'form-message';
            formMessage.style.display = 'none';
        }

        const formData = {
            name: this.querySelector('[name="name"]').value.trim(),
            email: this.querySelector('[name="email"]').value.trim(),
            subject: this.querySelector('[name="subject"]')?.value.trim() || '',
            message: this.querySelector('[name="message"]').value.trim()
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            showFormMessage('error', 'Please fill in all required fields.');
            resetButton();
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormMessage('error', 'Please enter a valid email address.');
            resetButton();
            return;
        }

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // With no-cors, we can't read response, so assume success if no error
            showFormMessage('success', '✓ Message sent successfully! I\'ll get back to you soon.');
            this.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('error', '✗ Failed to send message. Please try again or email me directly.');
        }

        // Reset button after delay
        setTimeout(resetButton, 3000);

        function resetButton() {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }

        function showFormMessage(type, text) {
            if (formMessage) {
                formMessage.className = `form-message ${type}`;
                formMessage.textContent = text;
                formMessage.style.display = 'block';

                // Auto-hide after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    });
}

// ========================================
//   SCROLL STACK ANIMATION ENGINE
// ========================================

(function initScrollStack() {
    const CONFIG = {
        itemScale: 0.03,
        itemStackDistance: 30,
        stackPosition: '20%',
        scaleEndPosition: '10%',
        baseScale: 0.85,
        blurAmount: 1.5
    };

    const cards = document.querySelectorAll('.scroll-stack-card');
    const endElement = document.querySelector('.scroll-stack-end');

    if (!cards.length || !endElement) return;

    // Bounce Card: trigger animation on viewport entry
    const bounceCards = document.querySelectorAll('.bounce-card');
    bounceCards.forEach(card => {
        card.style.animationPlayState = 'paused';
    });

    const bounceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                bounceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    });

    bounceCards.forEach(card => bounceObserver.observe(card));

    // Scroll Stack Logic
    const lastTransforms = new Map();
    let ticking = false;

    function parsePercentage(value, containerHeight) {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value);
    }

    function calculateProgress(scrollTop, start, end) {
        if (scrollTop < start) return 0;
        if (scrollTop > end) return 1;
        return (scrollTop - start) / (end - start);
    }

    function getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
    }

    function updateCardTransforms() {
        const scrollTop = window.scrollY;
        const containerHeight = window.innerHeight;
        const stackPositionPx = parsePercentage(CONFIG.stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(CONFIG.scaleEndPosition, containerHeight);
        const endElementTop = getElementOffset(endElement);

        cards.forEach((card, i) => {
            const cardTop = getElementOffset(card);
            const triggerStart = cardTop - stackPositionPx - CONFIG.itemStackDistance * i;
            const triggerEnd = cardTop - scaleEndPositionPx;
            const pinStart = cardTop - stackPositionPx - CONFIG.itemStackDistance * i;
            const pinEnd = endElementTop - containerHeight / 2;

            // Scale calculation
            const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
            const targetScale = CONFIG.baseScale + i * CONFIG.itemScale;
            const scale = 1 - scaleProgress * (1 - targetScale);

            // Blur calculation
            let blur = 0;
            if (CONFIG.blurAmount) {
                let topCardIndex = 0;
                cards.forEach((c, j) => {
                    const jCardTop = getElementOffset(c);
                    const jTriggerStart = jCardTop - stackPositionPx - CONFIG.itemStackDistance * j;
                    if (scrollTop >= jTriggerStart) {
                        topCardIndex = j;
                    }
                });

                if (i < topCardIndex) {
                    const depthInStack = topCardIndex - i;
                    blur = Math.max(0, depthInStack * CONFIG.blurAmount);
                }
            }

            // Pin/translate calculation
            let translateY = 0;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + CONFIG.itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + CONFIG.itemStackDistance * i;
            }

            // Round values
            const newTransform = {
                translateY: Math.round(translateY * 100) / 100,
                scale: Math.round(scale * 1000) / 1000,
                blur: Math.round(blur * 100) / 100
            };

            // Only apply if changed
            const lastTransform = lastTransforms.get(i);
            const hasChanged =
                !lastTransform ||
                Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
                Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
                Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

            if (hasChanged) {
                const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})`;
                const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

                card.style.transform = transform;
                card.style.filter = filter;

                lastTransforms.set(i, newTransform);
            }
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateCardTransforms);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateCardTransforms();

    // Re-init Lucide icons
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
})();

// ========================================
//   MAGNETIC BUTTON EFFECT
// ========================================
(function initMagneticButtons() {
    if (window.innerWidth < 768) return;

    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
})();

// ========================================
//   PARALLAX EFFECT ON HERO BLOBS
// ========================================
(function initParallax() {
    if (window.innerWidth < 768) return;

    const blob1 = document.querySelector('.hero-bg-blob-1');
    const blob2 = document.querySelector('.hero-bg-blob-2');

    if (!blob1 || !blob2) return;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;

        blob1.style.transform = `translate(${x}px, ${y}px)`;
        blob2.style.transform = `translate(${-x}px, ${-y}px)`;
    });
})();

// ========================================
//   COUNTER ANIMATION FOR STATS
// ========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Final Lucide init to catch any dynamically added elements
setTimeout(() => {
    lucide.createIcons();
}, 500);

console.log('%c Portfolio loaded successfully! 🚀', 'color: #06b6d4; font-size: 14px; font-weight: bold;');
