// Funktion zum Öffnen und Schliessen des Dropdowns
function toggleDropdown() {
  const menu = document.querySelector('.dropdown-menu');
  if (menu) menu.classList.toggle('hidden');
}

// Schliessen, wenn man ausserhalb klickt
document.addEventListener('click', function (e) {
  const dropdown = document.querySelector('.dropdown-wrapper');
  if (dropdown && !dropdown.contains(e.target)) {
    document.querySelector('.dropdown-menu')?.classList.add('hidden');
  }
});

// Auswahl übernehmen und Button-Text ändern
document.addEventListener('change', (event) => {
  if (event.target.name === 'kategorie') {
    const checked = Array.from(document.querySelectorAll('input[name="kategorie"]:checked'))
      .map(cb => cb.nextSibling.textContent.trim() || cb.value);

    let label = 'Auswahl öffnen';
    if (checked.length === 1) label = checked[0];
    if (checked.length > 1) label = `${checked.length} Kategorien gewählt`;

    const labelEl = document.getElementById('dropdown-label');
    if (labelEl) labelEl.textContent = label;
  }
});
