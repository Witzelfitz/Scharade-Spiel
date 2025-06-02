document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title');
  const autorText = document.getElementById('autorText');
  const nextBtn = document.querySelector('.btn-confirm');
  let begriffQueue = [];
  let cooldown = false;
  let keineBegriffeMehr = false;

  // Mehrere Kategorien aus localStorage
  const kategorienArray = JSON.parse(localStorage.getItem('selectedKategorien') || '[]');
  const kategorieParam = kategorienArray.length > 0 ? kategorienArray.join(',') : '';

  async function ladeBegriffe() {
    if (keineBegriffeMehr) return;

    try {
      const url = `/api/begriff/begriffZufall.php?kategorie=${encodeURIComponent(kategorieParam)}&anzahl=7`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fehler beim Laden der Begriffe');
      const data = await res.json();

      if (data.status !== 'success') throw new Error('Serverfehler beim Laden der Begriffe');

      if (data.begriffe.length === 0) {
        title.textContent = 'Keine Begriffe in den gewählten Kategorien vorhanden.';
        keineBegriffeMehr = true;
        nextBtn.disabled = true;
        return;
      }

      begriffQueue.push(...data.begriffe);

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
    autorText.textContent = `Autor: ${begriff.username || 'Unbekannt'}`;

    if (begriffQueue.length < 3 && !keineBegriffeMehr) ladeBegriffe();
  }

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (cooldown || keineBegriffeMehr) return;

    zeigeNaechstenBegriff();
    cooldown = true;
    nextBtn.disabled = true;

    nextBtn.classList.add('btn-cooldown'); // Stil anwenden

    setTimeout(() => {
      cooldown = false;
      nextBtn.disabled = false;
      nextBtn.classList.remove('btn-cooldown'); // Stil zurücksetzen
    }, 5000);
  });

  ladeBegriffe();
});