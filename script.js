
// Sample data for items
const sampleItems = [
    {
        id: 1,
        title: "Vintage Denim Jacket",
        description: "Classic vintage denim jacket in excellent condition. Perfect for sustainable fashion lovers.",
        category: "clothing",
        condition: "good",
        size: "m",
        points: 85,
        imageUrl: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300&h=200&fit=crop"
    },
    {
        id: 2,
        title: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation. Barely used.",
        category: "electronics",
        condition: "new",
        size: "",
        points: 120,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
        id: 3,
        title: "Programming Books Collection",
        description: "Set of 5 programming books including JavaScript, Python, and React guides.",
        category: "books",
        condition: "good",
        size: "",
        points: 60,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
    },
    {
        id: 4,
        title: "Yoga Mat & Accessories",
        description: "Complete yoga set with mat, blocks, and strap. Great for home workouts.",
        category: "sports",
        condition: "fair",
        size: "",
        points: 45,
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop"
    },
    {
        id: 5,
        title: "Indoor Plant Collection",
        description: "Beautiful collection of 3 indoor plants with pots. Perfect for your home garden.",
        category: "home",
        condition: "good",
        size: "",
        points: 35,
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop"
    },
    {
        id: 6,
        title: "Designer Sneakers",
        description: "Limited edition designer sneakers in great condition. Size 9.",
        category: "clothing",
        condition: "good",
        size: "l",
        points: 95,
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop"
    }
];

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const itemsGrid = document.getElementById('items-grid');
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const sendMessage = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');

// Filter elements
const categoryFilter = document.getElementById('category-filter');
const sizeFilter = document.getElementById('size-filter');
const conditionFilter = document.getElementById('condition-filter');
const searchInput = document.getElementById('search-input');
const applyFilters = document.getElementById('apply-filters');

// Chat bot responses
const botResponses = {
    'hello': "Hello! Welcome to SustainableSwap! How can I help you get started with eco-friendly swapping?",
    'how to swap': "Swapping is easy! Just browse items, find something you like, and click to make a swap request. The owner will review and approve if they're interested in your items.",
    'upload': "To upload an item, go to the Upload page, fill in the details about your item, add a photo, and submit. Your item will be listed for others to see!",
    'points': "You earn eco-points for every successful swap! These points show your positive environmental impact and can unlock special badges.",
    'categories': "We have items in clothing, electronics, books, home & garden, and sports categories. Use the filters to find exactly what you're looking for!",
    'condition': "Items are rated as 'Like New', 'Good', or 'Fair' condition. This helps you know what to expect when swapping.",
    'sustainable': "Every swap you make saves items from landfills and reduces the need for new production. You're helping create a circular economy!",
    'badges': "Earn badges by completing swaps, saving CO2, and being an active community member. Check the Badges page to see your progress!",
    'default': "I'm here to help with any questions about sustainable swapping! You can ask me about how to swap, upload items, earn points, or anything else."
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFilters();
    initializeChatAssistant();
    loadItems();
    initializeForms();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Page navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.dataset.page;
            showPage(targetPage);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });
}

// Show specific page
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Filter functionality
function initializeFilters() {
    applyFilters.addEventListener('click', filterItems);
    
    // Also filter on enter key in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterItems();
        }
    });
}

// Filter items based on selected criteria
function filterItems() {
    const category = categoryFilter.value.toLowerCase();
    const size = sizeFilter.value.toLowerCase();
    const condition = conditionFilter.value.toLowerCase();
    const search = searchInput.value.toLowerCase();
    
    const filteredItems = sampleItems.filter(item => {
        const matchesCategory = !category || item.category.toLowerCase() === category;
        const matchesSize = !size || item.size.toLowerCase() === size;
        const matchesCondition = !condition || item.condition.toLowerCase() === condition;
        const matchesSearch = !search || 
            item.title.toLowerCase().includes(search) || 
            item.description.toLowerCase().includes(search);
        
        return matchesCategory && matchesSize && matchesCondition && matchesSearch;
    });
    
    displayItems(filteredItems);
}

// Load and display items
function loadItems() {
    displayItems(sampleItems);
}

// Display items in grid
function displayItems(items) {
    itemsGrid.innerHTML = '';
    
    if (items.length === 0) {
        itemsGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #64748b; font-size: 1.1rem;">No items found matching your criteria.</p>';
        return;
    }
    
    items.forEach(item => {
        const itemCard = createItemCard(item);
        itemsGrid.appendChild(itemCard);
    });
}

// Create item card element
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}" class="item-image">
        <div class="item-info">
            <h3 class="item-title">${item.title}</h3>
            <p class="item-description">${item.description}</p>
            <div class="item-meta">
                <span class="item-category">${capitalizeFirst(item.category)}</span>
                <span class="item-condition">${capitalizeFirst(item.condition)}</span>
            </div>
            <div class="item-points">${item.points} eco-points</div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        showItemDetails(item);
    });
    
    return card;
}

// Show item details (placeholder function)
function showItemDetails(item) {
    alert(`${item.title}\n\n${item.description}\n\nCondition: ${capitalizeFirst(item.condition)}\nPoints: ${item.points}\n\nClick OK to make a swap request!`);
}

// Chat assistant functionality
function initializeChatAssistant() {
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });
    
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });
    
    sendMessage.addEventListener('click', sendChatMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Send chat message
function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Generate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

// Add message to chat
function addChatMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.innerHTML = `<p>${message}</p>`;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate bot response
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    for (const keyword in botResponses) {
        if (message.includes(keyword)) {
            return botResponses[keyword];
        }
    }
    
    return botResponses.default;
}

// Initialize forms
function initializeForms() {
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadForm);
    }
}

// Handle upload form submission
function handleUploadForm(e) {
    e.preventDefault();
    
    const title = document.getElementById('item-title').value;
    const description = document.getElementById('item-description').value;
    const category = document.getElementById('item-category').value;
    const condition = document.getElementById('item-condition').value;
    
    if (!title || !description || !category || !condition) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Simulate upload success
    alert('Item uploaded successfully! It will appear in the browse section.');
    
    // Reset form
    e.target.reset();
    
    // Go back to browse page
    showPage('home');
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="home"]').classList.add('active');
}

// Utility function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add some interactivity to the hero section
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Scroll to items section or show browse page
            showPage('home');
            setTimeout(() => {
                const itemsSection = document.querySelector('.items-section');
                if (itemsSection) {
                    itemsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        });
    }
});

// Add smooth scrolling for anchor links
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

// Add loading animation for better UX
function showLoading() {
    itemsGrid.innerHTML = '<div style="text-align: center; grid-column: 1 / -1;"><div class="loading">Loading items...</div></div>';
}

// Simulate API calls with loading states
function simulateApiCall(callback, delay = 1000) {
    showLoading();
    setTimeout(callback, delay);
}

// Enhanced filter functionality with debouncing
let filterTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(filterItems, 300);
});
