document.addEventListener('DOMContentLoaded', () => {
  // Local Storage-Eintrag für Kategorien löschen
  localStorage.removeItem('selectedKategorien');

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

      // Dropdown-Label auf Standardtext setzen
      document.getElementById('dropdown-label').textContent = 'Auswahl öffnen';

      // Hinweis: kein Wiederherstellen von Auswahl (Local Storage wurde geleert)
    })
    .catch(err => {
      kategorienContainer.innerHTML = '<p>Fehler beim Laden der Kategorien</p>';
      console.error(err);
    });
});