document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------
    // 1. Floating Navigation Bar
    // ----------------------------
    const navbar = document.getElementById('navbar');

    // Add 'scrolled' class to navbar when user scrolls down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // 50px from the top
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ----------------------------
    // 2. Dark/Light Mode Toggle
    // ----------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme in localStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Save theme preference to localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // ----------------------------
    // 3. Menu Item Modal
    // ----------------------------
    const modal = document.getElementById('item-modal');
    if (modal) { // Check if we are on a page with the modal
        const modalTriggers = document.querySelectorAll('.modal-trigger');
        const closeBtn = document.querySelector('.close-btn');

        // Get elements inside the modal to update them
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalPrice = document.getElementById('modal-price');

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const menuItem = trigger.closest('.menu-item');
                
                // Get data from the parent menu-item's data attributes
                const title = menuItem.dataset.title;
                const img = menuItem.dataset.img;
                const desc = menuItem.dataset.desc;
                const price = menuItem.dataset.price;

                // Populate the modal with the data
                modalImg.src = img;
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                modalPrice.textContent = price;

                // Show the modal
                modal.style.display = 'block';
            });
        });

        // Function to close the modal
        const closeModal = () => {
            modal.style.display = 'none';
        };

        // Close modal events
        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                closeModal();
            }
        });
    }

});