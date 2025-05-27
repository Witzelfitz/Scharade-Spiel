document.addEventListener('DOMContentLoaded', () => {
  const userSpan = document.querySelector('#username-display');
  const emailSpan = document.querySelector('#email-display');
  const loginBtn = document.querySelector('.login-btn');
  const logoutBtn = document.querySelector('#logoutBtn'); // Nur ein Logout-Button
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

  function logout() {
    fetch('../php/logout.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error('Netzwerkantwort nicht ok');
        return res.json();
      })
      .then(data => {
        if (data.status === 'success') {
          window.location.href = '/html/login.html';
        } else {
          alert('Logout fehlgeschlagen.');
        }
      })
      .catch((error) => {
        console.error('Logout Fehler:', error);
        alert('Logout fehlgeschlagen.');
      });
  }

  if (logoutBtn) logoutBtn.addEventListener('click', logout);
});