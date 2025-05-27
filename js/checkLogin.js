document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html'; // Kein Token vorhanden, weiterleiten
    return;
  }

  fetch('/api/protected.php', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) throw new Error('Nicht autorisiert');
    return res.json();
  })
  .then(data => {
    console.log('Zugriff erlaubt:', data);
    // Optional: Nutzername anzeigen
    if (data.username) {
      const userDisplay = document.querySelector('#username-display');
      if (userDisplay) {
        userDisplay.textContent = data.username;
      }
    }
  })
  .catch(err => {
    console.warn('Nicht eingeloggt oder Session abgelaufen');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
});
