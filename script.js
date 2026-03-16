// Initialize Swiper Slider
const isMobileDevice = window.innerWidth <= 768;

const heroSwiper = new Swiper('.heroSwiper', {
    loop: true,
    speed: 800,
    effect: 'slide',
    autoplay: isMobileDevice ? {
        delay: 8000, // Slower on mobile to save battery
        disableOnInteraction: true, // Stop when user interacts
    } : {
        delay: 5000, // Normal speed on desktop
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    keyboard: {
        enabled: true,
    },
});

// ===== HAMBURGER MENU TOGGLE =====
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navLinks = document.getElementById('navLinks');

if (hamburgerMenu && navLinks) {
    // Toggle menu on hamburger click
    hamburgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close menu when clicking a nav link
    const navLinkItems = navLinks.querySelectorAll('a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== TEAM CAROUSEL =====
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const teamCards = document.querySelectorAll('.team-card');
const modal = document.getElementById('cardModal');
const modalOverlay = document.querySelector('.modal-overlay');
const closeBtn = document.querySelector('.close-btn');

if (carouselTrack && prevBtn && nextBtn) {
    const scrollAmount = 304;

    prevBtn.addEventListener('click', () => {
        carouselTrack.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        carouselTrack.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Only enable 3D hover effect on desktop (resource-intensive)
    const isMobile = window.innerWidth <= 768;
    
    teamCards.forEach(card => {
        // Desktop-only: 3D tilt effect
        if (!isMobile) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `translateY(-10px) scale(1.05) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        }

        // Click to open modal (works on all devices)
        card.addEventListener('click', () => {
            const memberData = card.getAttribute('data-member');
            openModal(memberData);
        });
    });
}

// Modal Functions
function openModal(memberData) {
    const card = document.querySelector(`.team-card[data-member="${memberData}"]`);
    const descriptionElement = document.querySelector(`[data-member="${memberData}"][data-description]`);
    
    if (!card || !modal) return;

    const photo = card.querySelector('.member-photo').textContent;
    const name = card.querySelector('h3').textContent;
    const role = card.querySelector('.role').textContent;
    const description = descriptionElement ? descriptionElement.getAttribute('data-description') : '';
    
    const socialLinks = card.querySelectorAll('.social-icons a');
    
    const modalPhoto = modal.querySelector('.modal-photo');
    const modalName = modal.querySelector('.modal-name');
    const modalRole = modal.querySelector('.modal-role');
    const modalDescription = modal.querySelector('.modal-description');
    const modalSocial = modal.querySelector('.modal-social');
    
    if (modalPhoto) modalPhoto.textContent = photo;
    if (modalName) modalName.textContent = name;
    if (modalRole) modalRole.textContent = role;
    if (modalDescription) modalDescription.textContent = description;
    
    if (modalSocial) {
        modalSocial.innerHTML = '';
        socialLinks.forEach(link => {
            const clone = link.cloneNode(true);
            modalSocial.appendChild(clone);
        });
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
    }
});

// Generate animated particles (optimized for mobile)
const particlesContainer = document.getElementById('particles');

// Reduce particles on mobile to save battery
const isMobile = window.innerWidth <= 768;
const particleCount = isMobile ? 0 : 25; // 0 on mobile, 25 on desktop (was 50)

if (particlesContainer) {
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 150 + 50; // Smaller particles
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = Math.random() * 20 + 10 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .feature-card, .service-card, .stat-item, .cta-box').forEach(el => {
    observer.observe(el);
});

// Smooth scrolling for navigation links
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

// Animated counter for stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toString().includes('.') ? target : target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (target.toString().includes('+') ? '+' : '');
        }
    }, 20);
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const numberElement = entry.target.querySelector('.stat-number');
            const text = numberElement.textContent;
            let targetNumber;
            
            if (text.includes('M+')) {
                targetNumber = '1M+';
                numberElement.textContent = targetNumber;
            } else if (text.includes('%')) {
                targetNumber = '99.9%';
                numberElement.textContent = targetNumber;
            } else if (text.includes('24/7')) {
                numberElement.textContent = '24/7';
            } else {
                targetNumber = '500+';
                numberElement.textContent = targetNumber;
            }
            
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});