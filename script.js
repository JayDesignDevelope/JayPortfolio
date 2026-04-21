document.addEventListener("DOMContentLoaded", () => {
    // Force Home selection on refresh if no explicit hash or just ensure home is clicked
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) {
        setTimeout(() => homeLink.click(), 50);
    }

    // Prevent FOUC
    gsap.set(".logo-wrapper, .social-section, .transform-btn", { opacity: 0, x: -20 });
    gsap.set(".inner-nav", { opacity: 0, y: -20 });
    gsap.set(".stagger-up", { opacity: 0, y: 30 });
    gsap.set(".inline-chat-wrapper", { opacity: 0, scale: 0.95 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Sidebar animations
    tl.to(".logo-wrapper", { opacity: 1, x: 0, duration: 0.8 }, 0.2)
      .to(".social-section", { opacity: 1, x: 0, duration: 0.8 }, "-=0.6")
      .to(".transform-btn", { opacity: 1, x: 0, duration: 0.8 }, "-=0.6");

    // Main Content animations
    tl.to(".inner-nav", { opacity: 1, y: 0, duration: 0.8 }, 0.4)
      .to(".stagger-up", { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, "-=0.4")
      .to(".inline-chat-wrapper", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }, "-=0.4");

    // Interactive Navigation Links (Hover & Click State)
    const allNavLinks = document.querySelectorAll('.nav-links a');
    allNavLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (!link.classList.contains('active')) {
                gsap.to(link, { color: '#FFFFFF', duration: 0.3 });
            }
        });
        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                gsap.to(link, { color: 'rgba(255, 255, 255, 0.7)', duration: 0.3 });
            }
        });
        link.addEventListener('click', () => {
            // Remove active class from everyone and clear inline GSAP styles
            allNavLinks.forEach(n => {
                n.classList.remove('active');
                gsap.set(n, { clearProps: "all" });
            });
            // Add active to the clicked link
            link.classList.add('active');
        });
    });

    // Typewriter Effect
    const words = ["DEVELOPER.", "ENGINEER.", "RESEARCHER.", "DESIGNER."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.querySelector(".typewriter-text");

    function type() {
        if (!typewriterElement) return;

        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typewriterElement.textContent = currentWord.substring(0, charIndex);

        let typeSpeed = isDeleting ? 40 : 120;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1800);

    // ============================================================
    // EDUCATION TIMELINE — GSAP Scroll Animations
    // ============================================================
    if (typeof gsap !== 'undefined') {

        const tlEntries = document.querySelectorAll('[data-tl]');

        tlEntries.forEach((entry) => {
            const yearEl = entry.querySelector('.tl-year');
            const dot    = entry.querySelector('.tl-dot');
            const card   = entry.querySelector('.tl-glass-card');

            // Set initial GSAP hidden state (CSS visibility:hidden is also set)
            if (yearEl) gsap.set(yearEl, { opacity: 0, x: -40 });
            if (dot)    gsap.set(dot,    { opacity: 0, scale: 0 });
            if (card)   gsap.set(card,   { opacity: 0, y: 32 });

            // Reveal when scrolled into view
            const obs = new IntersectionObserver((items) => {
                items.forEach(item => {
                    if (item.isIntersecting) {
                        // Lift CSS visibility:hidden first
                        entry.classList.add('revealed');

                        // Staggered cinematic entrance
                        if (yearEl) gsap.to(yearEl, { opacity: 1, x: 0,    duration: 0.55, ease: 'power3.out',   delay: 0.05 });
                        if (dot)    gsap.to(dot,    { opacity: 1, scale: 1, duration: 0.5,  ease: 'back.out(2.5)',delay: 0.2  });
                        if (card)   gsap.to(card,   { opacity: 1, y: 0,    duration: 0.6,  ease: 'power3.out',   delay: 0.3  });

                        obs.unobserve(item.target);
                    }
                });
            }, { threshold: 0.1 });

            obs.observe(entry);
        });
    }
});


