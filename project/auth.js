// auth.js  (ya path.js agar tumne waisa naam rakha hai)

// --------- Login page logic ----------

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');

  // Agar login form hi nahi hai (e.g. dashboard page), to yahan se return
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // default form submit ko rok do

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Demo credentials: admin / admin123
    if (username === 'admin' && password === 'admin123') {
      // login flag set karo, taaki dashboard par checkAuth() pass ho jaye
      localStorage.setItem('isLoggedIn', 'true');
      // dashboard par redirect
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid credentials.\nUse username: admin, password: admin123 (demo).');
    }
  });
});

// --------- Common auth helpers (saare pages ke liye) ----------

function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  // Agar login nahi hai aur page index.html nahi hai to wapas login page bhejo
  if (
    !isLoggedIn &&
    !window.location.pathname.includes('index.html') &&
    window.location.pathname !== '/'
  ) {
    window.location.href = 'index.html';
  }
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}

// Agar in pages par ho, to page load hote hi auth check karo
if (
  window.location.pathname.includes('dashboard.html') ||
  window.location.pathname.includes('courses.html') ||
  window.location.pathname.includes('subjects.html') ||
  window.location.pathname.includes('students.html') ||
  window.location.pathname.includes('marks.html') ||
  window.location.pathname.includes('attendance.html') ||
  window.location.pathname.includes('reports.html')
) {
  checkAuth();
}
