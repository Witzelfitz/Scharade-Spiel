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
