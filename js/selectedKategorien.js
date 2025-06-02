// Weiterleitung beim Bestätigen mit Auswahl speichern
    document.getElementById('btnBestätigen').addEventListener('click', () => {
      const checked = Array.from(document.querySelectorAll('input[name="kategorie"]:checked'))
                           .map(cb => cb.value);

      localStorage.setItem('selectedKategorien', JSON.stringify(checked));

      // Weiterleitung zum Spiel mit den ausgewählten Kategorien
      window.location.href = "/html/spiel/Begriff-Frei.html";
    });

    // Optional: Vorauswahl laden, wenn vorhanden
    window.addEventListener('DOMContentLoaded', () => {
      const gespeicherte = JSON.parse(localStorage.getItem('selectedKategorien') || '[]');
      if (gespeicherte.length > 0) {
        document.querySelectorAll('input[name="kategorie"]').forEach(cb => {
          cb.checked = gespeicherte.includes(cb.value);
        });
        // Label anpassen
        const labelText = gespeicherte.length > 0 ? gespeicherte.join(', ') : 'Auswahl öffnen';
        document.getElementById('dropdown-label').textContent = labelText;
      }
    });