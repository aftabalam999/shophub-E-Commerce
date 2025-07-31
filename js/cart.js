// Shopping cart JavaScript

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
    setupCheckout();
});

// Load cart items
function loadCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartDiv = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartDiv.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }

    cartItemsContainer.style.display = 'block';
    emptyCartDiv.style.display = 'none';
    cartSummary.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item p-3 mb-3 bg-white rounded shadow-sm">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                </div>
                <div class="col-md-4">
                    <h5 class="mb-1">${item.name}</h5>
                    <p class="text-muted mb-0">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="col-md-3">
                    <div class="input-group">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="form-control text-center" 
                               value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${item.id}, this.value)">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <small class="text-muted">Quantity</small>
                </div>
                <div class="col-md-2">
                    <div class="text-center">
                        <strong class="text-success">$${(item.price * item.quantity).toFixed(2)}</strong>
                        <br><small class="text-muted">Total</small>
                    </div>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    updateCartQuantity(productId, quantity);
}

// Update cart summary
function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 9.99 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = subtotal >= 100 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    // Update shipping text if free shipping applies
    if (subtotal >= 100) {
        document.getElementById('shipping').innerHTML = '<span class="text-success">FREE</span>';
    }
}

// Setup checkout functionality
function setupCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length === 0) {
                showAlert('Your cart is empty!', 'warning');
                return;
            }

            // Check if user is logged in
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showAlert('Please login to continue with checkout.', 'warning');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            // Process checkout
            processCheckout();
        });
    }
}

// Process checkout
function processCheckout() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create order
    const order = {
        id: generateOrderId(),
        userId: getCurrentUser().id,
        items: cart,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: 'pending',
        date: new Date().toISOString(),
        customerName: getCurrentUser().name,
        customerEmail: getCurrentUser().email
    };

    // Save order
    saveOrder(order);

    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();

    // Update analytics
    updateAnalytics(order);

    // Show success message
    showAlert('Order placed successfully! Thank you for your purchase.', 'success');
    
    // Redirect to order confirmation or home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// Generate order ID
function generateOrderId() {
    return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Save order
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Update analytics
function updateAnalytics(order) {
    let analytics = JSON.parse(localStorage.getItem('analytics')) || {
        visitors: 0,
        pageViews: 0,
        orders: 0,
        revenue: 0
    };
    
    analytics.orders += 1;
    analytics.revenue += order.total;
    
    localStorage.setItem('analytics', JSON.stringify(analytics));
}

// Continue shopping
function continueShopping() {
    window.location.href = 'products.html';
}

// Apply coupon code (placeholder functionality)
function applyCoupon() {
    const couponCode = document.getElementById('couponCode');
    if (couponCode) {
        const code = couponCode.value.trim().toUpperCase();
        
        // Sample coupon codes
        const validCoupons = {
            'SAVE10': 0.10,
            'WELCOME20': 0.20,
            'FREESHIP': 'free_shipping'
        };

        if (validCoupons[code]) {
            if (code === 'FREESHIP') {
                showAlert('Free shipping applied!', 'success');
                // Update shipping in summary
                document.getElementById('shipping').innerHTML = '<span class="text-success">FREE</span>';
            } else {
                const discount = validCoupons[code];
                showAlert(`${(discount * 100)}% discount applied!`, 'success');
                // Apply discount logic here
            }
            couponCode.value = '';
        } else {
            showAlert('Invalid coupon code!', 'danger');
        }
    }
}