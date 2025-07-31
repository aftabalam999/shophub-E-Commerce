// Admin authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupAdminLoginForm();
});

// Admin credentials (in real app, this would be properly secured)
const ADMIN_CREDENTIALS = {
    email: 'adminaftabalam@shophub.com',
    password: 'adminaftab123'
};

// Check if admin is authenticated
function isAdminAuthenticated() {
    return localStorage.getItem('adminAuthenticated') === 'true';
}

// Check admin authentication on admin pages
function checkAdminAuth() {
    // Skip auth check on login page
    if (window.location.pathname.includes('login.html')) {
        return;
    }

    if (!isAdminAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Setup admin login form
function setupAdminLoginForm() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAdminLogin();
        });
    }
}

// Handle admin login
function handleAdminLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        
        showAlert('Admin login successful!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showAlert('Invalid admin credentials!', 'danger');
    }
}

// Admin logout
function logout() {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    showAlert('Logged out successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Show alert function for admin pages
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