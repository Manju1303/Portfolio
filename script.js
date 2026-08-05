// ========================================
//   PORTFOLIO SCRIPT - ENHANCED ANIMATIONS
// ========================================

// Initialize Lucide icons
lucide.createIcons();

// ========================================
//   LENIS SMOOTH SCROLL
// ========================================
let lenis;
(function initLenis() {
    const isMobile = window.innerWidth <= 768;
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: isMobile ? 0 : 2
    });

    function rafLenis(t) {
        lenis.raf(t);
        requestAnimationFrame(rafLenis);
    }
    requestAnimationFrame(rafLenis);
})();

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
//   THREE.JS WEBGL BACKGROUND & GSAP SCROLL ZOOM
// ========================================
(function initThreeJSBackground() {
    try {
        const canvas = document.getElementById('webglCanvas');
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 6;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x06b6d4, 2);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x8b5cf6, 2);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        // Central Wireframe Knot Mesh
        const mainGeometry = new THREE.TorusKnotGeometry(1.2, 0.35, 120, 16);
        const mainMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.12,
            shininess: 120
        });
        const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
        scene.add(mainMesh);

        // Antigravity 3D Particle System
        const count = 1200;
        const positions = new Float32Array(count * 3);
        const speeds = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        
        const palette = [
            new THREE.Color(0x06b6d4), // Cyan
            new THREE.Color(0xec4899), // Pink
            new THREE.Color(0x8b5cf6)  // Purple
        ];
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 22; // X
            positions[i * 3 + 1] = (Math.random() - 0.5) * 22; // Y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4; // Z
            
            speeds[i] = Math.random() * 0.015 + 0.005; // Y float speed
            
            const col = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;
        }
        
        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.055,
            vertexColors: true,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Floating 3D Octahedrons
        const floatersGroup = new THREE.Group();
        scene.add(floatersGroup);
        const floaters = [];
        for (let i = 0; i < 20; i++) {
            const size = Math.random() * 0.22 + 0.05;
            const geom = new THREE.OctahedronGeometry(size, 0);
            const mat = new THREE.MeshPhongMaterial({
                color: Math.random() > 0.5 ? 0x06b6d4 : 0x8b5cf6,
                transparent: true,
                opacity: 0.25,
                wireframe: Math.random() > 0.4
            });
            const b = new THREE.Mesh(geom, mat);
            b.position.set(
                (Math.random() - 0.5) * 14,
                (Math.random() - 0.5) * 14,
                (Math.random() - 0.5) * 10 - 3
            );
            floatersGroup.add(b);
            floaters.push({
                mesh: b,
                speedY: Math.random() * 0.004 + 0.002,
                rotSpeed: Math.random() * 0.01 + 0.003,
                wobbleSpeed: Math.random() * 0.015 + 0.005,
                wobbleRange: Math.random() * 0.15 + 0.05,
                baseX: b.position.x
            });
        }

        // Resize Handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse Movement for Camera Parallax
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / 120;
            mouseY = (e.clientY - window.innerHeight / 2) / 120;
        }, { passive: true });

        // GSAP ScrollTrigger for Camera Zoom and Hero fly-out
        gsap.registerPlugin(ScrollTrigger);

        const isMobileDevice = window.innerWidth <= 768;

        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#home',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2
            }
        });

        // Fade out / Blur / Fly up hero text elements
        heroTl.to('.hero-role', { scale: 1.2, opacity: 0, filter: 'blur(8px)', y: -80, duration: 1 }, 0);
        heroTl.to('.hero-title', { scale: 1.3, opacity: 0, filter: 'blur(12px)', y: -120, duration: 1 }, 0.1);
        heroTl.to('.hero-bio', { scale: 1.15, opacity: 0, filter: 'blur(8px)', y: -60, duration: 1 }, 0.2);
        heroTl.to('.hero-buttons', { scale: 1.05, opacity: 0, filter: 'blur(4px)', y: -40, duration: 1 }, 0.3);

        // Zoom the camera through the scene and rotate the TorusKnot
        heroTl.to(mainMesh.scale, { x: 5, y: 5, z: 5, duration: 1.5 }, 0);
        heroTl.to(mainMesh.rotation, { x: Math.PI * 1.2, y: Math.PI * 1.2, duration: 1.5 }, 0);
        heroTl.to(camera.position, { z: 1.2, duration: 1.5 }, 0);

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            // Rotate main mesh
            mainMesh.rotation.x += 0.003;
            mainMesh.rotation.y += 0.003;

            // Animate floaters
            floaters.forEach(f => {
                f.mesh.rotation.x += f.rotSpeed;
                f.mesh.rotation.y += f.rotSpeed;
                f.mesh.position.y += f.speedY;
                if (f.mesh.position.y > 8) f.mesh.position.y = -8;
                f.mesh.position.x = f.baseX + Math.sin(Date.now() * 0.001 * f.wobbleSpeed * 100) * f.wobbleRange;
            });

            // Float particles upward
            const posArr = particlesGeometry.attributes.position.array;
            for (let i = 0; i < count; i++) {
                posArr[i * 3 + 1] += speeds[i];
                if (posArr[i * 3 + 1] > 11) {
                    posArr[i * 3 + 1] = -11;
                    posArr[i * 3] = (Math.random() - 0.5) * 22;
                    posArr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
                }
            }
            particlesGeometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.0004;

            // Smooth camera tilt based on mouse
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animate();
    } catch (e) {
        console.warn("Three.js Background WebGL Initialization failed:", e);
    }
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

    const texts = ['Manjunath', 'AI Engineer', 'Agentic Coder', 'AI & Agents', 'Computer Vision'];
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
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
        if (target && typeof lenis !== 'undefined') {
            lenis.scrollTo(target);
        } else if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