// ============================================================
// Bento Grid Premium GSAP ScrollTrigger Animations
// ============================================================
const bentoCards = document.querySelectorAll('.bento-card');
if (bentoCards.length > 0) {
    // Set initial structural state for a premium 3D entrance
    gsap.set(bentoCards, { 
        y: 120, 
        opacity: 0, 
        scale: 0.9, 
        rotationX: 10,
        transformPerspective: 1000 
    });

    // Use ScrollTrigger Batch for a cascading domino-ripple effect as users scroll down
    ScrollTrigger.batch(bentoCards, {
        scroller: ".main-content", // Explicitly bind to the local scrolling container
        onEnter: (elements) => {
            gsap.to(elements, {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationX: 0,
                duration: 1.6,
                stagger: 0.15, 
                ease: "power3.out",
                overwrite: true
            });
            
            // Execute sequenced micro-animations for inner contents of each triggering card
            elements.forEach(el => {
                const header = el.querySelector('.bento-header');
                const title = el.querySelector('h3');
                const text = el.querySelector('p');
                const tags = el.querySelectorAll('.bento-tech span');
                const bg = el.querySelector('.bento-bg');
                
                if(bg) gsap.fromTo(bg, {scale: 1.15, opacity: 0}, {scale: 1, opacity: 1, duration: 1.8, ease: "power2.out"});
                if(header) gsap.fromTo(header, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 1.2, delay: 0.1, ease: "power3.out"});
                if(title) gsap.fromTo(title, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: "power3.out"});
                if(text) gsap.fromTo(text, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out"});
                
                // Playful Pop stagger for the tech stack tags
                if(tags && tags.length > 0) {
                    gsap.fromTo(tags, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.8, delay: 0.4, stagger: 0.05, ease: "back.out(1.2)"});
                }
            });
        },
        once: true // Trigger once for a solid layout lock-in
    });
}

// ============================================================
// Timeline Detail Cards - Elegant Staggered Inner Text Reveal
// ============================================================
const tlRows = document.querySelectorAll('.tl-entry');
tlRows.forEach(row => {
    const detailCard = row.querySelector('.tl-detail-card');
    if (!detailCard) return;

    // Grab all text blocks to stagger
    const textEls = detailCard.querySelectorAll('.tlc-section-label, li, .tlc-tags span');
    
    // Create a paused timeline
    const stgTl = gsap.timeline({ paused: true });
    
    // Quick pop up & fade
    stgTl.fromTo(textEls, 
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: "power2.out" }
    );

    let delayTimer;

    row.addEventListener('mouseenter', () => {
        // Only run stagger if desktop layout (where card expands sideways)
        if (window.innerWidth > 768) {
            clearTimeout(delayTimer);
            // Delay slightly so the CSS width expansion starts first
            delayTimer = setTimeout(() => {
                stgTl.restart(true);
            }, 100); 
        }
    });

    row.addEventListener('mouseleave', () => {
        clearTimeout(delayTimer);
        // Instantly reset so it's ready for the next hover
        stgTl.pause(0); 
    });
});

// ============================================================
// Research & Publications - Glassmorphic Overlay Logic
// ============================================================
const researchData = [
    {
      title: "Introduction to Unsupervised Learning in Bioinformatics",
      category: "Chapter Publication",
      link: "https://onlinelibrary.wiley.com/doi/10.1002/9781119785620.ch2",
      copy: "Unsupervised learning algorithmic techniques are applied in grouping the data depending upon similar attributes, most similar patterns, or relationships amongst the dataset points or values. These Machine learning models are also referred to as self-organizing models which operate on clustering technique. Distinct approaches are employed on every other algorithm in splitting up data into clusters.",
      img: "assets/research/book.jpg"
    },
    {
      title: "Reconstructing Noised Images of Fashion-MNIST Dataset Using Autoencoders",
      category: "Research",
      link: "https://www.researchgate.net/publication/377614001_Reconstructing_Noised_Images_of_Fashion-MNIST_Dataset_Using_Autoencoders",
      copy: "This study investigates the use of autoencoders for reconstructing noised images from the Fashion-MNIST dataset. By introducing noise to simulate real-world distortions, we evaluate both shallow and deep autoencoder architectures for image denoising. Performance is assessed using metrics like Mean Squared Error (MSE) and Structural Similarity Index (SSIM).",
      img: "assets/research/encoder.png"
    },
    {
      title: "Mudras and Yoga Positions Detection and Recognition using YOLOv7 and Faster R-CNN",
      category: "Conference Paper",
      link: "https://www.researchgate.net/publication/378120515_Mudras_and_Yoga_Positions_Detection_and_Recognition_using_YOLOv7_and_Faster_R-CNN",
      copy: "This paper explores the detection and recognition of mudras and yoga positions using advanced machine learning models, specifically YOLOv7 and Faster R-CNN. The study focuses on the application of these models to accurately identify and classify various hand gestures and body postures associated with yoga practices. The effectiveness of both models is evaluated and compared, highlighting their performance in terms of accuracy and speed.",
      img: "assets/research/cnn.jpg"
    }
];

