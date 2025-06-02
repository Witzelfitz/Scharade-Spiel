document.addEventListener('DOMContentLoaded', () => {
  const kategorienContainer = document.getElementById('kategorienContainer');
  const typ = kategorienContainer.dataset.typ || 'checkbox'; // Standardtyp: Checkbox

  // Kategorien vom Server abrufen
  fetch('/api/kategorien')
    .then(res => {
      if (!res.ok) throw new Error('Fehler beim Abrufen der Kategorien');
      return res.json();
    })
    .then(kategorien => {
      kategorienContainer.innerHTML = '';

      // Falls keine Kategorien zurückgegeben werden
      if (kategorien.length === 0) {
        kategorienContainer.innerHTML = '<p>Keine Kategorien verfügbar</p>';
        return;
      }

      // Sortierung nach ID
      kategorien.sort((a, b) => a.ID_Kategorie - b.ID_Kategorie);

      // Kategorien als Checkboxen oder Radios darstellen
      kategorien.forEach(kategorie => {
        const label = document.createElement('label');
        label.innerHTML = `
          <input type="${typ}" name="kategorie" value="${kategorie.ID_Kategorie}">
          ${kategorie.Kategorie_Name}
        `;
        kategorienContainer.appendChild(label);
      });

      // Nur bei Checkboxen: Vorauswahl prüfen
      if (typ === 'checkbox') {
        const gespeicherteKategorienRaw = localStorage.getItem('selectedKategorien');

        if (gespeicherteKategorienRaw) {
          const gespeicherteKategorien = JSON.parse(gespeicherteKategorienRaw);

          // Checkboxen als "checked" markieren
          gespeicherteKategorien.forEach(id => {
            const checkbox = document.querySelector(`input[name="kategorie"][value="${id}"]`);
            if (checkbox) checkbox.checked = true;
          });

          // Namen für das Dropdown-Label setzen
          const namen = kategorien
            .filter(k => gespeicherteKategorien.includes(k.ID_Kategorie.toString()))
            .map(k => k.Kategorie_Name);

          document.getElementById('dropdown-label').textContent = namen.join(', ');
        } else {
          // Keine Vorauswahl → Standardtext
          document.getElementById('dropdown-label').textContent = 'Auswahl öffnen';
        }
      }

      // Event-Listener zur Dropdown-Interaktion ist separat in menuDropDown.js
    })
    .catch(err => {
      kategorienContainer.innerHTML = '<p>Fehler beim Laden der Kategorien</p>';
      console.error(err);
    });
});
