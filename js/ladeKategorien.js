// Feedback-Message
document.getElementById('submitBegriff').addEventListener('click', async () => {
  const begriff = document.getElementById('begriffInput').value.trim();
  const kategorieRadios = document.querySelectorAll('input[name="kategorie"]:checked');
  const feedbackText = document.getElementById('feedbackText');

  if (!begriff || kategorieRadios.length === 0) {
    feedbackText.textContent = 'Bitte Begriff und Kategorie angeben.';
    feedbackText.className = 'error';
    feedbackText.classList.remove('hidden');
    return;
  }

  const ID_Kategorie = kategorieRadios[0].value;

  try {
    const res = await fetch('/api/begriff-eintragen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ begriff, ID_Kategorie })
    });

    const result = await res.json();

    if (res.ok) {
      feedbackText.textContent = 'Begriff erfolgreich gespeichert!';
      feedbackText.className = 'success';
    } else {
      feedbackText.textContent = result.message || 'Fehler beim Speichern des Begriffs.';
      feedbackText.className = 'error';
    }
  } catch (err) {
    feedbackText.textContent = 'Serverfehler. Bitte später erneut versuchen.';
    feedbackText.className = 'error';
  }

  feedbackText.classList.remove('hidden');
});