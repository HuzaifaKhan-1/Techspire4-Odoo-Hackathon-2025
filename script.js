// Global variables
let currentTheme = 'light';
let navbar = null;
let loadingScreen = null;
let navMenu = null;
let currentUser = null;
let currentStep = 1;
let uploadedImages = [];
let currentImageIndex = 0;
let selectedImages = [];

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
    initializeAuth();
    initializeDashboard();
    initializeItemDetail();
    initializeAddItem();
    initializeAdmin();
    
    // Check authentication status
    checkAuthStatus();
    
    // Load page-specific functionality
    initializePageSpecific();
    
    // Initialize scroll animations
    initializeScrollAnimations();
});

// Initialize all DOM elements
function initializeElements() {
    navbar = document.getElementById('navbar');
    loadingScreen = document.getElementById('loadingScreen');
    navMenu = document.getElementById('navMenu');
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
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
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
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterItems, 300));
    }
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', filterItems);
    }
    
    // Reset filters
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            filterSelects.forEach(filter => {
                filter.value = '';
            });
            if (searchInput) searchInput.value = '';
            if (sortSelect) sortSelect.value = 'newest';
            genderTabs.forEach(t => t.classList.remove('active'));
            if (genderTabs[0]) genderTabs[0].classList.add('active');
            filterItems();
        });
    }
    
    // Initial filter
    if (window.location.pathname.includes('browse.html')) {
        setTimeout(filterItems, 100);
    }
}