const researchCards = document.querySelectorAll('.research-card');
const readerOverlay = document.querySelector('.research-reader-overlay');
const readerClose = document.querySelector('#reader-close');

if (readerOverlay && researchCards.length > 0) {
    const rTitle = document.querySelector('#reader-title');
    const rCategory = document.querySelector('#reader-category');
    const rImg = document.querySelector('#reader-img');
    const rCopy = document.querySelector('#reader-copy');
    const rLink = document.querySelector('#reader-link');

    // Dynamic Axis: x for desktop, y for mobile
    function getAxis() { return window.innerWidth <= 768 ? 'y' : 'x'; }

    // Init hidden state
    gsap.set(readerOverlay, { [getAxis()]: window.innerWidth <= 768 ? '100%' : '50px', opacity: 0 });

    const readerTl = gsap.timeline({ paused: true, 
        onReverseComplete: () => {
            readerOverlay.style.pointerEvents = 'none';
            researchCards.forEach(c => c.classList.remove('active'));
        }
    });

    readerTl.to(readerOverlay, {
        x: 0, y: 0, // Clears transform regardless of axis
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        onStart: () => { readerOverlay.style.pointerEvents = 'auto'; }
    });

    researchCards.forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            const data = researchData[index];
            
            // Populate
            rTitle.textContent = data.title;
            rCategory.textContent = data.category;
            rImg.src = data.img;
            rCopy.textContent = data.copy;
            rLink.href = data.link;

            // Highlight List item
            researchCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Setup fresh animation axis in case window resized
            const axis = getAxis();
            gsap.set(readerOverlay, { [axis]: readerTl.progress() === 0 ? (axis === 'y' ? '100%' : '50px') : 0 });
            
            readerTl.play();
        });
    });

    readerClose.addEventListener('click', () => {
        readerTl.reverse();
    });
}

// ============================================================
// JayGPT AI Assistant - Subtext Looping Animation (Breathing Effect)
// ============================================================
const jayGptDesc = document.querySelector('.card-description');
const topRow = document.querySelector('.card-top-row');
const triggerCard = document.querySelector('.jaygpt-trigger.card-variant');

if (jayGptDesc && topRow && triggerCard) {
    // Create an infinite looping GSAP timeline
    const loopTl = gsap.timeline({ repeat: -1 });
    
    // Hold visible state for 5 seconds
    loopTl.to(jayGptDesc, { duration: 5, opacity: 1, height: "auto", filter: "blur(0px)", marginTop: 10 });
    
    // 1. Graceful wipe out: Synchronously shrink text height, row margins, and container padding into a "pill"
    loopTl.to(jayGptDesc, { duration: 0.8, opacity: 0, height: 0, marginTop: 0, filter: "blur(5px)", ease: "power3.inOut" }, "shrink");
    loopTl.to(topRow, { duration: 0.8, marginBottom: 0, ease: "power3.inOut" }, "shrink");
    loopTl.to(triggerCard, { duration: 0.8, paddingBottom: 16, paddingTop: 16, ease: "power3.inOut" }, "shrink");
    
    // 2. Stay hidden as a minimal pill for 2 seconds for dramatic effect
    loopTl.to(jayGptDesc, { duration: 2, opacity: 0 });
    
    // 3. Smooth cinematic reappearance: expand container pad padding, push margins down, and reveal subtext
    loopTl.to(jayGptDesc, { duration: 1.2, opacity: 1, height: "auto", marginTop: 10, filter: "blur(0px)", ease: "back.out(1.2)" }, "expand");
    loopTl.to(topRow, { duration: 1.2, marginBottom: 12, ease: "power3.inOut" }, "expand");
    loopTl.to(triggerCard, { duration: 1.2, paddingBottom: 20, paddingTop: 20, ease: "power3.inOut" }, "expand");
}

