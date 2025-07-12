// In-memory database for ReWear application
// This file manages all data storage and retrieval using localStorage

// Initialize data store
let dataStore = {
    users: [],
    items: [],
    swaps: [],
    categories: [],
    nextId: 1
};

// Load data from localStorage on initialization
function initializeDataStore() {
    const saved = localStorage.getItem('reWearData');
    if (saved) {
        try {
            dataStore = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading saved data:', error);
            initializeDefaultData();
        }
    } else {
        initializeDefaultData();
    }
}

// Save data to localStorage
function saveDataStore() {
    try {
        localStorage.setItem('reWearData', JSON.stringify(dataStore));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Initialize with default/sample data for demonstration
function initializeDefaultData() {
    // Create default admin user
    const adminUser = {
        id: generateId(),
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@rewear.com',
        password: 'admin123',
        role: 'admin',
        points: 1000,
        avatar: 'https://pixabay.com/get/g72979bb66c01afe73332ed2d4c8b1dc54d75dac6a7a5dedf87a31ff01c6190a6625288e2eaeea52b530216150dc8202562930ee04fb73e1c8bac4a849c9e7613_1280.jpg',
        location: 'New York, NY',
        createdAt: new Date().toISOString(),
        newsletter: true,
        rating: 5.0,
        totalSwaps: 0
    };

    // Create sample users
    const sampleUsers = [
        {
            id: generateId(),
            firstName: 'Sarah',
            lastName: 'Chen',
            email: 'sarah@example.com',
            password: 'password123',
            role: 'user',
            points: 250,
            avatar: 'https://pixabay.com/get/g4c573ecf613df4b61c8312bd8e57d2c40e17d51a7ba1426c1a87fa17137f754a486359f6853bc4009f49b8ad70a1ccf0838d47e817b54f83fc4fd3cab82e9ac0_1280.jpg',
            location: 'San Francisco, CA',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            newsletter: true,
            rating: 4.9,
            totalSwaps: 23
        },
        {
            id: generateId(),
            firstName: 'Emma',
            lastName: 'Johnson',
            email: 'emma@example.com',
            password: 'password123',
            role: 'user',
            points: 180,
            avatar: 'https://pixabay.com/get/ga4974486240b2e87a9f749a5753b09fb48691cc7182ba075b0ba9eecdae0d489e461356d00ff54e1ca6d098a5da02db18b9b4b268242e658cfc59b1a7aa34ce2_1280.jpg',
            location: 'Los Angeles, CA',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            newsletter: false,
            rating: 4.7,
            totalSwaps: 15
        },
        {
            id: generateId(),
            firstName: 'Alex',
            lastName: 'Rodriguez',
            email: 'alex@example.com',
            password: 'password123',
            role: 'user',
            points: 320,
            avatar: 'https://pixabay.com/get/gd7e0c4ae6b4e0a436842982187056cf112d5ae49f03811c4cd581d1317025687e6a3a4468fdcdaec1a11ea2008efdd1412466bd5609852d209cf377af0d9c986_1280.jpg',
            location: 'Chicago, IL',
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            newsletter: true,
            rating: 4.8,
            totalSwaps: 18
        },
        {
            id: generateId(),
            firstName: 'Maya',
            lastName: 'Patel',
            email: 'maya@example.com',
            password: 'password123',
            role: 'user',
            points: 95,
            avatar: 'https://pixabay.com/get/g5fc6c0d8733e4bdc20b19080b8fc4c24b7b39e4d3eb014190dab1d7cddc3b25913de851f7314bb1cb63706563f0e1b7cf38c2ac282e1c1eb31b95672547c7bf6_1280.jpg',
            location: 'Austin, TX',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            newsletter: true,
            rating: 4.6,
            totalSwaps: 8
        }
    ];

    // Add users to dataStore
    dataStore.users.push(adminUser, ...sampleUsers);

    // Create sample clothing items
    const sampleItems = [
        {
            id: generateId(),
            title: 'Vintage Floral Summer Dress',
            description: 'Beautiful vintage floral dress perfect for summer occasions. Features a comfortable fit and timeless design. This piece has been well-maintained and is ready for its next adventure.',
            category: 'dresses',
            gender: 'women',
            size: 'M',
            condition: 'excellent',
            brand: 'Vintage Collection',
            color: 'multicolor',
            material: '100% Cotton',
            points: 50,
            tags: ['vintage', 'floral', 'summer', 'casual', 'feminine'],
            images: [
                'https://pixabay.com/get/g86a1c2f1ed04416a34a93146c3f417fc59931854980d52d6afac0b600cf7a67dce68cc61d0b06f70f6ee538636390d3ff6f9004ef1f9326030ac615c5ae65809_1280.jpg',
                'https://pixabay.com/get/g70f24aa2ad9709fcd2da6668beedefb8276cb58b5d1f8a050b7af7187f86f15e5e1fab07ad283c75863ed696ff761f8582e44e7c755b9cee585a5b3f1b910af4_1280.jpg',
                'https://pixabay.com/get/g7f981624e56415b46f017977a355d26bc6c4e677cf4d96a82f4822798a282d2213b25a4b95943ae299605630e530e761ad2c7e2336f7f6b34eb302e5b448047c_1280.jpg'
            ],
            userId: sampleUsers[0].id,
            status: 'approved',
            available: true,
            views: 45,
            exchangeOptions: ['pickup', 'shipping'],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            flagged: false
        },
        {
            id: generateId(),
            title: 'Casual Summer Top',
            description: 'Lightweight and breathable summer top perfect for casual outings. Features a relaxed fit and soft fabric that\'s comfortable all day long.',
            category: 'tops',
            gender: 'women',
            size: 'S',
            condition: 'good',
            brand: 'H&M',
            color: 'white',
            material: '95% Cotton, 5% Elastane',
            points: 30,
            tags: ['casual', 'summer', 'comfortable', 'everyday'],
            images: [
                'https://pixabay.com/get/g70f24aa2ad9709fcd2da6668beedefb8276cb58b5d1f8a050b7af7187f86f15e5e1fab07ad283c75863ed696ff761f8582e44e7c755b9cee585a5b3f1b910af4_1280.jpg'
            ],
            userId: sampleUsers[1].id,
            status: 'approved',
            available: true,
            views: 32,
            exchangeOptions: ['pickup', 'meetup'],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            flagged: false
        },
        {
            id: generateId(),
            title: 'Professional Business Shirt',
            description: 'Crisp and professional button-down shirt perfect for office wear. High-quality fabric with a tailored fit. Small stain on left sleeve but hardly noticeable.',
            category: 'tops',
            gender: 'unisex',
            size: 'M',
            condition: 'good',
            brand: 'Brooks Brothers',
            color: 'blue',
            material: '100% Cotton',
            points: 40,
            tags: ['business', 'professional', 'office', 'formal'],
            images: [
                'https://pixabay.com/get/g7f981624e56415b46f017977a355d26bc6c4e677cf4d96a82f4822798a282d2213b25a4b95943ae299605630e530e761ad2c7e2336f7f6b34eb302e5b448047c_1280.jpg'
            ],
            userId: sampleUsers[2].id,
            status: 'approved',
            available: true,
            views: 28,
            exchangeOptions: ['shipping'],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            flagged: false
        },
        {
            id: generateId(),
            title: 'Designer Leather Handbag',
            description: 'Authentic designer handbag in excellent condition. Features premium leather construction and timeless design. Perfect for special occasions or everyday elegance.',
            category: 'accessories',
            gender: 'women',
            size: 'One Size',
            condition: 'excellent',
            brand: 'Michael Kors',
            color: 'brown',
            material: 'Genuine Leather',
            points: 80,
            tags: ['designer', 'leather', 'handbag', 'luxury', 'elegant'],
            images: [
                'https://pixabay.com/get/gf0ae49d0aa6ab8e622fcfdcbea1882cb9db70e64f359c9afc0fea4b1ff4ac62420807f9c753f955685362b561aff61c578875560d7d1447a68a501884d9c7a69_1280.jpg'
            ],
            userId: sampleUsers[0].id,
            status: 'approved',
            available: true,
            views: 67,
            exchangeOptions: ['pickup', 'shipping', 'meetup'],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            flagged: false
        },
        {
            id: generateId(),
            title: 'Vintage Denim Jacket',
            description: 'Classic vintage denim jacket with authentic wear and character. Perfect for layering and adding a retro touch to any outfit.',
            category: 'outerwear',
            gender: 'unisex',
            size: 'L',
            condition: 'good',
            brand: 'Levi\'s',
            color: 'blue',
            material: '100% Cotton Denim',
            points: 45,
            tags: ['vintage', 'denim', 'classic', 'unisex', 'layering'],
            images: [
                'https://pixabay.com/get/gd114866012d9de6b28a5f3e95364d9176892eb3549beb8c7a21c22307b1fb0d8c3ff0c2919bc87e946cf13390821428a2c9a6349c7e9ea0600793240f7f0f3aa_1280.jpg'
            ],
            userId: sampleUsers[1].id,
            status: 'approved',
            available: true,
            views: 41,
            exchangeOptions: ['pickup', 'meetup'],
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            flagged: false
        },
        {
            id: generateId(),
            title: 'Elegant Evening Dress',
            description: 'Stunning evening dress perfect for formal events and special occasions. Features beautiful detailing and a flattering silhouette.',
            category: 'dresses',
            gender: 'women',
            size: 'M',
            condition: 'excellent',
            brand: 'Zara',
            color: 'black',
            material: '95% Polyester, 5% Elastane',
            points: 65,
            tags: ['evening', 'formal', 'elegant', 'special occasion'],
            images: [
                'https://pixabay.com/get/g5ad9a45355dee8906dee441819d056cb54ee8dc811247e233fd89b126ba24af825047e367ed133f417c177b66ae78ad69b5448ad9290048ab8369fda4f7c713e_1280.jpg'
            ],
            userId: sampleUsers[3].id,
            status: 'approved',
            available: true,
            views: 53,
            exchangeOptions: ['pickup', 'shipping'],
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            flagged: false
        },
        {
            id: generateId(),
            title: 'Cozy Winter Sweater',
            description: 'Warm and cozy sweater perfect for cold weather. Soft knit material and comfortable fit make this a winter wardrobe essential.',
            category: 'tops',
            gender: 'women',
            size: 'L',
            condition: 'good',
            brand: 'Gap',
            color: 'gray',
            material: '80% Wool, 20% Acrylic',
            points: 35,
            tags: ['winter', 'warm', 'cozy', 'sweater', 'knit'],
            images: [
                'https://pixabay.com/get/gb2697e3264f18ca7ef69598ba114c798abf69cb72474be7e2fb376091897d891e996b8fa4da96088b9647fc3b6a708814ba51fd3f3e6b6a6ffac707eed842e71_1280.jpg'
            ],
            userId: sampleUsers[2].id,
            status: 'approved',
            available: true,
            views: 29,
            exchangeOptions: ['pickup'],
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            flagged: false
        },
        {
            id: generateId(),
            title: 'Trendy Graphic T-Shirt',
            description: 'Cool graphic t-shirt with unique design. Great for casual wear and expressing personal style. Comfortable cotton blend fabric.',
            category: 'tops',
            gender: 'unisex',
            size: 'M',
            condition: 'good',
            brand: 'Urban Outfitters',
            color: 'white',
            material: '60% Cotton, 40% Polyester',
            points: 25,
            tags: ['graphic', 'casual', 'trendy', 'unisex', 'streetwear'],
            images: [
                'https://pixabay.com/get/g3c7f0022f980d157b8064f0dbabe39c8d11e0e198e684dfc30f1c6f921cf85b4f0c8f228da47a642b6327dde489185604669f7ed077c70f40eae5d895d606107_1280.jpg'
            ],
            userId: sampleUsers[3].id,
            status: 'approved',
            available: true,
            views: 22,
            exchangeOptions: ['pickup', 'meetup'],
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            flagged: false
        },
        // Pending items for admin review
        {
            id: generateId(),
            title: 'Designer Shoes',
            description: 'High-end designer shoes in great condition. Authentic and stylish.',
            category: 'shoes',
            gender: 'women',
            size: '8',
            condition: 'excellent',
            brand: 'Jimmy Choo',
            color: 'black',
            material: 'Leather',
            points: 120,
            tags: ['designer', 'luxury', 'shoes', 'formal'],
            images: [
                'https://pixabay.com/get/gba853dd2bf574459b30207987a1fe3b6c497c33f85fe113dbf8928264172222c654a4149d2b7cffc3dc4d70804e257a506e8f07f930d387b99ebc7c36c0b423d_1280.jpg'
            ],
            userId: sampleUsers[1].id,
            status: 'pending',
            available: true,
            views: 0,
            exchangeOptions: ['pickup', 'shipping'],
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            flagged: true,
            flagReason: 'Suspicious authenticity claim'
        }
    ];

    // Add items to dataStore
    dataStore.items.push(...sampleItems);

    // Create categories
    dataStore.categories = [
        { id: 'tops', name: 'Tops', icon: 'fa-tshirt' },
        { id: 'dresses', name: 'Dresses', icon: 'fa-female' },
        { id: 'pants', name: 'Pants & Jeans', icon: 'fa-user' },
        { id: 'skirts', name: 'Skirts', icon: 'fa-female' },
        { id: 'outerwear', name: 'Outerwear', icon: 'fa-jacket' },
        { id: 'shoes', name: 'Shoes', icon: 'fa-shoe-prints' },
        { id: 'accessories', name: 'Accessories', icon: 'fa-gem' },
        { id: 'underwear', name: 'Underwear & Sleepwear', icon: 'fa-tshirt' }
    ];

    // Save initial data
    saveDataStore();
}

// ID generation
function generateId() {
    return `id_${dataStore.nextId++}_${Date.now()}`;
}

// User management functions
function createUser(userData) {
    const newUser = {
        id: generateId(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user',
        points: userData.points || 100, // Starting points
        avatar: userData.avatar || getRandomAvatar(),
        location: userData.location || '',
        createdAt: new Date().toISOString(),
        newsletter: userData.newsletter || false,
        rating: 5.0,
        totalSwaps: 0
    };
    
    dataStore.users.push(newUser);
    saveDataStore();
    return newUser;
}

function getUserById(userId) {
    return dataStore.users.find(user => user.id === userId);
}

function getUserByEmail(email) {
    return dataStore.users.find(user => user.email === email);
}

function getAllUsers() {
    return [...dataStore.users];
}

function updateUser(userId, updates) {
    const userIndex = dataStore.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        dataStore.users[userIndex] = { ...dataStore.users[userIndex], ...updates };
        saveDataStore();
        return dataStore.users[userIndex];
    }
    return null;
}

function updateUserPoints(userId, pointsChange) {
    const user = getUserById(userId);
    if (user) {
        user.points = Math.max(0, user.points + pointsChange);
        saveDataStore();
        return user.points;
    }
    return 0;
}

function awardPoints(userId, points, reason) {
    const user = getUserById(userId);
    if (user) {
        user.points = (user.points || 0) + points;
        saveDataStore();
        
        // You could also log the point transaction here
        console.log(`Awarded ${points} points to ${user.firstName} ${user.lastName} for: ${reason}`);
        return user.points;
    }
    return 0;
}

// Item management functions
function createItem(itemData) {
    const newItem = {
        id: generateId(),
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        gender: itemData.gender || 'unisex',
        size: itemData.size,
        condition: itemData.condition,
        brand: itemData.brand || '',
        color: itemData.color || '',
        material: itemData.material || '',
        points: itemData.points,
        tags: itemData.tags || [],
        images: itemData.images || [],
        userId: itemData.userId,
        status: itemData.status || 'pending',
        available: itemData.available !== false,
        views: 0,
        exchangeOptions: itemData.exchangeOptions || [],
        createdAt: new Date().toISOString(),
        flagged: false,
        flagReason: ''
    };
    
    dataStore.items.push(newItem);
    saveDataStore();
    return newItem;
}

function getItemById(itemId) {
    return dataStore.items.find(item => item.id === itemId);
}

function getAllItems() {
    return [...dataStore.items];
}

function getUserItems(userId) {
    return dataStore.items.filter(item => item.userId === userId);
}

function updateItem(itemId, updates) {
    const itemIndex = dataStore.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        dataStore.items[itemIndex] = { ...dataStore.items[itemIndex], ...updates };
        saveDataStore();
        return dataStore.items[itemIndex];
    }
    return null;
}

function updateItemStatus(itemId, status, reason = '') {
    const item = getItemById(itemId);
    if (item) {
        item.status = status;
        if (reason) {
            item.rejectionReason = reason;
        }
        saveDataStore();
        return item;
    }
    return null;
}

function updateItemAvailability(itemId, available) {
    const item = getItemById(itemId);
    if (item) {
        item.available = available;
        saveDataStore();
        return item;
    }
    return null;
}

function incrementItemViews(itemId) {
    const item = getItemById(itemId);
    if (item) {
        item.views = (item.views || 0) + 1;
        saveDataStore();
        return item.views;
    }
    return 0;
}

function deleteItem(itemId) {
    const itemIndex = dataStore.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const deletedItem = dataStore.items.splice(itemIndex, 1)[0];
        saveDataStore();
        return deletedItem;
    }
    return null;
}