// Filter items function
function filterItems() {
    const itemsGrid = document.getElementById('itemsGrid');
    if (!itemsGrid) return;
    
    const activeGender = document.querySelector('.gender-tab.active')?.dataset.gender || 'all';
    const category = document.getElementById('categoryFilter')?.value || '';
    const size = document.getElementById('sizeFilter')?.value || '';
    const condition = document.getElementById('conditionFilter')?.value || '';
    const color = document.getElementById('colorFilter')?.value || '';
    const minPoints = parseInt(document.getElementById('minPoints')?.value) || 0;
    const maxPoints = parseInt(document.getElementById('maxPoints')?.value) || 999;
    const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const sortBy = document.getElementById('sortSelect')?.value || 'newest';
    
    // Get items from data
    let items = getAllItems().filter(item => item.status === 'approved');
    
    // Apply filters
    items = items.filter(item => {
        const genderMatch = activeGender === 'all' || item.gender === activeGender;
        const categoryMatch = !category || item.category === category;
        const sizeMatch = !size || item.size === size;
        const conditionMatch = !condition || item.condition === condition;
        const colorMatch = !color || item.color === color;
        const pointsMatch = item.points >= minPoints && item.points <= maxPoints;
        const searchMatch = !searchTerm || 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.brand.toLowerCase().includes(searchTerm) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        return genderMatch && categoryMatch && sizeMatch && conditionMatch && 
               colorMatch && pointsMatch && searchMatch;
    });
    
    // Apply sorting
    items.sort((a, b) => {
        switch (sortBy) {
            case 'points-low':
                return a.points - b.points;
            case 'points-high':
                return b.points - a.points;
            case 'popular':
                return (b.views || 0) - (a.views || 0);
            case 'newest':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
    
    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = items.length;
    }
    
    // Render items
    renderItems(items, itemsGrid);
}

// Render items to grid
function renderItems(items, container) {
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No items found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="clothing-item" onclick="window.location.href='item-detail.html?id=${item.id}'"
             data-gender="${item.gender}" 
             data-category="${item.category}"
             data-size="${item.size}"
             data-condition="${item.condition}"
             data-color="${item.color}"
             data-points="${item.points}">
            <div class="item-image">
                <img src="${item.images[0]}" alt="${item.title}" loading="lazy">
                <div class="item-overlay">
                    <button class="quick-view-btn" onclick="event.stopPropagation(); quickViewItem('${item.id}')">
                        Quick View
                    </button>
                </div>
            </div>
            <div class="item-details">
                <h4>${item.title}</h4>
                <p class="item-category">${item.category} • ${item.brand}</p>
                <div class="item-meta">
                    <span class="points">${item.points} pts</span>
                    <span class="size">Size ${item.size}</span>
                </div>
                <div class="condition ${item.condition}">${item.condition}</div>
            </div>
        </div>
    `).join('');
}

// Form handling
function initializeForms() {
    const uploadForm = document.getElementById('uploadForm');
    const contactForm = document.getElementById('contactForm');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const addItemForm = document.getElementById('addItemForm');
    
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Add item form
    if (addItemForm) {
        addItemForm.addEventListener('submit', handleAddItem);
    }
    
    // Upload form (legacy)
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Item uploaded successfully! You earned 50 points.', 'success');
            uploadForm.reset();
        });
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

// Authentication functions
function initializeAuth() {
    // Check if user is already logged in
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    updateAuthUI();
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate inputs
    if (!email || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Check credentials
    const user = getUserByEmail(email);
    if (!user || user.password !== password) {
        showNotification('Invalid email or password', 'error');
        return;
    }
    
    // Set current user
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    if (remember) {
        localStorage.setItem('rememberUser', 'true');
    }
    
    showNotification('Login successful!', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const location = formData.get('location') || '';
    const terms = formData.get('terms');
    const newsletter = formData.get('newsletter');
    
    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    // Check if user already exists
    if (getUserByEmail(email)) {
        showNotification('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = createUser({
        firstName,
        lastName,
        email,
        password,
        location,
        newsletter: !!newsletter
    });
    
    // Set current user
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showNotification('Account created successfully!', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    showNotification('Logged out successfully', 'success');
    window.location.href = 'index.html';
}

function checkAuthStatus() {
    const protectedPages = ['dashboard.html', 'add-item.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    updateAuthUI();
}

function updateAuthUI() {
    const userMenu = document.getElementById('userMenu');
    const userMenuLoggedIn = document.getElementById('userMenuLoggedIn');
    
    if (currentUser) {
        if (userMenu) userMenu.style.display = 'none';
        if (userMenuLoggedIn) {
            userMenuLoggedIn.style.display = 'block';
            const avatar = userMenuLoggedIn.querySelector('.user-avatar img');
            if (avatar) avatar.src = currentUser.avatar;
        }
    } else {
        if (userMenu) userMenu.style.display = 'flex';
        if (userMenuLoggedIn) userMenuLoggedIn.style.display = 'none';
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
}

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
        const topItems = topCarousel.innerHTML;
        topCarousel.innerHTML = topItems + topItems + topItems;
    }
    
    if (bottomCarousel) {
        const bottomItems = bottomCarousel.innerHTML;
        bottomCarousel.innerHTML = bottomItems + bottomItems + bottomItems;
    }
}

// Dashboard functionality
function initializeDashboard() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'dashboard.html') return;
    
    // Initialize dashboard tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadUserItems(tab);
        });
    });
    
    // Load initial data
    loadDashboardData();
}

function loadDashboardData() {
    if (!currentUser) return;
    
    // Load user stats
    updateUserStats();
    
    // Load user items
    loadUserItems('active');
    
    // Load recent activity
    loadRecentActivity();
    
    // Load swap requests
    loadSwapRequests();
}

function updateUserStats() {
    const userItems = getUserItems(currentUser.id);
    const userSwaps = getUserSwaps(currentUser.id);
    
    // Update stat cards
    const pointsElement = document.querySelector('.stat-card h3');
    if (pointsElement) pointsElement.textContent = currentUser.points || 250;
    
    const itemsElement = document.querySelectorAll('.stat-card h3')[1];
    if (itemsElement) itemsElement.textContent = userItems.length;
    
    const swapsElement = document.querySelectorAll('.stat-card h3')[2];
    if (swapsElement) swapsElement.textContent = userSwaps.length;
}

function loadUserItems(status = 'active') {
    const itemsList = document.getElementById('myItemsList');
    if (!itemsList || !currentUser) return;
    
    const userItems = getUserItems(currentUser.id);
    const filteredItems = userItems.filter(item => {
        switch (status) {
            case 'active':
                return item.status === 'approved' && item.available;
            case 'pending':
                return item.status === 'pending';
            case 'sold':
                return !item.available;
            default:
                return true;
        }
    });
    
    if (filteredItems.length === 0) {
        itemsList.innerHTML = '<p class="empty-state">No items found</p>';
        return;
    }
    
    itemsList.innerHTML = filteredItems.map(item => `
        <div class="item-row">
            <img src="${item.images[0]}" alt="${item.title}">
            <div class="item-info">
                <h4>${item.title}</h4>
                <p>${item.category} • Size ${item.size} • ${item.points} points</p>
                <span class="status ${item.status}">${getStatusText(item)}</span>
            </div>
            <div class="item-actions">
                <button class="btn btn-outline btn-sm" onclick="editItem('${item.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="removeItem('${item.id}')">Remove</button>
            </div>
        </div>
    `).join('');
}

function getStatusText(item) {
    if (item.status === 'pending') return 'Pending Approval';
    if (!item.available) return 'Swapped';
    return 'Available';
}

function loadRecentActivity() {
    // Mock recent activity data
    const activities = [
        {
            type: 'swap',
            description: 'Swap completed with Emma K.',
            time: '2 hours ago',
            points: 50
        },
        {
            type: 'upload',
            description: 'New item listed: Winter Jacket',
            time: '1 day ago'
        },
        {
            type: 'message',
            description: 'New message from Alex M.',
            time: '2 days ago'
        }
    ];
    
    // Update activity list if exists
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.description}</strong></p>
                    <span class="activity-time">${activity.time}</span>
                </div>
                ${activity.points ? `<div class="activity-meta"><span class="points">+${activity.points} pts</span></div>` : ''}
            </div>
        `).join('');
    }
}

