// Funktion zum Öffnen und Schliessen des Dropdowns
function toggleDropdown() {
  const menu = document.querySelector('.dropdown-menu');
  menu.classList.toggle('hidden');
}

// Schliessen, wenn man ausserhalb klickt
document.addEventListener('click', function (e) {
  const dropdown = document.querySelector('.dropdown-wrapper');
  if (!dropdown.contains(e.target)) {
    document.querySelector('.dropdown-menu').classList.add('hidden');
  }
});

// Auswahl übernehmen und Button-Text ändern
document.addEventListener('change', (event) => {
  if (event.target.name === 'kategorie') {
    const checked = Array.from(document.querySelectorAll('input[name="kategorie"]:checked'))
                         .map(cb => cb.nextSibling.textContent.trim() || cb.value);

    const label = checked.length > 0 ? checked.join(', ') : 'Auswahl öffnen';
    document.getElementById('dropdown-label').textContent = label;
  }
});