// ============================================================
// Smart Navbar (Hide on Scroll Down, Show on Scroll Up)
// ============================================================
const mainContentWrapper = document.querySelector('.main-content');
const innerNav = document.querySelector('.inner-nav');

if (mainContentWrapper && innerNav) {
    let lastScrollY = mainContentWrapper.scrollTop;
    
    mainContentWrapper.addEventListener('scroll', () => {
        const currentScrollY = mainContentWrapper.scrollTop;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Threshold check to avoid jittery movements on trackpads
        if (Math.abs(scrollDelta) > 5) {
            // If scrolling down AND past the top buffer region
            if (currentScrollY > 150 && scrollDelta > 0) {
                // Smoothly hide navbar upwards
                gsap.to(innerNav, {
                    y: -100, 
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: "auto"
                });
            } else if (scrollDelta < 0) {
                // Smoothly reveal navbar downwards when scrolling backwards
                gsap.to(innerNav, {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: "auto"
                });
            }
            lastScrollY = currentScrollY;
        }
        
        // absolute fail-safe: if near the very top, ALWAYS show the navbar
        if (currentScrollY <= 50) {
             gsap.to(innerNav, {
                y: 0,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: "auto"
            });
        }
    });
}

// ============================================================
// Global Section Typography Animations
// ============================================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Apply hyper-premium cinematic text reveal to all section headings and descriptions
    const sectionTexts = document.querySelectorAll('.edu-main-heading, .edu-subheading, .research-hint, .apple-heading, .services-content-left h2, .special-dummy-text');
    if (sectionTexts.length > 0) {
        // Initial state: Gently pushed down for a smooth float upward
        gsap.set(sectionTexts, { 
            y: 35, 
            opacity: 0
        });

        ScrollTrigger.batch(sectionTexts, {
            scroller: ".main-content",
            start: "top 85%", // Trigger slightly earlier for a fluid lead-in
            onEnter: (elements) => {
                gsap.to(elements, {
                    y: 0,
                    opacity: 1,
                    duration: 1.4,
                    stagger: 0.2, // Increased stagger for distinct, unhurried paragraph reveals
                    ease: "power3.out",
                    overwrite: true
                });
            },
            once: true
        });
    }

// ============================================================
// Premium Footer GSAP Interactions
// ============================================================
    const footer = document.querySelector('.premium-footer');
    if (footer) {
        // Animate top columns staggering up gracefully
        gsap.fromTo(".pf-col", 
            { opacity: 0, y: 50 },
            { 
                scrollTrigger: {
                    trigger: ".premium-footer",
                    start: "top 80%",
                    scroller: document.querySelector('.main-content')
                },
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.15, 
                ease: "power3.out" 
            }
        );

        // Animate massive text slices flying up violently from the bottom
        gsap.to(".pf-massive-text span", {
            scrollTrigger: {
                trigger: ".premium-footer",
                start: "top 60%",
                scroller: document.querySelector('.main-content')
            },
            y: "0%",
            duration: 1.2,
            stagger: 0.08,
            ease: "power4.out"
        });

        // Magnetic button logic for Action blocks
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Extremely subtle button skew/slide
                gsap.to(btn, {
                    x: x * 0.1,
                    y: y * 0.1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                // Snap back to strictly aligned layout
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });

        // Update footer time dynamically using locale String
        const PFClock = document.getElementById('pf-clock');
        if(PFClock) {
            setInterval(() => {
                const now = new Date();
                PFClock.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }, 1000);
        }
    }
    }


