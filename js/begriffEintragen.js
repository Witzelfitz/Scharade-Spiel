document.getElementById('submitBegriff').addEventListener('click', async () => {
  const begriff = document.getElementById('begriffInput').value.trim();
  const selectedKategorie = document.querySelector('input[name="kategorie"]:checked');
  const feedbackText = document.getElementById('feedbackText');

  const ID_User = localStorage.getItem('ID_User'); // oder Cookie / Session

  // Validierung
  if (!begriff || !selectedKategorie || !ID_User) {
    feedbackText.textContent = 'Bitte Begriff, Kategorie und Login prüfen.';
    feedbackText.className = 'error';
    feedbackText.classList.remove('hidden');
    return;
  }

  const payload = {
    begriff_name: begriff,
    ID_Kategorie: selectedKategorie.value,
    ID_User: ID_User
  };

  try {
    const res = await fetch('/api/begriff-eintragen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (res.ok) {
      feedbackText.textContent = 'Begriff wurde gespeichert.';
      feedbackText.className = 'success';
      document.getElementById('begriffInput').value = '';
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