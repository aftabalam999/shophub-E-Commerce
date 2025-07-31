// Authentication JavaScript

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    setupAuthForms();
});

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Update authentication UI
function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    if (!authSection) return;

    if (isLoggedIn()) {
        const user = getCurrentUser();
        authSection.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-1"></i>${user.name}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="viewProfile()"><i class="fas fa-user me-2"></i>Profile</a></li>
                    <li><a class="dropdown-item" href="#" onclick="viewOrders()"><i class="fas fa-shopping-bag me-2"></i>My Orders</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                </ul>
            </li>
        `;
    } else {
        authSection.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Login</a>
            </li>
        `;
    }
}

// Setup authentication forms
function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
}

// Handle login
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        showAlert('Login successful!', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showAlert('Invalid email or password!', 'danger');
    }
}

// Handle signup
function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'danger');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long!', 'danger');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) {
        showAlert('User with this email already exists!', 'danger');
        return;
    }

    // Create new user
    const newUser = {
        id: generateUserId(),
        name: name,
        email: email,
        password: password, // In real app, this should be hashed
        joinDate: new Date().toISOString(),
        isAdmin: false
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login the new user
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    showAlert('Account created successfully!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Generate user ID
function generateUserId() {
    return 'USER' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    showAlert('Logged out successfully!', 'success');
    
    // Redirect based on current page
    setTimeout(() => {
        if (window.location.pathname.includes('admin')) {
            window.location.href = '../index.html';
        } else {
            window.location.href = 'index.html';
        }
    }, 1500);
}

// Show login form
function showLoginForm() {
    document.getElementById('signupCard').style.display = 'none';
    document.querySelector('.card').style.display = 'block';
}

// Show signup form
function showSignupForm() {
    document.getElementById('signupCard').style.display = 'block';
}

// View profile (placeholder)
function viewProfile() {
    showAlert('Profile page coming soon!', 'info');
}

// View orders (placeholder)
function viewOrders() {
    showAlert('Orders page coming soon!', 'info');
}

// Initialize some sample users if none exist
function initializeSampleUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.length === 0) {
        const sampleUsers = [
            {
                id: 'USER001',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                joinDate: new Date().toISOString(),
                isAdmin: false
            },
            {
                id: 'USER002',
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                joinDate: new Date().toISOString(),
                isAdmin: false
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
}

// Call initialization
initializeSampleUsers();