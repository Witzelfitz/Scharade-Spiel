document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBegriff');
  const begriffInput = document.getElementById('begriffInput');
  const feedbackText = document.getElementById('feedbackText');

  submitBtn.addEventListener('click', async () => {
    const begriff = begriffInput.value.trim();
    const selectedKategorie = document.querySelector('input[name="kategorie"]:checked');
    const ID_User = localStorage.getItem('ID_User');

    feedbackText.textContent = '';
    feedbackText.className = 'hidden';

    if (!begriff || !selectedKategorie || !ID_User || ID_User === 'null') {
      feedbackText.textContent = 'Bitte Begriff, Kategorie und Login prüfen.';
      feedbackText.className = 'error';
      feedbackText.classList.remove('hidden');
      return;
    }

    const payload = {
      begriff_name: begriff,
      ID_Kategorie: parseInt(selectedKategorie.value, 10),
      ID_User: parseInt(ID_User, 10)
    };

    try {
      const res = await fetch('/api/begriff-eintragen.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        feedbackText.textContent = 'Begriff wurde gespeichert.';
        feedbackText.className = 'success';
        begriffInput.value = '';
        document.getElementById('dropdown-label').textContent = 'Kategorie auswählen';
        document.querySelectorAll('input[name="kategorie"]').forEach(r => r.checked = false);
      } else if (res.status === 409) {
        feedbackText.textContent = result.message || 'Begriff existiert bereits.';
        feedbackText.className = 'error';
      } else {
        feedbackText.textContent = result.message || 'Fehler beim Speichern.';
        feedbackText.className = 'error';
      }

    } catch (err) {
      feedbackText.textContent = 'Serverfehler – bitte später versuchen.';
      feedbackText.className = 'error';
    }

    feedbackText.classList.remove('hidden');
  });
});
