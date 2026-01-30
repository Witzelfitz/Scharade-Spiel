document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startZeit');
  const timeSelect = document.getElementById('timeRound');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const checked = Array.from(document.querySelectorAll('input[name="kategorie"]:checked'))
        .map(cb => cb.value);
      localStorage.setItem('selectedKategorien', JSON.stringify(checked));
      localStorage.setItem('roundTime', timeSelect?.value || '60');
      window.location.href = '/html/spiel/Begriff-Zeit.html';
    });
  }
});