function getActivityIcon(type) {
    switch (type) {
        case 'swap': return 'fa-exchange-alt';
        case 'upload': return 'fa-plus';
        case 'message': return 'fa-envelope';
        case 'points': return 'fa-coins';
        default: return 'fa-circle';
    }
}

function loadSwapRequests() {
    // Mock swap requests
    const requests = [];
    
    const requestsList = document.querySelector('.requests-list');
    if (requestsList) {
        if (requests.length === 0) {
            requestsList.innerHTML = '<p class="empty-state">No pending requests</p>';
        } else {
            requestsList.innerHTML = requests.map(request => `
                <div class="request-item">
                    <img src="${request.userAvatar}" alt="${request.userName}" class="requester-avatar">
                    <div class="request-content">
                        <div class="request-header">
                            <h4>${request.userName}</h4>
                            <span class="request-time">${request.time}</span>
                        </div>
                        <p>${request.description}</p>
                        <div class="request-actions">
                            <button class="btn btn-primary btn-sm" onclick="acceptRequest('${request.id}')">Accept</button>
                            <button class="btn btn-outline btn-sm" onclick="declineRequest('${request.id}')">Decline</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Item detail functionality
function initializeItemDetail() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'item-detail.html') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    
    if (itemId) {
        loadItemDetail(itemId);
    }
    
    // Initialize favorite button
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', toggleFavorite);
    }
}

function loadItemDetail(itemId) {
    const item = getItemById(itemId);
    if (!item) {
        showNotification('Item not found', 'error');
        window.location.href = 'browse.html';
        return;
    }
    
    // Increment view count
    incrementItemViews(itemId);
    
    // Update breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const breadcrumbTitle = document.getElementById('breadcrumbTitle');
    if (breadcrumbCategory) breadcrumbCategory.textContent = item.category;
    if (breadcrumbTitle) breadcrumbTitle.textContent = item.title;
    
    // Update item details
    updateItemDetailUI(item);
    
    // Setup image gallery
    setupImageGallery(item.images);
    
    // Load similar items
    loadSimilarItems(item);
}

function updateItemDetailUI(item) {
    const elements = {
        itemTitle: document.getElementById('itemTitle'),
        itemPoints: document.getElementById('itemPoints'),
        itemCategory: document.getElementById('itemCategory'),
        itemSize: document.getElementById('itemSize'),
        itemCondition: document.getElementById('itemCondition'),
        itemColor: document.getElementById('itemColor'),
        itemBrand: document.getElementById('itemBrand'),
        itemMaterial: document.getElementById('itemMaterial'),
        itemDescription: document.getElementById('itemDescription'),
        ownerName: document.getElementById('ownerName')
    };
    
    if (elements.itemTitle) elements.itemTitle.textContent = item.title;
    if (elements.itemPoints) elements.itemPoints.textContent = item.points;
    if (elements.itemCategory) elements.itemCategory.textContent = item.category;
    if (elements.itemSize) elements.itemSize.textContent = item.size;
    if (elements.itemCondition) {
        elements.itemCondition.textContent = item.condition;
        elements.itemCondition.className = `detail-value condition ${item.condition}`;
    }
    if (elements.itemColor) elements.itemColor.textContent = item.color;
    if (elements.itemBrand) elements.itemBrand.textContent = item.brand;
    if (elements.itemMaterial) elements.itemMaterial.textContent = item.material;
    if (elements.itemDescription) elements.itemDescription.textContent = item.description;
    
    // Update tags
    const tagsList = document.querySelector('.tags-list');
    if (tagsList && item.tags) {
        tagsList.innerHTML = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    }
    
    // Update owner info
    const owner = getUserById(item.userId);
    if (owner && elements.ownerName) {
        elements.ownerName.textContent = `${owner.firstName} ${owner.lastName}`;
        const ownerAvatar = document.querySelector('.owner-avatar');
        if (ownerAvatar) ownerAvatar.src = owner.avatar;
        const ownerLocation = document.querySelector('.owner-location');
        if (ownerLocation) ownerLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${owner.location}`;
    }
}

function setupImageGallery(images) {
    currentImageIndex = 0;
    selectedImages = images;
    
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const imageCounter = document.getElementById('imageCounter');
    
    if (mainImage && images.length > 0) {
        mainImage.src = images[0];
    }
    
    if (imageCounter) {
        imageCounter.textContent = `1 / ${images.length}`;
    }
    
    // Update thumbnails
    thumbnails.forEach((thumb, index) => {
        if (images[index]) {
            thumb.src = images[index];
            thumb.style.display = 'block';
            thumb.onclick = () => selectImage(index);
        } else {
            thumb.style.display = 'none';
        }
    });
}

function selectImage(index) {
    if (index < 0 || index >= selectedImages.length) return;
    
    currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    const imageCounter = document.getElementById('imageCounter');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) mainImage.src = selectedImages[index];
    if (imageCounter) imageCounter.textContent = `${index + 1} / ${selectedImages.length}`;
    
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function previousImage() {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : selectedImages.length - 1;
    selectImage(newIndex);
}

function nextImage() {
    const newIndex = currentImageIndex < selectedImages.length - 1 ? currentImageIndex + 1 : 0;
    selectImage(newIndex);
}

function toggleFavorite() {
    const favoriteBtn = document.querySelector('.favorite-btn');
    const icon = favoriteBtn.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        favoriteBtn.classList.add('active');
        showNotification('Added to favorites', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        favoriteBtn.classList.remove('active');
        showNotification('Removed from favorites', 'success');
    }
}

function loadSimilarItems(currentItem) {
    const allItems = getAllItems().filter(item => 
        item.id !== currentItem.id && 
        item.status === 'approved' &&
        (item.category === currentItem.category || item.gender === currentItem.gender)
    );
    
    const similarItems = allItems.slice(0, 3);
    const similarGrid = document.querySelector('.similar-items-grid');
    
    if (similarGrid) {
        similarGrid.innerHTML = similarItems.map(item => `
            <div class="clothing-item" onclick="window.location.href='item-detail.html?id=${item.id}'">
                <div class="item-image">
                    <img src="${item.images[0]}" alt="${item.title}">
                    <div class="item-overlay">
                        <button class="quick-view-btn">Quick View</button>
                    </div>
                </div>
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <p class="item-category">${item.category}</p>
                    <div class="item-meta">
                        <span class="points">${item.points} pts</span>
                        <span class="size">Size ${item.size}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Add item functionality
function initializeAddItem() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'add-item.html') return;
    
    // Initialize file upload
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('itemImages');
    
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => fileInput.click());
        fileUploadArea.addEventListener('dragover', handleDragOver);
        fileUploadArea.addEventListener('dragleave', handleDragLeave);
        fileUploadArea.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Initialize form preview
    const formInputs = document.querySelectorAll('#addItemForm input, #addItemForm select, #addItemForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    // Initialize character counter
    const descriptionField = document.getElementById('description');
    if (descriptionField) {
        descriptionField.addEventListener('input', updateCharacterCount);
    }
    
    // Initialize password strength indicator for registration
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', updatePasswordStrength);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--primary-color)';
    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
}

function handleDragLeave(e) {
    e.currentTarget.style.borderColor = 'var(--glass-border)';
    e.currentTarget.style.background = '';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--glass-border)';
    e.currentTarget.style.background = '';
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function processFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        showNotification('Please select valid image files', 'error');
        return;
    }
    
    if (uploadedImages.length + imageFiles.length > 5) {
        showNotification('Maximum 5 images allowed', 'error');
        return;
    }
    
    imageFiles.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            showNotification(`File ${file.name} is too large (max 10MB)`, 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push({
                file: file,
                url: e.target.result,
                name: file.name
            });
            updateUploadedImages();
            updatePreview();
        };
        reader.readAsDataURL(file);
    });
}

function updateUploadedImages() {
    const uploadedImagesContainer = document.getElementById('uploadedImages');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    
    if (!uploadedImagesContainer) return;
    
    if (uploadedImages.length === 0) {
        uploadedImagesContainer.innerHTML = '';
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';
        return;
    }
    
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
    
    uploadedImagesContainer.innerHTML = uploadedImages.map((image, index) => `
        <div class="uploaded-image">
            <img src="${image.url}" alt="${image.name}">
            <button type="button" class="remove-image" onclick="removeUploadedImage(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeUploadedImage(index) {
    uploadedImages.splice(index, 1);
    updateUploadedImages();
    updatePreview();
}

function updatePreview() {
    const previewElements = {
        title: document.getElementById('previewTitle'),
        category: document.getElementById('previewCategory'),
        points: document.getElementById('previewPoints'),
        size: document.getElementById('previewSize'),
        condition: document.getElementById('previewCondition')
    };
    
    const formValues = {
        title: document.getElementById('itemTitle')?.value || 'Item Title',
        category: document.getElementById('category')?.value || 'Category',
        points: document.getElementById('points')?.value || '0',
        size: document.getElementById('size')?.value || 'Size',
        condition: document.getElementById('condition')?.value || 'Condition'
    };
    
    Object.keys(previewElements).forEach(key => {
        if (previewElements[key]) {
            if (key === 'points') {
                previewElements[key].textContent = `${formValues[key]} pts`;
            } else {
                previewElements[key].textContent = formValues[key];
            }
        }
    });
    
    // Update preview image
    const previewImage = document.querySelector('.preview-image');
    const previewPlaceholder = document.querySelector('.preview-placeholder');
    
    if (uploadedImages.length > 0) {
        previewImage.style.backgroundImage = `url(${uploadedImages[0].url})`;
        previewImage.style.backgroundSize = 'cover';
        previewImage.style.backgroundPosition = 'center';
        if (previewPlaceholder) previewPlaceholder.style.display = 'none';
    } else {
        previewImage.style.backgroundImage = '';
        if (previewPlaceholder) previewPlaceholder.style.display = 'flex';
    }
}

function updateCharacterCount() {
    const descriptionField = document.getElementById('description');
    const charCount = document.getElementById('charCount');
    
    if (descriptionField && charCount) {
        const length = descriptionField.value.length;
        charCount.textContent = length;
        
        if (length > 500) {
            charCount.style.color = 'var(--danger-color)';
            descriptionField.style.borderColor = 'var(--danger-color)';
        } else {
            charCount.style.color = '';
            descriptionField.style.borderColor = '';
        }
    }
}

function updatePasswordStrength() {
    const passwordField = document.getElementById('password');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!passwordField || !strengthFill || !strengthText) return;
    
    const password = passwordField.value;
    let strength = 0;
    let strengthLabel = 'Weak';
    let strengthColor = 'var(--danger-color)';
    
    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    
    if (strength >= 75) {
        strengthLabel = 'Strong';
        strengthColor = 'var(--success-color)';
    } else if (strength >= 50) {
        strengthLabel = 'Medium';
        strengthColor = 'var(--warning-color)';
    }
    
    strengthFill.style.width = `${strength}%`;
    strengthFill.style.background = strengthColor;
    strengthText.textContent = `Password strength: ${strengthLabel}`;
}

function changeStep(direction) {
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Hide current step
    steps[currentStep - 1].classList.remove('active');
    progressSteps[currentStep - 1].classList.remove('active');
    
    // Update current step
    currentStep += direction;
    
    // Show new step
    steps[currentStep - 1].classList.add('active');
    progressSteps[currentStep - 1].classList.add('active');
    
    // Mark completed steps
    progressSteps.forEach((step, index) => {
        if (index < currentStep - 1) {
            step.classList.add('completed');
        } else {
            step.classList.remove('completed');
        }
    });
    
    // Update button visibility
    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    nextBtn.style.display = currentStep === 3 ? 'none' : 'inline-flex';
    submitBtn.style.display = currentStep === 3 ? 'inline-flex' : 'none';
}

function handleAddItem(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please log in to add items', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    // Validate form
    if (uploadedImages.length === 0) {
        showNotification('Please upload at least one image', 'error');
        currentStep = 1;
        changeStep(0);
        return;
    }
    
    const formData = new FormData(e.target);
    const itemData = {
        title: formData.get('itemTitle'),
        category: formData.get('category'),
        size: formData.get('size'),
        condition: formData.get('condition'),
        brand: formData.get('brand') || 'Unknown',
        color: formData.get('color') || '',
        material: formData.get('material') || '',
        points: parseInt(formData.get('points')),
        description: formData.get('description'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
        styleNotes: formData.get('styleNotes') || '',
        exchangeOptions: Array.from(e.target.querySelectorAll('input[name="exchangeOptions"]:checked')).map(cb => cb.value),
        images: uploadedImages.map(img => img.url),
        userId: currentUser.id,
        status: 'pending',
        available: true,
        createdAt: new Date().toISOString()
    };
    
    // Validate required fields
    const requiredFields = ['title', 'category', 'size', 'condition', 'points', 'description'];
    for (const field of requiredFields) {
        if (!itemData[field] || (typeof itemData[field] === 'string' && !itemData[field].trim())) {
            showNotification(`Please fill in the ${field} field`, 'error');
            return;
        }
    }
    
    if (itemData.points < 10 || itemData.points > 200) {
        showNotification('Points must be between 10 and 200', 'error');
        return;
    }
    
    // Create item
    const newItem = createItem(itemData);
    
    // Award points to user
    awardPoints(currentUser.id, 25, 'Item listed');
    
    showNotification('Item submitted for review! You earned 25 points.', 'success');
    
    // Reset form
    e.target.reset();
    uploadedImages = [];
    currentStep = 1;
    changeStep(0);
    updateUploadedImages();
    updatePreview();
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

// Admin functionality
function initializeAdmin() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'admin.html') return;
    
    // Check admin permissions
    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('Access denied. Admin privileges required.', 'error');
        window.location.href = 'index.html';
        return;
    }
    
    loadAdminDashboard();
    
    // Initialize filter tabs
    const filterTabs = document.querySelectorAll('[data-filter]');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterPendingItems(tab.dataset.filter);
        });
    });
}

