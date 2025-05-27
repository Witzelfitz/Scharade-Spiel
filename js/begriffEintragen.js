document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBegriff');
  const begriffInput = document.getElementById('begriffInput');
  const feedbackSection = document.getElementById('feedback-message');

  submitBtn.addEventListener('click', async () => {
    const begriff = begriffInput.value.trim();
    const selectedKategorie = document.querySelector('input[name="kategorie"]:checked');
    const ID_User = localStorage.getItem('ID_User'); // Wird beim Login gesetzt

    // Vorherige Rückmeldung zurücksetzen
    feedbackSection.textContent = '';
    feedbackSection.className = '';

    // Validierung
    if (!begriff || !selectedKategorie || !ID_User) {
      feedbackSection.textContent = 'Bitte Begriff, Kategorie und Login prüfen.';
      feedbackSection.className = 'error';
      return;
    }

    const payload = {
      begriff_name: begriff,
      ID_Kategorie: parseInt(selectedKategorie.value),
      ID_User: parseInt(ID_User)
    };

    try {
      const res = await fetch('/api/begriff-eintragen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        feedbackSection.textContent = 'Begriff wurde gespeichert.';
        feedbackSection.className = 'success';
        begriffInput.value = '';
      } else {
        feedbackSection.textContent = result.message || 'Fehler beim Speichern.';
        feedbackSection.className = 'error';
      }

    } catch (err) {
      feedbackSection.textContent = 'Serverfehler – bitte später versuchen.';
      feedbackSection.className = 'error';
    }
  });
});