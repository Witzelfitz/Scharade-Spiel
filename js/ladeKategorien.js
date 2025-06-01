document.addEventListener('DOMContentLoaded', () => {
  const kategorienContainer = document.getElementById('kategorienContainer');
  const typ = kategorienContainer.dataset.typ || 'checkbox'; // Standard: checkbox

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

      kategorien.sort((a, b) => a.ID_Kategorie - b.ID_Kategorie);

      kategorien.forEach(kategorie => {
        const label = document.createElement('label');
        label.innerHTML = `
          <input type="${typ}" name="kategorie" value="${kategorie.ID_Kategorie}">
          ${kategorie.Kategorie_Name}
        `;
        kategorienContainer.appendChild(label);
      });

      if (typ === 'checkbox') {
        // Nur bei Checkboxen: Auswahl wiederherstellen und Label aktualisieren
        const gespeicherteKategorien = JSON.parse(localStorage.getItem('selectedKategorien') || '[]');
        if (gespeicherteKategorien.length > 0) {
          gespeicherteKategorien.forEach(id => {
            const checkbox = document.querySelector(`input[name="kategorie"][value="${id}"]`);
            if (checkbox) checkbox.checked = true;
          });

          const namen = kategorien
            .filter(k => gespeicherteKategorien.includes(k.ID_Kategorie.toString()))
            .map(k => k.Kategorie_Name);
          document.getElementById('dropdown-label').textContent = namen.join(', ');
        }
      }

      // Listener für Auswahl-Änderungen ist in menuDropDown.js
    })
    .catch(err => {
      kategorienContainer.innerHTML = '<p>Fehler beim Laden der Kategorien</p>';
      console.error(err);
    });
});