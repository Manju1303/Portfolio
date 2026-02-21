// Initialize Lucide icons
lucide.createIcons();

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileNav.classList.contains('active') ? 'x' : 'menu';
        mobileBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    });
}

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target); // Stop observing once revealed
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// Safety Fallback: Reveal all elements after 1 second if they haven't been revealed
setTimeout(() => {
    revealElements.forEach(el => {
        if (!el.classList.contains('active')) {
            el.classList.add('active');
        }
    });
}, 1000);

// Contact Form Handler - Google Sheets Submit
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzRxQ9shgi44Ao1ORhQfKJylW5V7ySG-JxhKPFA_kHKU9j0OQL6zfi58oBOSecjm_QS8A/exec';

document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'SENDING...';
    btn.disabled = true;

    const formData = {
        name: this.querySelector('[name="name"]').value,
        email: this.querySelector('[name="email"]').value,
        message: this.querySelector('[name="message"]').value
    };

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // With no-cors, we can't read response, so assume success
        btn.textContent = '✓ SENT!';
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';
        this.reset();
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        btn.textContent = '✗ FAILED';
        btn.style.background = '#ef4444';
        btn.style.borderColor = '#ef4444';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
        }, 3000);
    }
});

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

    // ---- Bounce Card: trigger animation on viewport entry ----
    const bounceCards = document.querySelectorAll('.bounce-card');
    bounceCards.forEach(card => {
        // Prevent CSS animation from running on load
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

    // ---- Scroll Stack Logic ----
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

    // Listen to window scroll
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial update
    updateCardTransforms();

    // Re-init Lucide icons for dynamically created icons
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
})();