//   FORMSUBMIT CONTACT FORM - FULLY FUNCTIONAL
// ========================================

/*
 * ============================================
 * FORMSUBMIT SETUP INSTRUCTIONS
 * ============================================
 * 
 * To make this contact form work with FormSubmit:
 * 
 * 1. Your email is configured as: manjunathkaids23@jkkmct.edu.in
 * 2. Submit the form once via the website interface.
 * 3. FormSubmit will send an activation email to your email address.
 * 4. Click the activation link in that email to start receiving forms.
 * 
 * CUSTOMIZING FORMSUBMIT:
 * - You can use fields like _captcha, _subject, _honey, and _cc.
 * - Current setup uses _captcha: 'false' for clean AJAX submissions.
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
            const response = await fetch('https://formsubmit.co/ajax/manjunathkaids23@jkkmct.edu.in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    _subject: formData.subject ? `Portfolio Contact: ${formData.subject}` : 'New Portfolio Contact Message',
                    message: formData.message,
                    _captcha: 'false'
                })
            });

            const data = await response.json();

            if (response.ok && (data.success === 'true' || data.success === true)) {
                showFormMessage('success', '✓ Message sent! I will get back to you soon.');
                this.reset();
                lucide.createIcons(); // Re-sync icons if needed
                spawnConfetti();
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

// ========================================
//   CONFETTI GENERATOR FOR FORM SUCCESS
// ========================================
function spawnConfetti() {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;overflow:hidden;';
    document.body.appendChild(container);
    
    const colors = ['#06b6d4', '#ec4899', '#8b5cf6', '#4ade80', '#f59e0b'];
    const count = 100;
    
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 8 + 4;
        p.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            left: ${Math.random() * 100}vw;
            top: -20px;
            opacity: ${Math.random() * 0.8 + 0.2};
            transform: rotate(${Math.random() * 360}deg);
            transition: all ${Math.random() * 2 + 1.5}s cubic-bezier(0.1, 0.8, 0.3, 1);
        `;
        container.appendChild(p);
        
        // Let it fall
        setTimeout(() => {
            p.style.transform = `translate(${(Math.random() - 0.5) * 300}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`;
            p.style.opacity = '0';
        }, 50);
    }
    
    setTimeout(() => {
        container.remove();
    }, 4000);
}

// ========================================
//   ABOUT SECTION MINI 3D GLOBE
// ========================================
(function initAboutSectionGlobe() {
    try {
        const canvas = document.getElementById('about-canvas');
        if (!canvas) return;

        const wrap = canvas.parentElement;
        if (!wrap) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(wrap.clientWidth, wrap.clientHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
        camera.position.z = 4.5;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        scene.add(ambientLight);

        const light1 = new THREE.PointLight(0x06b6d4, 3);
        light1.position.set(3, 3, 3);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x8b5cf6, 2.5);
        light2.position.set(-3, -3, 3);
        scene.add(light2);

        // 1. Wireframe Outer Sphere
        const sphereGeom = new THREE.SphereGeometry(1.4, 26, 26);
        const sphereMat = new THREE.MeshPhongMaterial({
            color: 0x06b6d4,
            wireframe: true,
            transparent: true,
            opacity: 0.4,
            shininess: 80
        });
        const globe = new THREE.Mesh(sphereGeom, sphereMat);
        scene.add(globe);

        // 2. Inner Tech Core (Icosahedron)
        const coreGeom = new THREE.IcosahedronGeometry(0.9, 1);
        const coreMat = new THREE.MeshPhongMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.18,
            flatShading: true
        });
        const core = new THREE.Mesh(coreGeom, coreMat);
        scene.add(core);

        // 3. Orbital Path Rings
        const ringGeom = new THREE.RingGeometry(1.6, 1.62, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xec4899,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.35
        });
        
        const ring1 = new THREE.Mesh(ringGeom, ringMat);
        ring1.rotation.x = Math.PI / 2;
        scene.add(ring1);

        const ring2 = new THREE.Mesh(ringGeom, ringMat);
        ring2.rotation.y = Math.PI / 4;
        scene.add(ring2);

        // 4. Star Particles
        const starCount = 350;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 8;
        }
        const starGeom = new THREE.BufferGeometry();
        starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        
        const starMat = new THREE.PointsMaterial({
            size: 0.045,
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        const stars = new THREE.Points(starGeom, starMat);
        scene.add(stars);

        // Resize Observer for the visualizer panel
        function resize() {
            const w = wrap.clientWidth;
            const h = wrap.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }

        const resizeObserver = new ResizeObserver(() => {
            resize();
        });
        resizeObserver.observe(wrap);

        // Animation Loop
        function animateGlobe() {
            requestAnimationFrame(animateGlobe);

            globe.rotation.y += 0.007;
            globe.rotation.x += 0.003;
            core.rotation.y -= 0.005;
            
            ring1.rotation.z += 0.008;
            ring2.rotation.z -= 0.006;
            
            stars.rotation.y += 0.0003;

            renderer.render(scene, camera);
        }
        animateGlobe();
    } catch (e) {
        console.warn("About section mini globe WebGL Initialization failed:", e);
    }
})();

// ========================================
//   TOAST NOTIFICATION ENGINE
// ========================================
function showToast(message, icon = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    const icons = {
        info: '<i data-lucide="info" style="color:#06b6d4;"></i>',
        success: '<i data-lucide="check-circle" style="color:#4ade80;"></i>',
        alert: '<i data-lucide="alert-triangle" style="color:#f59e0b;"></i>'
    };

    toast.innerHTML = `${icons[icon] || icons.info} <span>${message}</span>`;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ========================================
//   INTERACTIVE PROJECT CATEGORY FILTERING
// ========================================
(function initProjectFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-flip-card');

    if (!filterTabs.length || !projectCards.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = (card.getAttribute('data-category') || '').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('filter-hidden');
                    card.style.animation = 'stagger-fade-in 0.4s ease forwards';
                } else {
                    card.classList.add('filter-hidden');
                }
            });

            projectCards.forEach(card => {
                const categories = (card.getAttribute('data-category') || '').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('filter-hidden');
                    card.style.animation = 'stagger-fade-in 0.4s ease forwards';
                } else {
                    card.classList.add('filter-hidden');
                }
            });
        });
    });
})();

// ========================================
//   CYBER COMMAND PALETTE LOGIC
// ========================================
(function initCommandPalette() {
    const palette = document.getElementById('cmdPalette');
    const input = document.getElementById('cmdInput');
    const results = document.getElementById('cmdResults');
    const openBtn = document.getElementById('cmdPaletteBtn');

    if (!palette || !input || !results) return;

    function openPalette() {
        palette.classList.add('active');
        input.focus();
        input.value = '';
        filterCommands('');
    }

    function closePalette() {
        palette.classList.remove('active');
    }

    if (openBtn) {
        openBtn.addEventListener('click', openPalette);
    }

    // Keyboard trigger Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (palette.classList.contains('active')) closePalette();
            else openPalette();
        } else if (e.key === 'Escape' && palette.classList.contains('active')) {
            closePalette();
        }
    });

    // Overlay click close
    palette.addEventListener('click', (e) => {
        if (e.target === palette) closePalette();
    });

    // Search filtering
    input.addEventListener('input', (e) => {
        filterCommands(e.target.value.toLowerCase().trim());
    });

    function filterCommands(query) {
        const items = results.querySelectorAll('.cmd-item');
        let hasMatch = false;

        items.forEach((item, i) => {
            const cmd = item.getAttribute('data-cmd') || '';
            const text = item.textContent.toLowerCase();
            
            if (!query || cmd.includes(query) || text.includes(query)) {
                item.style.display = 'flex';
                if (!hasMatch) {
                    items.forEach(it => it.classList.remove('active'));
                    item.classList.add('active');
                    hasMatch = true;
                }
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Action Execution
    results.addEventListener('click', (e) => {
        const item = e.target.closest('.cmd-item');
        if (item) executeCommand(item.getAttribute('data-cmd'));
    });

    input.addEventListener('keydown', (e) => {
        const items = Array.from(results.querySelectorAll('.cmd-item')).filter(it => it.style.display !== 'none');
        const activeIdx = items.findIndex(it => it.classList.contains('active'));

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIdx = (activeIdx + 1) % items.length;
            items.forEach(it => it.classList.remove('active'));
            if (items[nextIdx]) items[nextIdx].classList.add('active');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIdx = (activeIdx - 1 + items.length) % items.length;
            items.forEach(it => it.classList.remove('active'));
            if (items[prevIdx]) items[prevIdx].classList.add('active');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const activeItem = items[activeIdx] || items[0];
            if (activeItem) executeCommand(activeItem.getAttribute('data-cmd'));
        }
    });

    function executeCommand(cmd) {
        closePalette();

        switch (cmd) {
            case 'goto home':
                window.location.hash = '#home';
                showToast('Navigated to Home', 'info');
                break;
            case 'goto about':
                window.location.hash = '#about';
                showToast('Navigated to About Section', 'info');
                break;
            case 'goto projects':
                window.location.hash = '#projects';
                showToast('Navigated to Projects Showcase', 'info');
                break;
            case 'goto contact':
                window.location.hash = '#contact';
                showToast('Navigated to Contact Section', 'info');
                break;
            case 'copy email':
                navigator.clipboard.writeText('manjunathkaids23@jkkmct.edu.in');
                showToast('Email copied to clipboard! 📋', 'success');
                break;
            case 'open github':
                window.open('https://github.com/Manju1303', '_blank');
                showToast('Opening GitHub profile...', 'info');
                break;
            default:
                showToast(`Executed: ${cmd}`, 'info');
        }
    }
})();

