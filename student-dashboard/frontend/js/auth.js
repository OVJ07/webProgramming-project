// API configuration based on environment
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_BASE_URL = isLocal
  ? 'http://localhost:5000/api'
  : 'https://webprogramming-project-zzg9.onrender.com/api';

console.log("API URL:", API_BASE_URL);

// Redirect to page handling both module and root paths
function redirect(path) {
  const base = window.location.pathname.includes('/modules/')
    ? '../'
    : './';

  window.location.href = base + path;
}

// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem('token');

  if (!token) {
    redirect('login.html');
    return false;
  }

  return true;
}

// User login
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      redirect('index.html');
      return true;
    } else {
      throw new Error(data.message || 'Login failed');
    }

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// User registration
async function register(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      redirect('index.html');
      return true;
    } else {
      throw new Error(data.message || 'Registration failed');
    }

  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// User logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  redirect('login.html');
}

// Display user info in UI
function setUserInfo() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return;

  const nameEl = document.getElementById('user-name');
  const emailEl = document.getElementById('user-email');

  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
}

// Handle page load
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  const isAuthPage =
    path.includes('login') || path.includes('register');

  if (isAuthPage) {

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
          await login(email, password);
        } catch (error) {
          alert(error.message);
        }
      });
    }

    // Register form handler
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
          await register(name, email, password);
        } catch (error) {
          alert(error.message);
        }
      });
    }

  } else {
    // Protected page handlers
    if (!checkAuth()) return;

    setUserInfo();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  }
});