// ============================================================
// Hero Area Resume Download Widget Animation
// ============================================================
const downloadBtn = document.getElementById('resume-download-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        // Prevent multiple clicks from breaking the animation pipeline
        if(downloadBtn.classList.contains('is-downloading')) return;
        downloadBtn.classList.add('is-downloading');

        const tl = gsap.timeline();
        const btnContent = downloadBtn.querySelector('.btn-content');
        const loaderRing = downloadBtn.querySelector('.btn-loader-ring');
        const ringPath = downloadBtn.querySelector('.ring-path');
        const btnSuccess = downloadBtn.querySelector('.btn-success');
        const hiddenTrigger = document.getElementById('hidden-resume-trigger');

        // Step 1: Hide internal text and geometrically collapse pill into a circle
        tl.to(btnContent, { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power2.inOut' })
          .to(downloadBtn, { width: '48px', duration: 0.4, ease: 'back.in(1.2)' }, "-=0.2")
          
        // Step 2: Unhide neon loader ring and animate the geometric SVG dashoffset 
          .set(loaderRing, { opacity: 1 })
          .to(ringPath, { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' })
          
        // Step 3: Hide loader ring, dramatically elastic-POP the positive checkmark overlay
          .set(loaderRing, { opacity: 0 })
          .to(btnSuccess, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' })
          
        // Step 4: Fire the physical browser download interface silently
          .call(() => {
              if(hiddenTrigger) hiddenTrigger.click();
          })

        // Step 5: Preserve success visual, then organically revert the entire physical state
          .to(btnSuccess, { opacity: 0, scale: 0, duration: 0.3, delay: 2.5 })
          .to(downloadBtn, { width: '100%', duration: 0.4, ease: 'power2.out' })
          .to(btnContent, { opacity: 1, scale: 1, duration: 0.3 }, "-=0.2")
          .call(() => {
              downloadBtn.classList.remove('is-downloading');
              // Reset ring path logic for subsequent interactions
              gsap.set(ringPath, { strokeDashoffset: 125.6 });
          });
    });
}

// ============================================================
// Zero Gravity Certifications Wall Engine
// ============================================================
const certContainer = document.getElementById('cert-container');
const focusBtn = document.getElementById('cert-focus-btn');
const certLightbox = document.getElementById('cert-lightbox');
const certLightboxCloseBtn = document.getElementById('cert-lightbox-close');
const certLightboxBg = document.getElementById('cert-lightbox-close-bg');
const certLightboxImg = document.getElementById('cert-lightbox-img');

if (certContainer && typeof gsap !== 'undefined') {
    // Gather all valid variations explicitly across the 3 sub-directories
    const allCertFiles = [
        ...[1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(i => `jpgs/img${i}.jpg`),
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `png/img${i}.png`),
        ...[13, 14, 15, 16, 17, 18, 19, 20, 21].map(i => `png_additional/img${i}.png`)
    ];
    
    let certTweens = [];
    let isGridMode = false;

    // Inject Image DOM Nodes dynamically
    allCertFiles.forEach(subPath => {
        const img = document.createElement('img');
        // Bound directly to the root assets relative path to ensure clean staging
        img.src = `assets/scrible/${subPath}`;
        img.className = 'cert-item';
        
        // Random Initial Scatter mapped cleanly to interior bounds avoiding hard edges
        const startX = Math.random() * 84 + 2; // 2% to 86% width
        const startY = Math.random() * 84 + 2; // 2% to 86% height
        const rotation = (Math.random() - 0.5) * 40; // Slight starting rotation angle
        
        gsap.set(img, { left: `${startX}%`, top: `${startY}%`, rotation: rotation });
        
        certContainer.appendChild(img);

        // Advanced Floating Sine-Wave Zero-Gravity Animation Matrix
        const floatAnim = gsap.to(img, {
            x: `random(-120, 120)`, // gentle drifting
            y: `random(-120, 120)`,
            rotation: `random(-20, 20)`,
            duration: `random(12, 25)`,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            overwrite: "auto"
        });
        
        certTweens.push({ el: img, tween: floatAnim });

        // Click to Focus / Expand
        img.addEventListener('click', () => {
            certLightboxImg.src = img.src;
            certLightbox.classList.remove('hidden-trigger');
        });
    });

    // Close Lightbox Triggers
    const closeLightbox = () => {
        certLightbox.classList.add('hidden-trigger');
        setTimeout(() => certLightboxImg.src = '', 400); // clear src after fadeout
    };
    if(certLightboxCloseBtn) certLightboxCloseBtn.addEventListener('click', closeLightbox);
    if(certLightboxBg) certLightboxBg.addEventListener('click', closeLightbox);

    // Swap to Grid 'Snap' Mode
    if (focusBtn) {
        focusBtn.addEventListener('click', () => {
            isGridMode = !isGridMode;
            
            if (isGridMode) {
                // Morph to Grid
                focusBtn.querySelector('.btn-text').textContent = "Float View";
                certContainer.classList.add('grid-mode');
                
                certTweens.forEach(({ el, tween }) => {
                    tween.pause();
                    el.classList.add('in-grid');
                    // Reset styling conflict dynamically
                    gsap.set(el, { clearProps: "all" }); 
                });
            } else {
                // Morph back to Zero Gravity Wall
                focusBtn.querySelector('.btn-text').textContent = "Grid View";
                certContainer.classList.remove('grid-mode');
                
                certTweens.forEach(({ el }, i) => {
                    el.classList.remove('in-grid');
                    
                    const startX = Math.random() * 84 + 2; 
                    const startY = Math.random() * 84 + 2; 
                    gsap.set(el, { left: `${startX}%`, top: `${startY}%`, x: 0, y: 0 });

                    // Reconstruct float sequence seamlessly
                    const newAnim = gsap.to(el, {
                        x: `random(-120, 120)`,
                        y: `random(-120, 120)`,
                        rotation: `random(-20, 20)`,
                        duration: `random(12, 25)`,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                        overwrite: "auto"
                    });
                    certTweens[i].tween = newAnim;
                });
            }
        });
    }
}

// ============================================================
// Mobile Hamburger Menu Logic
// ============================================================
const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
const navLinksMenu = document.getElementById('nav-links-menu');

if (mobileMenuTrigger && navLinksMenu) {
    // Toggle Menu
    mobileMenuTrigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from immediately closing
        navLinksMenu.classList.toggle('active-mobile-menu');
    });

    // Close Menu on Link Clicking
    const navLinksList = navLinksMenu.querySelectorAll('a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navLinksMenu.classList.remove('active-mobile-menu');
        });
    });

    // Close Menu on clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinksMenu.contains(e.target) && !mobileMenuTrigger.contains(e.target)) {
            navLinksMenu.classList.remove('active-mobile-menu');
        }
    });
}

