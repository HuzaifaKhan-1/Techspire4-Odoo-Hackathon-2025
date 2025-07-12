
// Global variables
let currentTheme = 'light';
let navbar = null;
let loadingScreen = null;
let navMenu = null;


// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all elements
    initializeElements();
    
    // Initialize features
    initializeLoadingScreen();
    initializeNavigation();
    initializeTheme();
    initializeScrollEffects();
    initializeAnimations();
    initializeFilters();
    initializeForms();
    initializeCounters();
    initializeGallery();
});

// Initialize all DOM elements
function initializeElements() {
    navbar = document.getElementById('navbar');
    loadingScreen = document.getElementById('loadingScreen');
    navMenu = document.getElementById('navMenu');
}

// Loading Screen Animation
function initializeLoadingScreen() {
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 2000);
    }
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Theme toggle functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', currentTheme);
            
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Animation on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-card, .clothing-item, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Filter functionality
function initializeFilters() {
    const genderTabs = document.querySelectorAll('.gender-tab');
    const filterSelects = document.querySelectorAll('.filter-select, .price-input');
    const resetButton = document.getElementById('resetFilters');
    const clothingItems = document.querySelectorAll('.clothing-item');
    
    // Gender tab filtering
    genderTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            genderTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterItems();
        });
    });
    
    // Filter change events
    filterSelects.forEach(filter => {
        filter.addEventListener('change', filterItems);
        filter.addEventListener('input', filterItems);
    });
    
    // Reset filters
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            filterSelects.forEach(filter => {
                filter.value = '';
            });
            genderTabs.forEach(t => t.classList.remove('active'));
            genderTabs[0].classList.add('active');
            filterItems();
        });
    }
    
    function filterItems() {
        const activeGender = document.querySelector('.gender-tab.active')?.dataset.gender || 'all';
        const category = document.getElementById('categoryFilter')?.value || '';
        const size = document.getElementById('sizeFilter')?.value || '';
        const condition = document.getElementById('conditionFilter')?.value || '';
        const color = document.getElementById('colorFilter')?.value || '';
        const minPoints = parseInt(document.getElementById('minPoints')?.value) || 0;
        const maxPoints = parseInt(document.getElementById('maxPoints')?.value) || 999;
        
        let visibleCount = 0;
        
        clothingItems.forEach(item => {
            const itemGender = item.dataset.gender;
            const itemCategory = item.dataset.category;
            const itemSize = item.dataset.size;
            const itemCondition = item.dataset.condition;
            const itemColor = item.dataset.color;
            const itemPoints = parseInt(item.dataset.points) || 0;
            
            const genderMatch = activeGender === 'all' || itemGender === activeGender;
            const categoryMatch = !category || itemCategory === category;
            const sizeMatch = !size || itemSize === size;
            const conditionMatch = !condition || itemCondition === condition;
            const colorMatch = !color || itemColor === color;
            const pointsMatch = itemPoints >= minPoints && itemPoints <= maxPoints;
            
            if (genderMatch && categoryMatch && sizeMatch && conditionMatch && colorMatch && pointsMatch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update results count
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = visibleCount;
        }
    }
}

// Form handling
function initializeForms() {
    const uploadForm = document.getElementById('uploadForm');
    const contactForm = document.getElementById('contactForm');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('itemImage');
    
    // Upload form
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Item uploaded successfully! You earned 50 points.');
            uploadForm.reset();
            hideImagePreview();
        });
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message sent successfully! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }
    
    // File upload
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--primary-color)';
        });
        
        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.style.borderColor = 'var(--glass-border)';
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--glass-border)';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }
    
    // Add proper null checks for remove button
    const removeImageBtn = document.getElementById('removeImage');
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', hideImagePreview);
    }
    
    function handleFileSelect(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                showImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
    
    function showImagePreview(src) {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        const placeholder = document.querySelector('.upload-placeholder');
        const removeBtn = document.getElementById('removeImage');
        
        if (preview && previewImg && placeholder) {
            previewImg.src = src;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            
            if (removeBtn) {
                removeBtn.addEventListener('click', hideImagePreview);
            }
        }
    }
    
    function hideImagePreview() {
        const preview = document.getElementById('imagePreview');
        const placeholder = document.querySelector('.upload-placeholder');
        const fileInput = document.getElementById('itemImage');
        
        if (preview && placeholder && fileInput) {
            preview.style.display = 'none';
            placeholder.style.display = 'flex';
            fileInput.value = '';
        }
    }
}

// Counter animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    }
}

// Gallery functionality
function initializeGallery() {
    const galleryTrack = document.getElementById('galleryTrack');
    if (galleryTrack) {
        // Duplicate gallery items for seamless loop
        const items = galleryTrack.innerHTML;
        galleryTrack.innerHTML = items + items;
    }
    
    // Initialize clothes carousel background
    initializeClothesCarousel();
}

// Clothes carousel background functionality
function initializeClothesCarousel() {
    const topCarousel = document.querySelector('.clothes-carousel-top');
    const bottomCarousel = document.querySelector('.clothes-carousel-bottom');
    
    if (topCarousel) {
        // Duplicate items for seamless scrolling
        const topItems = topCarousel.innerHTML;
        topCarousel.innerHTML = topItems + topItems + topItems;
    }
    
    if (bottomCarousel) {
        // Duplicate items for seamless scrolling
        const bottomItems = bottomCarousel.innerHTML;
        bottomCarousel.innerHTML = bottomItems + bottomItems + bottomItems;
    }
    
    // Add hover effects to clothes items
    const clothesItems = document.querySelectorAll('.clothes-item-bg');
    clothesItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.1) rotate(5deg)';
            item.style.filter = 'blur(1px)';
            item.style.opacity = '0.8';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1) rotate(0deg)';
            item.style.filter = 'blur(3px)';
            item.style.opacity = '0.4';
        });
    });
}

// Hero button functionality
document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('uploadBtn');
    const browseBtn = document.getElementById('browseBtn');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            document.getElementById('upload').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Wishlist functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.item-wishlist')) {
        const wishlistBtn = e.target.closest('.item-wishlist');
        const icon = wishlistBtn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            wishlistBtn.classList.add('active');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            wishlistBtn.classList.remove('active');
        }
    }
});

// Global error handling
window.addEventListener('error', function(e) {
    console.log('Global error caught:', e.error);
});

// Service worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
