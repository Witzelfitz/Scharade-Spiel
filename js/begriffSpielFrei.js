document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title');
  const nextBtn = document.querySelector('.btn-confirm');
  let begriffQueue = [];
  let cooldown = false;
  let keineBegriffeMehr = false; // Flag, ob keine Begriffe mehr verfügbar sind

  const kategorieId = localStorage.getItem('selectedKategorie') || '';

  async function ladeBegriffe() {
    if (keineBegriffeMehr) {
      // Keine Begriffe mehr, keine neuen Requests
      return;
    }

    try {
      const res = await fetch(`/api/begriff/begriffZufall.php?kategorie=${kategorieId}&anzahl=7`);
      if (!res.ok) throw new Error('Fehler beim Laden der Begriffe');
      const data = await res.json();

      if (data.status !== 'success') throw new Error('Serverfehler beim Laden der Begriffe');

      if (data.begriffe.length === 0) {
        // Keine Begriffe gefunden
        title.textContent = 'Keine Begriffe in dieser Kategorie vorhanden.';
        keineBegriffeMehr = true; // Flag setzen, keine weiteren Anfragen mehr
        nextBtn.disabled = true;   // Button deaktivieren
        return;
      }

      begriffQueue.push(...data.begriffe);

      // Wenn gerade noch ein Status-Text da steht, dann überschreiben wir ihn
      if (title.textContent.includes('Lade') || title.textContent === '' || title.textContent === 'Begriff') {
        zeigeNaechstenBegriff();
      }

    } catch (err) {
      console.error(err);
      title.textContent = 'Fehler beim Laden des Begriffs';
      keineBegriffeMehr = true;
      nextBtn.disabled = true;
    }
  }

  function zeigeNaechstenBegriff() {
    if (begriffQueue.length === 0) {
      if (!keineBegriffeMehr) {
        title.textContent = 'Lade weitere Begriffe...';
        ladeBegriffe();
      }
      return;
    }

    const begriff = begriffQueue.shift();
    title.textContent = begriff.Begriff_Name;

    // Nachladen wenn nur noch wenige übrig sind
    if (begriffQueue.length < 3 && !keineBegriffeMehr) ladeBegriffe();
  }

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (cooldown || keineBegriffeMehr) return;

    zeigeNaechstenBegriff();
    cooldown = true;
    nextBtn.disabled = true;

    setTimeout(() => {
      cooldown = false;
      nextBtn.disabled = false;
    }, 5000); // 5 Sekunden Cooldown
  });

  // Erste Begriffe laden
  ladeBegriffe();
});
