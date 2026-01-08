document.addEventListener('DOMContentLoaded', () => {
    // Cursor Follower
    const cursor = document.querySelector('.cursor-dot');

    if (cursor) {
        // Initialize position to avoid jump
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth lerp animation
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.1;
            cursorY += dy * 0.1;

            cursor.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // Scroll Animations (Reveal on Scroll)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            // Change icon logic if needed
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
            });
        });
    }

    // Form Submission (AJAX)
    const form = document.querySelector('form');
    const status = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(e.target);

            status.style.color = 'var(--text-secondary)';
            status.textContent = 'Sending...';

            try {
                const response = await fetch(e.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.style.color = '#4ade80'; // Green
                    status.innerText = "Message sent successfully!";
                    form.reset();
                } else {
                    status.style.color = '#f87171'; // Red
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        status.innerText = responseData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.innerText = "Oops! There was a problem submitting your form";
                    }
                }
            } catch (error) {
                status.style.color = '#f87171';
                status.innerText = "Oops! There was a problem submitting your form";
            }
        });
    }
});
