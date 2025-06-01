document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title');
  const nextBtn = document.querySelector('.btn-confirm');
  let begriffQueue = [];
  let cooldown = false;

  const kategorieId = localStorage.getItem('selectedKategorie', '1');

  async function ladeBegriffe() {
    try {
      let url = '/api/begriff/begriffZufall.php?anzahl=7';
      if (kategorieId && !isNaN(kategorieId) && Number(kategorieId) > 0) {
        url += `&kategorie=${kategorieId}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fehler beim Laden der Begriffe');
      const data = await res.json();
      if (data.status !== 'success') throw new Error('Serverfehler beim Laden der Begriffe');

      begriffQueue.push(...data.begriffe);

      if (title.textContent.includes('Lade') || title.textContent === '' || title.textContent === 'Begriff') {
        zeigeNaechstenBegriff();
      }

    } catch (err) {
      console.error(err);
      title.textContent = 'Fehler beim Laden des Begriffs';
    }
  }

  function zeigeNaechstenBegriff() {
    if (begriffQueue.length === 0) {
      title.textContent = 'Lade weitere Begriffe...';
      ladeBegriffe();
      return;
    }

    const begriff = begriffQueue.shift();
    title.textContent = begriff.Begriff_Name;

    if (begriffQueue.length < 3) ladeBegriffe();
  }

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (cooldown) return;

    zeigeNaechstenBegriff();
    cooldown = true;
    nextBtn.disabled = true;

    setTimeout(() => {
      cooldown = false;
      nextBtn.disabled = false;
    }, 5000);
  });

  ladeBegriffe();
});