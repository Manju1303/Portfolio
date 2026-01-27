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

// Contact Form Handler - Web3Forms AJAX Submit
document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'SENDING...';
    btn.disabled = true;

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: new FormData(this)
        });

        const result = await response.json();

        if (result.success) {
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
        } else {
            throw new Error(result.message || 'Failed to send');
        }
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
