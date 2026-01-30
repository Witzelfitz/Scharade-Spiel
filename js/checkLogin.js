document.addEventListener('DOMContentLoaded', () => {
  const userSpan = document.querySelector('#username-display');
  const emailSpan = document.querySelector('#email-display');
  const loginBtn = document.querySelector('.login-btn');
  const logoutBtn = document.querySelector('#logoutBtn');
  const userInfo = document.querySelector('.user-info');

  fetch('../api/session_check.php', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = 'login.html';
      } else {
        if (userSpan) userSpan.textContent = data.username;
        if (emailSpan) emailSpan.textContent = data.email;
        if (userInfo) userInfo.classList.remove('hidden');
        if (loginBtn) loginBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
      }
    })
    .catch(err => {
      console.warn('Fehler beim Session-Check:', err);
      window.location.href = 'login.html';
    });
});