// ============================================================
// Cinematic Preloader Engine (Copied from GitOri)
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
    const counter3 = document.querySelector(".counter-3");
    if (counter3) {
        // Construct DOM nodes for the digits
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 10; j++) {
                const div = document.createElement("div");
                div.className = "num";
                div.textContent = j;
                counter3.appendChild(div);
            }
        }
        const finalDiv = document.createElement("div");
        finalDiv.className = "num";
        finalDiv.textContent = "0";
        counter3.appendChild(finalDiv);

        function animate(counter, duration, delay = 0) {
            // Wait a brief tick to ensure DOM paints and heights are valid
            setTimeout(() => {
                const numHeight = counter.querySelector(".num").clientHeight || 102; 
                const totalDistance = (counter.querySelectorAll(".num").length - 1) * numHeight;

                gsap.to(counter, {
                    y: -totalDistance,
                    duration: duration,
                    delay: delay,
                    ease: "power2.inOut",
                });
            }, 50);
        }

        animate(counter3, 3);
        animate(document.querySelector(".counter-2"), 4);
        animate(document.querySelector(".counter-1"), 1, 3);

        gsap.to(".digit", {
            top: "-150px",
            stagger: { amount: 0.25 },
            delay: 4,
            duration: 1,
            ease: "power4.inOut"
        });

        gsap.from(".loader-1", { width: 0, duration: 4, ease: "power2.inOut" });
        gsap.from(".loader-2", { width: 0, duration: 4, delay: 1, ease: "power2.inOut" });
        
        gsap.to(".loader", { background: "none", delay: 2, duration: 0.1 });
  
        gsap.to(".loader-1", { rotate: 90, y: -50, duration: 0.5, delay: 4 });
        gsap.to(".loader-2", { x: -75, y: 75, duration: 0.5 }, "<");
  
        gsap.to(".loader", { scale: 40, duration: 1, delay: 5, ease: "power2.inOut" });
        gsap.to(".loader", { rotate: 45, y: 500, x: 2000, duration: 1, delay: 5, ease: "power2.inOut" });
  
        gsap.to(".loading-screen", {
            opacity: 0,
            duration: 0.5,
            delay: 5.5,
            ease: "power1.inOut",
            onComplete: () => {
                document.querySelector(".loading-screen").style.display = 'none';
            }
        });
    }
});