function flagItem(itemId, reason) {
    const item = getItemById(itemId);
    if (item) {
        item.flagged = true;
        item.flagReason = reason;
        saveDataStore();
        return item;
    }
    return null;
}

// Swap management functions
function createSwap(swapData) {
    const newSwap = {
        id: generateId(),
        fromUserId: swapData.fromUserId,
        toUserId: swapData.toUserId,
        fromItemId: swapData.fromItemId,
        toItemId: swapData.toItemId,
        status: 'pending', // pending, accepted, rejected, completed
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    dataStore.swaps.push(newSwap);
    saveDataStore();
    return newSwap;
}

function getSwapById(swapId) {
    return dataStore.swaps.find(swap => swap.id === swapId);
}

function getAllSwaps() {
    return [...dataStore.swaps];
}

function getUserSwaps(userId) {
    return dataStore.swaps.filter(swap => 
        swap.fromUserId === userId || swap.toUserId === userId
    );
}

function updateSwapStatus(swapId, status) {
    const swap = getSwapById(swapId);
    if (swap) {
        swap.status = status;
        if (status === 'completed') {
            swap.completedAt = new Date().toISOString();
            
            // Update user swap counts
            const fromUser = getUserById(swap.fromUserId);
            const toUser = getUserById(swap.toUserId);
            if (fromUser) fromUser.totalSwaps++;
            if (toUser) toUser.totalSwaps++;
        }
        saveDataStore();
        return swap;
    }
    return null;
}

// Category management
function getAllCategories() {
    return [...dataStore.categories];
}

function getCategoryById(categoryId) {
    return dataStore.categories.find(cat => cat.id === categoryId);
}

// Utility functions
function getRandomAvatar() {
    const avatars = [
        'https://pixabay.com/get/g4c573ecf613df4b61c8312bd8e57d2c40e17d51a7ba1426c1a87fa17137f754a486359f6853bc4009f49b8ad70a1ccf0838d47e817b54f83fc4fd3cab82e9ac0_1280.jpg',
        'https://pixabay.com/get/g7c8a11d3048fb7f98f0515afe420764629983ae75c69a394134f00934a4293c89a5cedc09171903327777107d60f49b10cca38ac781a5d6ed82707fcdfdc64b1_1280.jpg',
        'https://pixabay.com/get/ga4974486240b2e87a9f749a5753b09fb48691cc7182ba075b0ba9eecdae0d489e461356d00ff54e1ca6d098a5da02db18b9b4b268242e658cfc59b1a7aa34ce2_1280.jpg',
        'https://pixabay.com/get/gd7e0c4ae6b4e0a436842982187056cf112d5ae49f03811c4cd581d1317025687e6a3a4468fdcdaec1a11ea2008efdd1412466bd5609852d209cf377af0d9c986_1280.jpg',
        'https://pixabay.com/get/g72979bb66c01afe73332ed2d4c8b1dc54d75dac6a7a5dedf87a31ff01c6190a6625288e2eaeea52b530216150dc8202562930ee04fb73e1c8bac4a849c9e7613_1280.jpg',
        'https://pixabay.com/get/g5fc6c0d8733e4bdc20b19080b8fc4c24b7b39e4d3eb014190dab1d7cddc3b25913de851f7314bb1cb63706563f0e1b7cf38c2ac282e1c1eb31b95672547c7bf6_1280.jpg'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
}

// Search and filter functions
function searchItems(query, filters = {}) {
    let items = getAllItems().filter(item => item.status === 'approved');
    
    // Apply text search
    if (query) {
        const searchTerm = query.toLowerCase();
        items = items.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.brand.toLowerCase().includes(searchTerm) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply filters
    Object.keys(filters).forEach(filterKey => {
        const filterValue = filters[filterKey];
        if (!filterValue) return;
        
        switch (filterKey) {
            case 'category':
                items = items.filter(item => item.category === filterValue);
                break;
            case 'gender':
                if (filterValue !== 'all') {
                    items = items.filter(item => item.gender === filterValue);
                }
                break;
            case 'size':
                items = items.filter(item => item.size === filterValue);
                break;
            case 'condition':
                items = items.filter(item => item.condition === filterValue);
                break;
            case 'color':
                items = items.filter(item => item.color === filterValue);
                break;
            case 'minPoints':
                items = items.filter(item => item.points >= parseInt(filterValue));
                break;
            case 'maxPoints':
                items = items.filter(item => item.points <= parseInt(filterValue));
                break;
        }
    });
    
    return items;
}

function sortItems(items, sortBy) {
    const sortedItems = [...items];
    
    switch (sortBy) {
        case 'newest':
            return sortedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'oldest':
            return sortedItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'points-low':
            return sortedItems.sort((a, b) => a.points - b.points);
        case 'points-high':
            return sortedItems.sort((a, b) => b.points - a.points);
        case 'popular':
            return sortedItems.sort((a, b) => (b.views || 0) - (a.views || 0));
        case 'title':
            return sortedItems.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return sortedItems;
    }
}

// Analytics functions
function getAnalytics() {
    const users = getAllUsers();
    const items = getAllItems();
    const swaps = getAllSwaps();
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
        totalUsers: users.length,
        totalItems: items.length,
        totalSwaps: swaps.length,
        approvedItems: items.filter(item => item.status === 'approved').length,
        pendingItems: items.filter(item => item.status === 'pending').length,
        rejectedItems: items.filter(item => item.status === 'rejected').length,
        flaggedItems: items.filter(item => item.flagged).length,
        activeUsers: users.filter(user => user.totalSwaps > 0).length,
        newUsersToday: users.filter(user => new Date(user.createdAt) >= todayStart).length,
        newUsersThisWeek: users.filter(user => new Date(user.createdAt) >= weekStart).length,
        newUsersThisMonth: users.filter(user => new Date(user.createdAt) >= monthStart).length,
        itemsListedToday: items.filter(item => new Date(item.createdAt) >= todayStart).length,
        itemsListedThisWeek: items.filter(item => new Date(item.createdAt) >= weekStart).length,
        itemsListedThisMonth: items.filter(item => new Date(item.createdAt) >= monthStart).length,
        swapsCompletedToday: swaps.filter(swap => 
            swap.status === 'completed' && new Date(swap.completedAt) >= todayStart
        ).length,
        swapsCompletedThisWeek: swaps.filter(swap => 
            swap.status === 'completed' && new Date(swap.completedAt) >= weekStart
        ).length,
        swapsCompletedThisMonth: swaps.filter(swap => 
            swap.status === 'completed' && new Date(swap.completedAt) >= monthStart
        ).length,
        averageUserRating: users.reduce((sum, user) => sum + user.rating, 0) / users.length,
        totalPointsInCirculation: users.reduce((sum, user) => sum + user.points, 0)
    };
}

// Data export/import functions
function exportData() {
    return JSON.stringify(dataStore, null, 2);
}

function importData(jsonData) {
    try {
        const importedData = JSON.parse(jsonData);
        dataStore = importedData;
        saveDataStore();
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

// Clear all data (for testing/reset)
function clearAllData() {
    dataStore = {
        users: [],
        items: [],
        swaps: [],
        categories: [],
        nextId: 1
    };
    localStorage.removeItem('reWearData');
    initializeDefaultData();
}

// Initialize data store when this script loads
initializeDataStore();

// Make functions available globally
window.ReWearData = {
    // User functions
    createUser,
    getUserById,
    getUserByEmail,
    getAllUsers,
    updateUser,
    updateUserPoints,
    awardPoints,
    
    // Item functions
    createItem,
    getItemById,
    getAllItems,
    getUserItems,
    updateItem,
    updateItemStatus,
    updateItemAvailability,
    incrementItemViews,
    deleteItem,
    flagItem,
    
    // Swap functions
    createSwap,
    getSwapById,
    getAllSwaps,
    getUserSwaps,
    updateSwapStatus,
    
    // Category functions
    getAllCategories,
    getCategoryById,
    
    // Search and filter
    searchItems,
    sortItems,
    
    // Analytics
    getAnalytics,
    
    // Utility
    exportData,
    importData,
    clearAllData,
    generateId
};
