// Dropdown-Funktionalität
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
document.querySelectorAll('input[name="kategorie"]').forEach((radio) => {
  radio.addEventListener('change', (event) => {
    const selected = event.target.value;
    document.getElementById('dropdown-label').textContent = selected;
    document.querySelector('.dropdown-menu').classList.add('hidden'); // Dropdown schliessen
  });
});