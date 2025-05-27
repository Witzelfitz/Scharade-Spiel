// Dropdown-Funktionalität
  // Funktion zum Öffnen und Schliessen des Dropdowns
  function toggleDropdown() {
    const menu = document.querySelector('.dropdown-menu');
    menu.classList.toggle('hidden');
  }

  // Optional: Dropdown schliessen, wenn man ausserhalb klickt
  document.addEventListener('click', function (e) {
    const dropdown = document.querySelector('.dropdown-wrapper');
    if (!dropdown.contains(e.target)) {
      document.querySelector('.dropdown-menu').classList.add('hidden');
    }
  });