function loadAdminDashboard() {
    loadAdminStats();
    loadPendingItems();
    loadRecentUserActivity();
    loadSystemAnalytics();
    loadRecentReports();
}

function loadAdminStats() {
    const allUsers = getAllUsers();
    const allItems = getAllItems();
    const allSwaps = getAllSwaps();
    const pendingItems = allItems.filter(item => item.status === 'pending');
    
    // Update stat cards
    const statCards = document.querySelectorAll('.admin-stats .stat-card h3');
    if (statCards[0]) statCards[0].textContent = allUsers.length.toLocaleString();
    if (statCards[1]) statCards[1].textContent = allItems.length.toLocaleString();
    if (statCards[2]) statCards[2].textContent = allSwaps.length.toLocaleString();
    if (statCards[3]) statCards[3].textContent = pendingItems.length;
}

function loadPendingItems(filter = 'all') {
    const pendingItemsList = document.querySelector('.pending-items-list');
    if (!pendingItemsList) return;
    
    let items = getAllItems().filter(item => item.status === 'pending');
    
    if (filter === 'flagged') {
        items = items.filter(item => item.flagged);
    } else if (filter === 'new') {
        items = items.filter(item => !item.flagged);
    }
    
    if (items.length === 0) {
        pendingItemsList.innerHTML = '<p class="empty-state">No pending items</p>';
        return;
    }
    
    pendingItemsList.innerHTML = items.map(item => {
        const user = getUserById(item.userId);
        return `
            <div class="pending-item">
                <div class="item-thumbnail">
                    <img src="${item.images[0]}" alt="${item.title}">
                    <div class="item-status ${item.flagged ? 'flagged' : 'new'}">
                        ${item.flagged ? 'FLAGGED' : 'NEW'}
                    </div>
                </div>
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <p>Listed by: ${user ? `${user.firstName} ${user.lastName}` : 'Unknown'} • ${formatDate(item.createdAt)}</p>
                    <div class="item-meta">
                        <span>${item.category} • Size ${item.size} • ${item.points} pts</span>
                    </div>
                    <div class="item-description">
                        "${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}"
                    </div>
                    ${item.flagged ? `
                        <div class="flag-reason">
                            <i class="fas fa-flag"></i>
                            Flagged: ${item.flagReason || 'Suspicious content'}
                        </div>
                    ` : ''}
                </div>
                <div class="admin-actions">
                    <button class="btn btn-primary btn-sm" onclick="approveItem('${item.id}')">
                        <i class="fas fa-check"></i>
                        Approve
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="rejectItem('${item.id}')">
                        <i class="fas fa-times"></i>
                        Reject
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="viewItemDetails('${item.id}')">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function filterPendingItems(filter) {
    loadPendingItems(filter);
}

function approveItem(itemId) {
    if (confirm('Are you sure you want to approve this item?')) {
        updateItemStatus(itemId, 'approved');
        const item = getItemById(itemId);
        if (item) {
            awardPoints(item.userId, 25, 'Item approved');
        }
        showNotification('Item approved successfully', 'success');
        loadPendingItems();
        loadAdminStats();
    }
}

function rejectItem(itemId) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
        updateItemStatus(itemId, 'rejected', reason);
        showNotification('Item rejected', 'success');
        loadPendingItems();
        loadAdminStats();
    }
}

function viewItemDetails(itemId) {
    window.open(`item-detail.html?id=${itemId}`, '_blank');
}

function loadRecentUserActivity() {
    const activityFeed = document.querySelector('.activity-feed');
    if (!activityFeed) return;
    
    // Mock recent activity
    const activities = [
        {
            type: 'new',
            user: { name: 'Sarah Chen', avatar: 'https://pixabay.com/get/g4c573ecf613df4b61c8312bd8e57d2c40e17d51a7ba1426c1a87fa17137f754a486359f6853bc4009f49b8ad70a1ccf0838d47e817b54f83fc4fd3cab82e9ac0_1280.jpg' },
            description: 'listed a new item',
            time: '2 minutes ago'
        },
        {
            type: 'swap',
            user: { name: 'Emma K.', avatar: 'https://pixabay.com/get/ga4974486240b2e87a9f749a5753b09fb48691cc7182ba075b0ba9eecdae0d489e461356d00ff54e1ca6d098a5da02db18b9b4b268242e658cfc59b1a7aa34ce2_1280.jpg' },
            description: 'completed a swap',
            time: '15 minutes ago'
        }
    ];
    
    activityFeed.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <img src="${activity.user.avatar}" alt="${activity.user.name}" class="activity-avatar">
            <div class="activity-content">
                <p><strong>${activity.user.name}</strong> ${activity.description}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
            <div class="activity-type ${activity.type}">${activity.type.toUpperCase()}</div>
        </div>
    `).join('');
}

function loadSystemAnalytics() {
    // Mock analytics data
    const analytics = {
        dailyActiveUsers: 347,
        itemsListedToday: 23,
        successfulSwaps: 12,
        userSatisfaction: 4.8
    };
    
    const metrics = document.querySelectorAll('.analytics-metric');
    if (metrics[0]) {
        metrics[0].querySelector('.metric-value').textContent = analytics.dailyActiveUsers;
    }
    if (metrics[1]) {
        metrics[1].querySelector('.metric-value').textContent = analytics.itemsListedToday;
    }
    if (metrics[2]) {
        metrics[2].querySelector('.metric-value').textContent = analytics.successfulSwaps;
    }
    if (metrics[3]) {
        metrics[3].querySelector('.metric-value').textContent = `${analytics.userSatisfaction}/5`;
    }
}

function loadRecentReports() {
    const reportsList = document.querySelector('.reports-list');
    if (!reportsList) return;
    
    // Mock reports
    const reports = [
        {
            type: 'content',
            title: 'Inappropriate Content Report',
            description: 'User reported item contains inappropriate images',
            time: '30 minutes ago',
            urgent: true
        },
        {
            type: 'user',
            title: 'User Behavior Report',
            description: 'Multiple users reported aggressive messaging',
            time: '2 hours ago',
            urgent: false
        }
    ];
    
    if (reports.length === 0) {
        reportsList.innerHTML = '<p class="empty-state">No recent reports</p>';
        return;
    }
    
    reportsList.innerHTML = reports.map(report => `
        <div class="report-item ${report.urgent ? 'urgent' : ''}">
            <div class="report-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="report-content">
                <h4>${report.title}</h4>
                <p>${report.description}</p>
                <span class="report-time">${report.time}</span>
            </div>
            <div class="report-actions">
                <button class="btn btn-${report.urgent ? 'danger' : 'warning'} btn-sm">
                    ${report.urgent ? 'Review' : 'Investigate'}
                </button>
                <button class="btn btn-outline btn-sm">Dismiss</button>
            </div>
        </div>
    `).join('');
}

// Page-specific initialization
function initializePageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'browse.html':
            initializeBrowsePage();
            break;
        case 'dashboard.html':
            initializeDashboardPage();
            break;
        case 'add-item.html':
            initializeAddItemPage();
            break;
        case 'admin.html':
            initializeAdminPage();
            break;
        default:
            break;
    }
}

