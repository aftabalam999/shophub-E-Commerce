// Main JavaScript for ShopHub

// Sample product data
const sampleProducts = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "electronics",
        price: 79.99,
        rating: 4.5,
        stock: 25,
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
        description: "High-quality wireless headphones with noise cancellation."
    },
    {
        id: 2,
        name: "Smart Fitness Tracker",
        category: "electronics",
        price: 149.99,
        rating: 4.3,
        stock: 15,
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
        description: "Track your fitness goals with this advanced smartwatch."
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        category: "clothing",
        price: 24.99,
        rating: 4.2,
        stock: 50,
        image: "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg",
        description: "Comfortable 100% cotton t-shirt in various colors."
    },
    {
        id: 4,
        name: "Modern Table Lamp",
        category: "home",
        price: 89.99,
        rating: 4.7,
        stock: 12,
        image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg",
        description: "Elegant table lamp perfect for any room."
    },
    {
        id: 5,
        name: "Yoga Mat",
        category: "sports",
        price: 34.99,
        rating: 4.4,
        stock: 30,
        image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
        description: "Non-slip yoga mat for all your fitness needs."
    },
    {
        id: 6,
        name: "JavaScript Programming Book",
        category: "books",
        price: 39.99,
        rating: 4.8,
        stock: 20,
        image: "https://images.pexels.com/photos/159711/books-book-pages-read-159711.jpeg",
        description: "Learn JavaScript programming from basics to advanced."
    },
    {
        id: 7,
        name: "Smartphone Case",
        category: "electronics",
        price: 19.99,
        rating: 4.1,
        stock: 40,
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg",
        description: "Protective case for your smartphone with elegant design."
    },
    {
        id: 8,
        name: "Denim Jacket",
        category: "clothing",
        price: 64.99,
        rating: 4.6,
        stock: 18,
        image: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg",
        description: "Classic denim jacket for casual and stylish look."
    }
];

// Initialize products in localStorage if not exists
function initializeProducts() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

// Get products from localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navigation
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Add to cart function
function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
        showAlert('Product not found!', 'danger');
        return;
    }

    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    showAlert('Product added to cart!', 'success');
}

// Remove from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== parseInt(productId));
    saveCart(cart);
    if (typeof loadCart === 'function') {
        loadCart();
    }
}

// Update cart item quantity
function updateCartQuantity(productId, quantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === parseInt(productId));
    
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart(cart);
        if (typeof loadCart === 'function') {
            loadCart();
        }
    }
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star text-warning"></i>';
    }
    
    return starsHTML;
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 3000);
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm.trim()) {
        window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Load featured products on homepage
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const products = getProducts();
    const featuredProducts = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    container.innerHTML = featuredProducts.map(product => `
        <div class="col-lg-3 col-md-6 fade-in">
            <div class="card product-card h-100 shadow-hover">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <div class="product-rating mb-2">
                        ${generateStarRating(product.rating)}
                        <small class="text-muted ms-1">(${product.rating})</small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="product-price">$${product.price}</span>
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    updateCartCount();
    loadFeaturedProducts();
    
    // Add event listener for search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});

// Analytics functions for admin
function updateVisitorCount() {
    let analytics = JSON.parse(localStorage.getItem('analytics')) || {
        visitors: 0,
        pageViews: 0,
        orders: 0,
        revenue: 0
    };
    
    analytics.visitors += 1;
    analytics.pageViews += 1;
    
    localStorage.setItem('analytics', JSON.stringify(analytics));
}