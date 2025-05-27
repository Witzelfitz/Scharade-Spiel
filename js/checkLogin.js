document.addEventListener('DOMContentLoaded', () => {
  fetch('../api/session_check.php', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = 'login.html';
      } else {
        const userSpan = document.querySelector('#username-display');
        const emailSpan = document.querySelector('#email-display');

        if (userSpan) userSpan.textContent = data.username;
        if (emailSpan) emailSpan.textContent = data.email;
      }
    })
    .catch(err => {
      console.warn('Fehler beim Session-Check:', err);
      window.location.href = 'login.html';
    });
});
