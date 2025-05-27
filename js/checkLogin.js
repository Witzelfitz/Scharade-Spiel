document.addEventListener('DOMContentLoaded', () => {
  fetch('../api/session_check.php', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = 'login.html';
      } else {
        console.log('Zugriff erlaubt für:', data.username);
        
        const userDisplay = document.querySelector('#username-display');
        if (userDisplay && data.username) {
          userDisplay.textContent = data.username;
        }
      }
    })
    .catch(err => {
      console.warn('Fehler beim Session-Check:', err);
      window.location.href = 'login.html';
    });
});
