document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------
    // 1. Floating Navigation Bar
    // ----------------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ----------------------------
    // 2. Dark / Light Mode Toggle
    // ----------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // ----------------------------
    // 3. Hamburger Menu Toggle
    // ----------------------------
    const hamburger = document.getElementById('hamburger');
    const navMenu  = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ----------------------------
    // 4. Animated Hero Slideshow
    // ----------------------------
    const slides      = document.querySelectorAll('.hero-slide');
    const thumbs      = document.querySelectorAll('.thumb');
    const progressBar = document.getElementById('heroProgressBar');
    const blob        = document.getElementById('heroBlob');
    const DURATION    = 5000; // ms per slide

    if (!slides.length) return;

    let current   = 0;
    let timer     = null;
    let progTimer = null;

    // Parallax blob on mouse move
    if (blob) {
        document.querySelector('.hero')?.addEventListener('mousemove', e => {
            const rx = (e.clientX / window.innerWidth  - 0.5) * 30;
            const ry = (e.clientY / window.innerHeight - 0.5) * 20;
            blob.style.transform = `translate(${rx}px, ${ry}px)`;
        });
    }

    function goTo(index) {
        const prev = current;
        current = (index + slides.length) % slides.length;

        // Add exit class to old slide
        slides[prev].classList.add('exit');
        slides[prev].classList.remove('active');
        thumbs[prev]?.classList.remove('active');

        // Small delay before removing exit (matches CSS transition)
        setTimeout(() => slides[prev].classList.remove('exit'), 950);

        // Activate new slide
        slides[current].classList.add('active');
        thumbs[current]?.classList.add('active');

        startProgress();
    }

    function startProgress() {
        clearInterval(progTimer);
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            // Force reflow
            void progressBar.offsetWidth;
            progressBar.style.transition = `width ${DURATION}ms linear`;
            progressBar.style.width = '100%';
        }
    }

    function startAutoplay() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), DURATION);
    }

    // Thumb clicks
    thumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => {
            if (i === current) return;
            clearInterval(timer);
            goTo(i);
            startAutoplay();
        });
    });

    // Init
    startProgress();
    startAutoplay();

    // ----------------------------
    // 6. Fullscreen Dish Lightbox
    // ----------------------------
    const dishes = [
        { img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop', name: 'Masala Dosa' },
        { img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&auto=format&fit=crop',  name: 'Chettinad Chicken Curry' },
        { img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&auto=format&fit=crop',  name: 'Kerala Fish Curry' },
        { img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop',  name: 'Hyderabadi Biryani' },
        { img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop',  name: 'Idli Sambar' },
        { img: 'https://images.unsplash.com/photo-1606491048802-8342506d6471?w=1200&auto=format&fit=crop',  name: 'Medu Vada' },
    ];

    const lightbox  = document.getElementById('dish-lightbox');
    const lbMainImg = document.getElementById('lbMainImg');
    const lbTitle   = document.getElementById('lbTitle');
    const lbThumbs  = document.getElementById('lbThumbs');
    const lbClose   = document.getElementById('lbClose');

    if (lightbox) {
        // Build thumbnail strip
        dishes.forEach((d, i) => {
            const btn = document.createElement('button');
            btn.className = 'lb-thumb';
            btn.dataset.index = i;
            btn.innerHTML = `<img src="${d.img.replace('w=1200','w=200')}" alt="${d.name}">`;
            btn.addEventListener('click', () => openLightbox(i));
            lbThumbs.appendChild(btn);
        });

        function openLightbox(index) {
            setActive(index);
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function setActive(index) {
            const d = dishes[index];
            // Fade out → swap → fade in
            lbMainImg.style.opacity = '0';
            setTimeout(() => {
                lbMainImg.src = d.img;
                lbTitle.textContent = d.name;
                lbMainImg.style.opacity = '1';
            }, 200);

            lbThumbs.querySelectorAll('.lb-thumb').forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });

            // Scroll active thumb into view
            const activeThumb = lbThumbs.children[index];
            if (activeThumb) activeThumb.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        }

        // Open on dish card click
        document.querySelectorAll('.dish-card').forEach(card => {
            card.addEventListener('click', () => {
                openLightbox(parseInt(card.dataset.index) || 0);
            });
        });

        // Close handlers
        lbClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

        // Swipe to change dish on mobile
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                const currentIndex = [...lbThumbs.querySelectorAll('.lb-thumb')].findIndex(t => t.classList.contains('active'));
                const next = diff > 0
                    ? (currentIndex + 1) % dishes.length
                    : (currentIndex - 1 + dishes.length) % dishes.length;
                setActive(next);
            }
        }, { passive: true });
    }


    // ----------------------------
    const modal = document.getElementById('item-modal');
    if (modal) {
        const modalTriggers = document.querySelectorAll('.modal-trigger');
        const closeBtn      = document.querySelector('.close-btn');
        const modalImg      = document.getElementById('modal-img');
        const modalTitle    = document.getElementById('modal-title');
        const modalDesc     = document.getElementById('modal-desc');
        const modalPrice    = document.getElementById('modal-price');

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const item = trigger.closest('.menu-item');
                modalImg.src         = item.dataset.img;
                modalTitle.textContent = item.dataset.title;
                modalDesc.textContent  = item.dataset.desc;
                modalPrice.textContent = item.dataset.price;
                modal.style.display  = 'block';
            });
        });

        const closeModal = () => { modal.style.display = 'none'; };
        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    }

});