function initializeBrowsePage() {
    // Load all items on browse page
    const itemsGrid = document.getElementById('itemsGrid');
    if (itemsGrid) {
        const allItems = getAllItems().filter(item => item.status === 'approved');
        renderItems(allItems, itemsGrid);
        
        // Update results count
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = allItems.length;
        }
    }
    
    // Initialize load more functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            showNotification('All items loaded', 'info');
        });
    }
}

function initializeDashboardPage() {
    // Dashboard already initialized in initializeDashboard
}

function initializeAddItemPage() {
    // Add item already initialized in initializeAddItem
}

function initializeAdminPage() {
    // Admin already initialized in initializeAdmin
}

// Item actions
function redeemItem() {
    if (!currentUser) {
        showNotification('Please log in to redeem items', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    const item = getItemById(itemId);
    
    if (!item) {
        showNotification('Item not found', 'error');
        return;
    }
    
    if (currentUser.points < item.points) {
        showNotification('Insufficient points to redeem this item', 'error');
        return;
    }
    
    if (confirm(`Redeem ${item.title} for ${item.points} points?`)) {
        // Deduct points from user
        updateUserPoints(currentUser.id, -item.points);
        
        // Mark item as unavailable
        updateItemAvailability(itemId, false);
        
        // Award points to item owner
        awardPoints(item.userId, item.points, 'Item redeemed');
        
        showNotification('Item redeemed successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
}

function requestSwap() {
    if (!currentUser) {
        showNotification('Please log in to request swaps', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    showNotification('Swap request feature coming soon!', 'info');
}

function sendMessage() {
    if (!currentUser) {
        showNotification('Please log in to send messages', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    showNotification('Messaging feature coming soon!', 'info');
}

function quickViewItem(itemId) {
    window.location.href = `item-detail.html?id=${itemId}`;
}

function editItem(itemId) {
    showNotification('Edit item feature coming soon!', 'info');
}

function removeItem(itemId) {
    if (confirm('Are you sure you want to remove this item?')) {
        deleteItem(itemId);
        showNotification('Item removed successfully', 'success');
        loadUserItems('active');
    }
}

function acceptRequest(requestId) {
    showNotification('Request accepted!', 'success');
    loadSwapRequests();
}

function declineRequest(requestId) {
    showNotification('Request declined', 'info');
    loadSwapRequests();
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) {
        return 'Just now';
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        box-shadow: var(--glass-shadow);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add type-specific styles
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        info: 'var(--primary-color)'
    };
    
    notification.style.borderLeftColor = colors[type];
    notification.style.borderLeftWidth = '4px';
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-bell';
    }
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.parentElement.querySelector('.password-toggle');
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Add custom styles for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
    }
    
    .notification-close:hover {
        background: var(--glass-border);
        color: var(--text-primary);
    }
    
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--spacing-2xl);
        color: var(--text-secondary);
    }
    
    .no-results i {
        font-size: 3rem;
        margin-bottom: var(--spacing-md);
        opacity: 0.5;
    }
    
    .empty-state {
        text-align: center;
        color: var(--text-secondary);
        padding: var(--spacing-xl);
        font-style: italic;
    }
`;

document.head.appendChild(notificationStyles);

// Scroll-based entrance animations
function initializeScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate showcase items individually
                if (entry.target.classList.contains('fashion-showcase')) {
                    const showcaseItems = entry.target.querySelectorAll('.showcase-item');
                    showcaseItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll([
        '.hero-text',
        '.hero-visual', 
        '.fashion-showcase',
        '.clothes-gallery',
        '.stats-section',
        '.cta-section',
        '.footer'
    ].join(','));

    animatedElements.forEach(element => {
        if (element) {
            observer.observe(element);
        }
    });

    // Initial animation for hero section (visible immediately)
    setTimeout(() => {
        const heroText = document.querySelector('.hero-text');
        const heroVisual = document.querySelector('.hero-visual');
        if (heroText) heroText.classList.add('visible');
        if (heroVisual) heroVisual.classList.add('visible');
    }, 300);

    console.log('Scroll animations initialized');
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = document.querySelector(`[onclick="togglePassword('${fieldId}')"]`);
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        field.type = 'password';
        toggle.innerHTML = '<i class="fas fa-eye"></i>';
    }
}
