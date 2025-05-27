document.addEventListener('DOMContentLoaded', () => {
  const userSpan = document.querySelector('#username-display');
  const emailSpan = document.querySelector('#email-display');
  const loginBtn = document.querySelector('.login-btn');
  const logoutBtn = document.querySelector('.logout-btn');
  const userInfo = document.querySelector('.user-info');

  // Session prüfen
  fetch('../api/session_check.php', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        // Nicht eingeloggt: Login-Seite zeigen
        window.location.href = 'login.html';
      } else {
        // Eingeloggt: Benutzerinfo anzeigen
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

  // Logout-Button Event
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      fetch('/php/logout.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            // Nach Logout zurück zur Login-Seite
            window.location.href = '/html/login.html';
          } else {
            alert('Logout fehlgeschlagen.');
          }
        })
        .catch(() => {
          alert('Logout fehlgeschlagen.');
        });
    });
  }
});