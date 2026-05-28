// ========================================
//   PORTFOLIO SCRIPT - ENHANCED ANIMATIONS
// ========================================

// Initialize Lucide icons
lucide.createIcons();

// ========================================
//   EPIC PAGE LOADER WITH PROGRESS BAR
// ========================================
(function initEpicLoader() {
    const loader = document.getElementById('pageLoader');
    const bar = document.getElementById('loaderBar');
    const particlesContainer = document.getElementById('loaderParticles');
    if (!loader) return;

    // Create floating particles in loader
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: ${Math.random() > 0.5 ? 'var(--primary)' : 'var(--secondary)'};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: loaderFloat ${Math.random() * 3 + 2}s ease-in-out infinite alternate;
                animation-delay: ${Math.random() * 2}s;
                box-shadow: 0 0 ${Math.random() * 10 + 5}px currentColor;
            `;
            particlesContainer.appendChild(p);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes loaderFloat {
                from { transform: translateY(0) scale(1); opacity: 0.3; }
                to { transform: translateY(-${30 + Math.random() * 40}px) scale(1.5); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }

    // Animate progress bar
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        if (bar) bar.style.width = progress + '%';
        if (progress >= 100) clearInterval(interval);
    }, 120);

    window.addEventListener('load', () => {
        if (bar) bar.style.width = '100%';
        setTimeout(() => {
            loader.classList.add('hidden');
            // Trigger hero entrance animations
            document.body.classList.add('loaded');
        }, 600);
    });
})();

// ========================================
//   ANTIGRAVITY PARTICLE BACKGROUND
// ========================================
(function initAntigravityParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class AntigravityParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            
            // 3D Depth Level (z): 0.1 (far background) to 1.0 (close foreground)
            this.z = Math.random() * 0.9 + 0.1;
            
            this.size = this.z * 3.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4 * this.z;
            this.speedY = -(Math.random() * 0.8 + 0.3) * (this.z * 1.2 + 0.4); // float faster if closer
            this.opacity = (Math.random() * 0.5 + 0.15) * this.z; // opacity based on depth
            this.hue = Math.random() > 0.7 ? 330 : (Math.random() > 0.5 ? 270 : 188); // cyan, purple, pink
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = (Math.random() * 0.02 + 0.01) * this.z;
            this.wobble = Math.random() * 0.5 * this.z;
            this.wobbleSpeed = Math.random() * 0.02 + 0.005;
            this.wobblePhase = Math.random() * Math.PI * 2;
            this.life = 1;
        }

        update() {
            // Antigravity: float upward
            this.y += this.speedY;
            
            // Gentle lateral wobble
            this.wobblePhase += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobblePhase) * this.wobble;
            
            // Pulse glow
            this.pulse += this.pulseSpeed;
            const glowFactor = 0.5 + Math.sin(this.pulse) * 0.5;
            this.currentOpacity = this.opacity * glowFactor;

            // Mouse attraction (soft pull - stronger for closer particles)
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150 * 0.4 * this.z;
                this.x += dx / dist * force;
                this.y += dy / dist * force;
            }

            // Fade out at top, respawn at bottom
            if (this.y < -20) {
                this.reset();
            }
            
            // Wrap horizontally
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
        }

        draw() {
            // Main particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.currentOpacity})`;
            ctx.fill();

            // Glow aura
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.currentOpacity * 0.15})`;
                ctx.fill();
            }
        }
    }

    // Create particles based on screen size
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 12));
    for (let i = 0; i < particleCount; i++) {
        const p = new AntigravityParticle();
        p.y = Math.random() * canvas.height; // Initial spread
        particles.push(p);
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    const alpha = 0.06 * (1 - dist / 100);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
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
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();

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

    const texts = ['Manjunath', 'AI Engineer', 'Vibe Coder', 'AI & Agents', 'Computer Vision'];
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
// ========================================
//   3D Z-SCROLL TUNNEL CONTROLLER
// ========================================
(function init3DScrollTunnel() {
    const container = document.getElementById('container3d');
    const sections = Array.from(document.querySelectorAll('#container3d > section, #container3d > footer'));
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!container || !sections.length) return;

    // Define Z offsets (depth stack) for each section
    const zOffsets = [0, -2000, -4000, -6000, -7200];
    const totalDepth = -zOffsets[zOffsets.length - 1]; // 7200

    // Set initial Z translations
    sections.forEach((sec, i) => {
        sec.style.transform = `translate3d(0, 0, ${zOffsets[i]}px)`;
    });

    let currentCameraZ = 0;
    let targetCameraZ = 0;

    // Scroll listener to calculate target camera Z depth
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;
        const progress = scrollTop / maxScroll;
        targetCameraZ = progress * totalDepth;
    }, { passive: true });

    // Smooth animation render loop using requestAnimationFrame
    function animate() {
        // Easing interpolation
        currentCameraZ += (targetCameraZ - currentCameraZ) * 0.08;
        if (Math.abs(targetCameraZ - currentCameraZ) < 0.01) {
            currentCameraZ = targetCameraZ;
        }

        // Translate the camera/container in 3D Z space
        container.style.transform = `translate3d(0, 0, ${currentCameraZ}px)`;

        // Calculate opacity and visibility for each section based on relative distance to camera
        sections.forEach((sec, i) => {
            const distance = zOffsets[i] + currentCameraZ;
            let opacity = 0;

            if (distance <= 0) {
                // Section is in the background approaching the camera
                opacity = Math.max(0, 1 + distance / 1200); // Fade in over 1200px
            } else {
                // Section has zoomed past the camera
                opacity = Math.max(0, 1 - distance / 350); // Fade out quickly over 350px
            }

            sec.style.opacity = opacity;

            // Enable mouse events and render visibility state
            if (opacity > 0.05) {
                sec.style.pointerEvents = 'auto';
                sec.style.visibility = 'visible';
            } else {
                sec.style.pointerEvents = 'none';
                sec.style.visibility = 'hidden';
            }
        });

        // Dynamic Nav Link Highlighting based on closest section
        let closestIndex = 0;
        let minDiff = Infinity;
        sections.forEach((sec, i) => {
            const distance = Math.abs(zOffsets[i] + currentCameraZ);
            if (distance < minDiff && sec.tagName !== 'FOOTER') {
                minDiff = distance;
                closestIndex = i;
            }
        });

        const activeId = sections[closestIndex].getAttribute('id');
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${activeId}`) {
                link.style.color = '#06b6d4';
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Intercept anchor clicks and smooth-scroll to correct Z-depth
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            let targetIndex = -1;

            if (href === '#home') targetIndex = 0;
            else if (href === '#about') targetIndex = 1;
            else if (href === '#projects') targetIndex = 2;
            else if (href === '#contact') targetIndex = 3;

            if (targetIndex !== -1) {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const targetScroll = (targetIndex / (sections.length - 2)) * maxScroll;
                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

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
            const response = await fetch('/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showFormMessage('success', '✓ Message sent! I will get back to you soon.');
                this.reset();
                lucide.createIcons(); // Re-sync icons if needed
            } else {
                showFormMessage('error', `✗ Failed: ${data.message || 'Please try again.'}`);
            }

        } catch (error) {
            console.error('Contact Form Error:', error);
            showFormMessage('error', '✗ Oops! Something went wrong. Please check your internet or email me directly.');
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

// ========================================
//   PROFILE CARD - TILT EFFECT
// ========================================
(function initProfileCard() {
    const card = document.getElementById('profileCard');
    if (!card || window.innerWidth < 768) return;

    card.style.transformStyle = 'preserve-3d';
    card.style.perspective = '600px';

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
})();

// ========================================
//   RIBBON CURSOR TRAIL (OGL)
// ========================================
(function initRibbons() {
    const container = document.getElementById('ribbonsContainer');
    if (!container || typeof OGL === 'undefined') return;

    const { Renderer, Transform, Vec3, Color, Polyline } = OGL;

    const COLORS = ['#06b6d4', '#ec4899', '#8b5cf6'];
    const BASE_SPRING = 0.03;
    const BASE_FRICTION = 0.9;
    const BASE_THICKNESS = 30;
    const OFFSET_FACTOR = 0.05;
    const MAX_AGE = 500;
    const POINT_COUNT = 50;
    const SPEED_MULT = 0.6;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    container.appendChild(gl.canvas);

    const scene = new Transform();
    const lines = [];

    const vertex = `
        precision highp float;
        attribute vec3 position;
        attribute vec3 next;
        attribute vec3 prev;
        attribute vec2 uv;
        attribute float side;
        uniform vec2 uResolution;
        uniform float uDPR;
        uniform float uThickness;
        varying vec2 vUV;
        vec4 getPosition() {
            vec4 current = vec4(position, 1.0);
            vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
            vec2 nextScreen = next.xy * aspect;
            vec2 prevScreen = prev.xy * aspect;
            vec2 tangent = normalize(nextScreen - prevScreen);
            vec2 normal = vec2(-tangent.y, tangent.x);
            normal /= aspect;
            normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
            float dist = length(nextScreen - prevScreen);
            normal *= smoothstep(0.0, 0.02, dist);
            float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
            float pixelWidth = current.w * pixelWidthRatio;
            normal *= pixelWidth * uThickness;
            current.xy -= normal * side;
            return current;
        }
        void main() {
            vUV = uv;
            gl_Position = getPosition();
        }
    `;

    const fragment = `
        precision highp float;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUV;
        void main() {
            float fade = 1.0 - smoothstep(0.0, 1.0, vUV.y);
            gl_FragColor = vec4(uColor, uOpacity * fade);
        }
    `;

    function resize() {
        renderer.setSize(container.clientWidth, container.clientHeight);
        lines.forEach(l => l.polyline.resize());
    }

    window.addEventListener('resize', resize);

    const center = (COLORS.length - 1) / 2;
    COLORS.forEach((color, i) => {
        const spring = BASE_SPRING + (Math.random() - 0.5) * 0.05;
        const friction = BASE_FRICTION + (Math.random() - 0.5) * 0.05;
        const thickness = BASE_THICKNESS + (Math.random() - 0.5) * 3;
        const mouseOffset = new Vec3(
            (i - center) * OFFSET_FACTOR + (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.1,
            0
        );

        const points = [];
        for (let j = 0; j < POINT_COUNT; j++) points.push(new Vec3());

        const polyline = new Polyline(gl, {
            points,
            vertex,
            fragment,
            uniforms: {
                uColor: { value: new Color(color) },
                uThickness: { value: thickness },
                uOpacity: { value: 0.6 }
            }
        });

        polyline.mesh.setParent(scene);
        lines.push({ spring, friction, mouseVelocity: new Vec3(), mouseOffset, points, polyline });
    });

    resize();

    const mouse = new Vec3();
    function updateMouse(e) {
        let x, y;
        if (e.changedTouches && e.changedTouches.length) {
            x = e.changedTouches[0].clientX;
            y = e.changedTouches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        mouse.set(
            (x / window.innerWidth) * 2 - 1,
            (y / window.innerHeight) * -2 + 1,
            0
        );
    }

    document.addEventListener('mousemove', updateMouse);
    document.addEventListener('touchstart', updateMouse, { passive: true });
    document.addEventListener('touchmove', updateMouse, { passive: true });

    const tmp = new Vec3();
    let lastTime = performance.now();

    function update() {
        requestAnimationFrame(update);
        const now = performance.now();
        const dt = now - lastTime;
        lastTime = now;

        lines.forEach(line => {
            tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
            line.mouseVelocity.add(tmp).multiply(line.friction);
            line.points[0].add(line.mouseVelocity);

            for (let i = 1; i < line.points.length; i++) {
                const segDelay = MAX_AGE / (line.points.length - 1);
                const alpha = Math.min(1, (dt * SPEED_MULT) / segDelay);
                line.points[i].lerp(line.points[i - 1], alpha);
            }
            line.polyline.updateGeometry();
        });

        renderer.render({ scene });
    }
    update();
})();

// ========================================
//   3D CARD TILT EFFECT FOR PROJECT CARDS
// ========================================
(function initProjectCardTilt() {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.project-flip-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
})();

// ========================================
//   ENHANCED SECTION SCROLL REVEAL
// ========================================
(function initSectionReveals() {
    // Add reveal classes to sections
    document.querySelectorAll('.section-padding').forEach(section => {
        const container = section.querySelector('.container');
        if (container) container.classList.add('section-reveal');
    });

    // Add reveal to specific elements
    document.querySelectorAll('.projects-header, .about-grid, .contact-grid').forEach(el => {
        el.classList.add('section-reveal');
    });

    // Add stagger to grids
    document.querySelectorAll('.projects-showcase, .tools-grid, .skills-grid').forEach(el => {
        el.classList.add('stagger-children', 'section-reveal');
    });

    // Section title reveals - slide in with blur
    document.querySelectorAll('.projects-title, .section-title, .contact-title, .about-title, .education-title').forEach(el => {
        el.classList.add('section-title-reveal');
    });

    // Individual card reveals with stagger
    document.querySelectorAll('.glass-panel, .education-card, .tool-card').forEach((el, i) => {
        el.classList.add('section-reveal');
        el.setAttribute('data-reveal-delay', (i % 4) * 100);
    });

    // Observe and reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.section-reveal, .section-title-reveal, .stagger-children').forEach(el => {
        observer.observe(el);
    });
})();

console.log('%c Portfolio loaded successfully! 🚀', 'color: #06b6d4; font-size: 14px; font-weight: bold;');

/* ========================================
   3D RUBIK'S CUBE (Integrated)
======================================== */
(function initRubiksCube() {
    const isMobile = window.innerWidth <= 768;
    const STEP_PX = isMobile ? 54 : 80;
    const HALF_PX = STEP_PX / 2;

    const FC = {
        front: { bg: '#009B48', cls: 'fc-green' },
        back: { bg: '#0051A2', cls: 'fc-blue' },
        right: { bg: '#C41E3A', cls: 'fc-red' },
        left: { bg: '#FF5800', cls: 'fc-orange' },
        top: { bg: '#FFFFFF', cls: 'fc-white' },
        bottom: { bg: '#FFD500', cls: 'fc-yellow' },
        inner: { bg: '#111', cls: 'fc-inner' },
    };

    const FACE_DEFS = [
        { key: 'front', t: (h) => `translateZ(${h}px)` },
        { key: 'back', t: (h) => `rotateY(180deg) translateZ(${h}px)` },
        { key: 'right', t: (h) => `rotateY(90deg) translateZ(${h}px)` },
        { key: 'left', t: (h) => `rotateY(-90deg) translateZ(${h}px)` },
        { key: 'top', t: (h) => `rotateX(90deg) translateZ(${h}px)` },
        { key: 'bottom', t: (h) => `rotateX(-90deg) translateZ(${h}px)` },
    ];

    const cubeScene = document.getElementById('cubeScene');
    const cubies = [];
    if (!cubeScene) return;

    function makeCubie(lx, ly, lz) {
        const el = document.createElement('div');
        el.className = 'cubie';
        const currentStep = window.innerWidth <= 768 ? 54 : 80;
        const currentHalf = currentStep / 2;
        
        FACE_DEFS.forEach(fd => {
            let fc = FC.inner;
            if (fd.key === 'front' && lz === 1) fc = FC.front;
            if (fd.key === 'back' && lz === -1) fc = FC.back;
            if (fd.key === 'right' && lx === 1) fc = FC.right;
            if (fd.key === 'left' && lx === -1) fc = FC.left;
            if (fd.key === 'top' && ly === 1) fc = FC.top;
            if (fd.key === 'bottom' && ly === -1) fc = FC.bottom;

            const face = document.createElement('div');
            face.className = 'cubie-face ' + fc.cls;
            face.style.transform = fd.t(currentHalf) + (fc === FC.inner ? ' scale(0.98)' : '');
            
            if (fc !== FC.inner) {
                face.innerHTML = '<div class="gloss"></div><div class="shine"></div>';
            }
            el.appendChild(face);
        });
        const m = new DOMMatrix().translate(lx * currentStep, -ly * currentStep, lz * currentStep);
        el.style.transform = m.toString();
        return { el, m };
    }

    function buildCube() {
        cubeScene.innerHTML = '';
        cubies.length = 0;
        for (let y = 1; y >= -1; y--) {
            for (let x = -1; x <= 1; x++) {
                for (let z = 1; z >= -1; z--) {
                    const c = makeCubie(x, y, z);
                    cubeScene.appendChild(c.el);
                    cubies.push(c);
                }
            }
        }
    }

    function snap(m) {
        const step = window.innerWidth <= 768 ? 54 : 80;
        m.m41 = Math.round(m.m41 / step) * step;
        m.m42 = Math.round(m.m42 / step) * step;
        m.m43 = Math.round(m.m43 / step) * step;
        ['m11', 'm12', 'm13', 'm21', 'm22', 'm23', 'm31', 'm32', 'm33'].forEach(f => {
            if (Math.abs(m[f]) < 0.1) m[f] = 0;
            else m[f] = Math.sign(m[f]);
        });
    }

    function rotateLayer(axis, slice, angle, ms) {
        return new Promise(resolve => {
            const step = window.innerWidth <= 768 ? 54 : 80;
            const layer = cubies.filter(c => {
                const x = Math.round(c.m.m41 / step);
                const y = Math.round(-c.m.m42 / step);
                const z = Math.round(c.m.m43 / step);
                const val = (axis === 'x') ? x : (axis === 'y' ? y : z);
                return val === slice;
            });

            if (layer.length === 0) { resolve(); return; }

            const pivot = document.createElement('div');
            pivot.style.cssText = 'position:absolute;width:0;height:0;transform-style:preserve-3d;';
            cubeScene.appendChild(pivot);
            layer.forEach(c => pivot.appendChild(c.el));
            pivot.getBoundingClientRect();

            if (ms > 0) pivot.style.transition = `transform ${ms}ms cubic-bezier(0.34, 1.25, 0.64, 1)`;
            pivot.style.transform = axis === 'y' ? `rotateY(${angle}deg)` : axis === 'x' ? `rotateX(${angle}deg)` : `rotateZ(${angle}deg)`;

            setTimeout(() => {
                const rotStr = axis === 'y' ? `rotateY(${angle}deg)` : axis === 'x' ? `rotateX(${angle}deg)` : `rotateZ(${angle}deg)`;
                const rotM = new DOMMatrix(rotStr);
                layer.forEach(c => {
                    c.m = rotM.multiply(c.m);
                    snap(c.m);
                    cubeScene.appendChild(c.el);
                    c.el.style.transition = 'none';
                    c.el.style.transform = c.m.toString();
                    void c.el.offsetHeight;
                });
                pivot.remove();
                resolve();
            }, ms + 50);
        });
    }

    const MOVES = [
        { axis: 'y', slice: 1, angle: 90 }, { axis: 'y', slice: 1, angle: -90 },
        { axis: 'y', slice: 0, angle: 90 }, { axis: 'y', slice: 0, angle: -90 },
        { axis: 'y', slice: -1, angle: 90 }, { axis: 'y', slice: -1, angle: -90 },
        { axis: 'x', slice: 1, angle: 90 }, { axis: 'x', slice: 1, angle: -90 },
        { axis: 'x', slice: 0, angle: 90 }, { axis: 'x', slice: 0, angle: -90 },
        { axis: 'x', slice: -1, angle: 90 }, { axis: 'x', slice: -1, angle: -90 },
        { axis: 'z', slice: 1, angle: 90 }, { axis: 'z', slice: 1, angle: -90 },
        { axis: 'z', slice: -1, angle: 90 }, { axis: 'z', slice: -1, angle: -90 },
    ];

    let history = [];
    let busy = false;
    let manualMode = false;
    let manualTimer;

    function setStatus(txt) {
        const el = document.getElementById('cubeStatus');
        if (el) el.textContent = txt;
    }

    function setBtnsDisabled(v) {
        const b1 = document.getElementById('btnScramble');
        const b2 = document.getElementById('btnSolve');
        if (b1) b1.disabled = v;
        if (b2) b2.disabled = v;
    }

    async function scramble(n = 12, ms = 150) {
        if (busy) return;
        busy = true; setBtnsDisabled(true);
        setStatus('Scrambling...');
        history = [];
        for (let i = 0; i < n; i++) {
            let m;
            do { m = MOVES[Math.floor(Math.random() * MOVES.length)]; }
            while (history.length && history[history.length - 1].axis === m.axis && history[history.length - 1].slice === m.slice);
            history.push(m);
            await rotateLayer(m.axis, m.slice, m.angle, ms);
            await new Promise(r => setTimeout(r, 20));
        }
        busy = false; setBtnsDisabled(false);
        setStatus('Ready for challenge');
    }

    async function solve(ms = 300) {
        if (busy || !history.length) return;
        busy = true; setBtnsDisabled(true);
        setStatus('Solving...');
        const moves = [...history].reverse().map(m => ({ ...m, angle: -m.angle }));
        for (const m of moves) {
            await rotateLayer(m.axis, m.slice, m.angle, ms);
            await new Promise(r => setTimeout(r, 30));
        }
        history = [];
        busy = false; setBtnsDisabled(false);
        setStatus('Solved! ✓');
    }

    let rotX = -22, rotY = 45;
    let velX = 0, velY = 0;
    let dragging = false, lx = 0, ly = 0;
    let lastDx = 0, lastDy = 0;

    function animRot() {
        if (!dragging) {
            velY *= 0.94; velX *= 0.94;
            if (!manualMode && !busy) {
                velY += (0.2 - velY) * 0.02;
                velX += (0 - velX) * 0.02;
            }
            rotY += velY;
            rotX += velX;
            rotX = Math.max(-60, Math.min(60, rotX));
        }
        cubeScene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        requestAnimationFrame(animRot);
    }

    const cubeVP = document.querySelector('.cube-viewport');
    if (cubeVP) {
        const startDrag = (x, y) => {
            dragging = true; lx = x; ly = y;
            velX = 0; velY = 0; manualMode = true;
            clearTimeout(manualTimer);
        };
        const moveDrag = (x, y) => {
            if (!dragging) return;
            lastDx = (x - lx) * 0.5;
            lastDy = (y - ly) * 0.5;
            rotY += lastDx; rotX -= lastDy;
            rotX = Math.max(-60, Math.min(60, rotX));
            lx = x; ly = y;
        };
        const endDrag = () => {
            if (!dragging) return;
            dragging = false;
            velY = lastDx * 0.8;
            velX = -lastDy * 0.8;
            manualTimer = setTimeout(() => { manualMode = false; }, 8000);
        };

        cubeVP.addEventListener('mousedown', e => { startDrag(e.clientX, e.clientY); e.preventDefault(); });
        document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
        document.addEventListener('mouseup', endDrag);

        cubeVP.addEventListener('touchstart', e => startDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        document.addEventListener('touchmove', e => moveDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        document.addEventListener('touchend', endDrag);
    }

    buildCube();
    animRot();

    document.getElementById('btnScramble').addEventListener('click', () => scramble(12, 180));
    document.getElementById('btnSolve').addEventListener('click', () => solve(350));

    window.addEventListener('load', async () => {
        // Run Lucide here to catch any late icons
        if (window.lucide) window.lucide.createIcons();
        
        await new Promise(r => setTimeout(r, 2000));
        await scramble(6, 120);
        await new Promise(r => setTimeout(r, 600));
        await solve(360);
    });
})();
