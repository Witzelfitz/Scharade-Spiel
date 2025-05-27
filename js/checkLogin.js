document.addEventListener('DOMContentLoaded', () => {
  fetch('../api/session_check.php', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      const userSpan = document.querySelector('#username-display');
      const emailSpan = document.querySelector('#email-display');
      const loginBtn = document.querySelector('.login-btn');
      const logoutBtn = document.querySelector('.logout-btn');
      const userInfo = document.querySelector('.user-info');

      if (!data.loggedIn) {
        // Nutzer nicht eingeloggt: auf Login-Seite umleiten
        window.location.href = 'login.html';
      } else {
        // Nutzer eingeloggt: Username & Email anzeigen
        if (userSpan) userSpan.textContent = data.username;
        if (emailSpan) emailSpan.textContent = data.email;

        // UI anpassen: Login verstecken, Logout zeigen, Benutzerinfo zeigen
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
