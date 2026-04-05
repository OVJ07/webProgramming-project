// Authentication functions
const API_BASE_URL =
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'   // 🔥 local
    : 'https://webprogramming-project-zzg9.onrender.com/'; // 🚀 deployed


// ============================
// 🔁 SMART REDIRECT (WORKS EVERYWHERE)
// ============================
function redirect(path) {
  const base = window.location.pathname.includes('/modules/')
    ? '../'
    : './';

  window.location.href = base + path;
}


// ============================
// 🔐 CHECK AUTH
// ============================
function checkAuth() {
  const token = localStorage.getItem('token');

  if (!token) {
    redirect('login.html');
    return false;
  }

  return true;
}


// ============================
// 🔓 LOGIN
// ============================
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

      redirect('index.html'); // ✅ universal redirect
      return true;
    } else {
      throw new Error(data.message || 'Login failed');
    }

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}


// ============================
// 📝 REGISTER
// ============================
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

      redirect('index.html'); // ✅ universal
      return true;
    } else {
      throw new Error(data.message || 'Registration failed');
    }

  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}


// ============================
// 🚪 LOGOUT
// ============================
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  redirect('login.html'); // ✅ works everywhere
}


// ============================
// 👤 SET USER INFO
// ============================
function setUserInfo() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return;

  const nameEl = document.getElementById('user-name');
  const emailEl = document.getElementById('user-email');

  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
}


// ============================
// 🚀 INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  const isAuthPage =
    path.includes('login') || path.includes('register');

  if (isAuthPage) {

    // LOGIN
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

    // REGISTER
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
    // 🔐 PROTECTED PAGES
    if (!checkAuth()) return;

    setUserInfo();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  }
});