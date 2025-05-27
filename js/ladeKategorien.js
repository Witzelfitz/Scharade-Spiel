document.addEventListener('DOMContentLoaded', () => {
  const kategorienContainer = document.getElementById('kategorienContainer');

  fetch('/api/kategorien')
    .then(res => {
      if (!res.ok) throw new Error('Fehler beim Abrufen der Kategorien');
      return res.json();
    })
    .then(kategorien => {
      kategorienContainer.innerHTML = '';

      if (kategorien.length === 0) {
        kategorienContainer.innerHTML = '<p>Keine Kategorien verfügbar</p>';
        return;
      }

      // Kategorien nach ID_Kategorie sortieren
      kategorien.sort((a, b) => a.ID_Kategorie - b.ID_Kategorie);

      kategorien.forEach(kategorie => {
        const label = document.createElement('label');
        // value hier ID_Kategorie, Text Kategorie_Name
        label.innerHTML = `<input type="radio" name="kategorie" value="${kategorie.ID_Kategorie}"> ${kategorie.Kategorie_Name}`;
        kategorienContainer.appendChild(label);
      });

      document.querySelectorAll('input[name="kategorie"]').forEach((radio) => {
        radio.addEventListener('change', (event) => {
          const selectedLabel = kategorien.find(k => k.ID_Kategorie == event.target.value).Kategorie_Name;
          document.getElementById('dropdown-label').textContent = selectedLabel;
          kategorienContainer.classList.add('hidden');
        });
      });
    })
    .catch(err => {
      kategorienContainer.innerHTML = '<p>Fehler beim Laden der Kategorien</p>';
      console.error(err);
    });
});

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