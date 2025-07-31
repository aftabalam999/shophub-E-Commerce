// Admin dashboard JavaScript

let salesChart;
let categoryChart;

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initializeCharts();
    loadRecentOrders();
    loadTopProducts();
});

// Load dashboard statistics
function loadDashboardData() {
    const analytics = JSON.parse(localStorage.getItem('analytics')) || {
        visitors: 0,
        pageViews: 0,
        orders: 0,
        revenue: 0
    };

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Update stats cards
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalRevenue').textContent = `$${analytics.revenue.toFixed(2)}`;
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCustomers').textContent = users.length;

    // Simulate some traffic data if not exists
    if (analytics.visitors === 0) {
        analytics.visitors = Math.floor(Math.random() * 1000) + 500;
        analytics.pageViews = analytics.visitors * 2;
        localStorage.setItem('analytics', JSON.stringify(analytics));
    }
}

// Initialize charts
function initializeCharts() {
    initializeSalesChart();
    initializeCategoryChart();
}

// Initialize sales chart
function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    // Generate sample sales data for the last 7 days
    const salesData = generateSalesData();

    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'Daily Sales ($)',
                data: salesData.values,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

// Initialize category chart
function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const categoryData = getCategoryDistribution(products);

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.values,
                backgroundColor: [
                    '#007bff',
                    '#28a745',
                    '#ffc107',
                    '#17a2b8',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Generate sales data for chart
function generateSalesData() {
    const labels = [];
    const values = [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(dateString);

        // Calculate sales for this day (simplified - using random data for demo)
        const dailySales = Math.floor(Math.random() * 1000) + 200;
        values.push(dailySales);
    }

    return { labels, values };
}

// Get category distribution
function getCategoryDistribution(products) {
    const categoryCount = {};
    
    products.forEach(product => {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    return {
        labels: Object.keys(categoryCount),
        values: Object.values(categoryCount)
    };
}

// Load recent orders
function loadRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const recentOrders = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const container = document.getElementById('recentOrders');
    if (!container) return;

    if (recentOrders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">No orders yet</td>
            </tr>
        `;
        return;
    }

    container.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="badge bg-warning">${order.status}</span></td>
        </tr>
    `).join('');
}

// Load top products
function loadTopProducts() {
    const products = JSON.parse(localStorage.getProducts()) || [];
    const topProducts = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    const container = document.getElementById('topProducts');
    if (!container) return;

    if (topProducts.length === 0) {
        container.innerHTML = '<p class="text-muted">No products available</p>';
        return;
    }

    container.innerHTML = topProducts.map(product => `
        <div class="d-flex align-items-center mb-3">
            <img src="${product.image}" alt="${product.name}" class="rounded" style="width: 50px; height: 50px; object-fit: cover;">
            <div class="ms-3 flex-grow-1">
                <h6 class="mb-0">${product.name}</h6>
                <small class="text-muted">Rating: ${product.rating}/5</small>
            </div>
            <div class="text-end">
                <strong>$${product.price.toFixed(2)}</strong>
            </div>
        </div>
    `).join('');
}

// Refresh dashboard data
function refreshDashboard() {
    loadDashboardData();
    
    // Update charts
    if (salesChart) {
        const salesData = generateSalesData();
        salesChart.data.labels = salesData.labels;
        salesChart.data.datasets[0].data = salesData.values;
        salesChart.update();
    }

    if (categoryChart) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const categoryData = getCategoryDistribution(products);
        categoryChart.data.labels = categoryData.labels;
        categoryChart.data.datasets[0].data = categoryData.values;
        categoryChart.update();
    }

    loadRecentOrders();
    loadTopProducts();

    showAlert('Dashboard refreshed!', 'success');
}

// Helper function to get products (fixing the typo in loadTopProducts)
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}