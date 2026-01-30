document.addEventListener('DOMContentLoaded', () => {
  const confirmBtn = document.getElementById('btnBestätigen');
  const roundTimeSelect = document.getElementById('roundTime');

  if (roundTimeSelect) {
    const savedTime = localStorage.getItem('roundTime');
    if (savedTime !== null) roundTimeSelect.value = savedTime;
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const checked = Array.from(document.querySelectorAll('input[name="kategorie"]:checked'))
        .map(cb => cb.value);

      localStorage.setItem('selectedKategorien', JSON.stringify(checked));

      if (roundTimeSelect) {
        localStorage.setItem('roundTime', roundTimeSelect.value || '0');
      }

      window.location.href = "/html/spiel/Begriff-Frei.html";
    });
  }

  // Optional: Vorauswahl laden
  const gespeicherte = JSON.parse(localStorage.getItem('selectedKategorien') || '[]');
  if (gespeicherte.length > 0) {
    document.querySelectorAll('input[name="kategorie"]').forEach(cb => {
      cb.checked = gespeicherte.includes(cb.value);
    });
    const labelText = gespeicherte.length > 0 ? `${gespeicherte.length} Kategorien gewählt` : 'Auswahl öffnen';
    const labelEl = document.getElementById('dropdown-label');
    if (labelEl) labelEl.textContent = labelText;
  }
});
