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

      kategorien.sort((a, b) => a.ID_Kategorie - b.ID_Kategorie);

      kategorien.forEach(kategorie => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="kategorie" value="${kategorie.ID_Kategorie}"> ${kategorie.Kategorie_Name}`;
        kategorienContainer.appendChild(label);
      });

      // Event Listener für Auswahl
      document.querySelectorAll('input[name="kategorie"]').forEach((radio) => {
        radio.addEventListener('change', (event) => {
          const selectedId = event.target.value;
          const selectedLabel = kategorien.find(k => k.ID_Kategorie == selectedId).Kategorie_Name;

          // UI aktualisieren
          document.getElementById('dropdown-label').textContent = selectedLabel;
          kategorienContainer.classList.add('hidden');

          // In localStorage speichern (einheitlicher Key)
          localStorage.setItem('selectedKategorie', selectedId);
          localStorage.setItem('selectedKategorieName', selectedLabel);
          console.log('Kategorie gespeichert:', selectedId, selectedLabel);
        });
      });

      // Label mit gespeicherter Kategorie aktualisieren
      const gespeicherteKategorieId = localStorage.getItem('selectedKategorie');
      if (gespeicherteKategorieId) {
        const gespeicherteKategorie = kategorien.find(k => k.ID_Kategorie == gespeicherteKategorieId);
        if (gespeicherteKategorie) {
          document.getElementById('dropdown-label').textContent = gespeicherteKategorie.Kategorie_Name;

          // Radiobutton der gespeicherten Kategorie vorab aktivieren
          const radio = document.querySelector(`input[name="kategorie"][value="${gespeicherteKategorieId}"]`);
          if (radio) radio.checked = true;
        }
      }
    })
    .catch(err => {
      kategorienContainer.innerHTML = '<p>Fehler beim Laden der Kategorien</p>';
      console.error(err);
    });
});