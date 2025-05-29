document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title');
  const nextBtn = document.querySelector('.btn-confirm');
  let begriffQueue = [];
  let cooldown = false;

  const kategorieId = localStorage.getItem('selectedKategorie');

  async function ladeBegriffe() {
    try {
      const res = await fetch(`/api/begriffeZufall.php?kategorie=${kategorieId}&anzahl=7`);
      if (!res.ok) throw new Error('Fehler beim Laden der Begriffe');
      const begriffe = await res.json();

      begriffQueue.push(...begriffe);
      if (title.textContent === 'Begriff') zeigeNaechstenBegriff();
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

    // Nachladen wenn nur noch wenige übrig sind
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
    }, 5000); // 5 Sekunden Cooldown
  });

  // Erste Begriffe laden
  ladeBegriffe();
});