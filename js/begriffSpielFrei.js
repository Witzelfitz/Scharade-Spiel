document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title');
  const autorText = document.getElementById('autorText');
  const nextBtn = document.querySelector('.btn-confirm');
  const playedCount = document.getElementById('playedCount');
  const roundTimer = document.getElementById('roundTimer');
  const statusMessage = document.getElementById('statusMessage');

  let begriffQueue = [];
  let cooldown = false;
  let keineBegriffeMehr = false;
  let played = 0;
  let timerInterval = null;
  let timeLeft = 0;

  const roundTime = parseInt(localStorage.getItem('roundTime') || '0', 10);

  if (roundTime > 0 && roundTimer) {
    timeLeft = roundTime;
    roundTimer.classList.remove('hidden');
    roundTimer.textContent = `⏱ ${timeLeft}s`;
  }

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

  function startTimer() {
    if (roundTime <= 0) return;
    clearInterval(timerInterval);
    timeLeft = roundTime;
    roundTimer.textContent = `⏱ ${timeLeft}s`;

    timerInterval = setInterval(() => {
      timeLeft -= 1;
      roundTimer.textContent = `⏱ ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        statusMessage.textContent = 'Zeit vorbei! Nächster Begriff…';
        statusMessage.classList.remove('hidden');
        setTimeout(() => {
          statusMessage.textContent = '';
          zeigeNaechstenBegriff();
          startTimer();
        }, 600);
      }
    }, 1000);
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
    played += 1;
    if (playedCount) playedCount.textContent = `Begriffe gespielt: ${played}`;

    if (begriffQueue.length < 3 && !keineBegriffeMehr) ladeBegriffe();
  }

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (cooldown || keineBegriffeMehr) return;

    zeigeNaechstenBegriff();
    startTimer();

    if (roundTime > 0) return; // keine Cooldown im Timer-Modus

    cooldown = true;
    nextBtn.disabled = true;
    nextBtn.classList.add('btn-cooldown');

    setTimeout(() => {
      cooldown = false;
      nextBtn.disabled = false;
      nextBtn.classList.remove('btn-cooldown');
    }, 2000);
  });

  ladeBegriffe();
  startTimer();
});
