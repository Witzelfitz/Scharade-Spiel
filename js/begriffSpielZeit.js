document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title');
  const autorText = document.getElementById('autorText');
  const roundTimer = document.getElementById('roundTimer');
  const statusMessage = document.getElementById('statusMessage');
  const scoreEl = document.getElementById('score');
  const btnCorrect = document.getElementById('btnCorrect');
  const btnSkip = document.getElementById('btnSkip');
  const btnLike = document.getElementById('btnLike');

  let begriffQueue = [];
  let keineBegriffeMehr = false;
  let score = 0;
  let timerInterval = null;
  let timeLeft = parseInt(localStorage.getItem('roundTime') || '60', 10);
  let currentBegriffId = null;

  if (roundTimer) roundTimer.textContent = `⏱ ${timeLeft}s`;

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
        title.textContent = 'Keine Begriffe vorhanden.';
        keineBegriffeMehr = true;
        return;
      }
      begriffQueue.push(...data.begriffe);
      if (title.textContent.includes('Lade') || title.textContent === '') {
        zeigeNaechstenBegriff();
      }
    } catch (err) {
      console.error(err);
      title.textContent = 'Fehler beim Laden des Begriffs';
      keineBegriffeMehr = true;
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
    currentBegriffId = begriff.ID_Begriff || null;
    title.textContent = begriff.Begriff_Name;
    autorText.textContent = `Autor: ${begriff.username || 'Unbekannt'}`;
    if (begriffQueue.length < 3 && !keineBegriffeMehr) ladeBegriffe();
  }

  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = parseInt(localStorage.getItem('roundTime') || '60', 10);
    roundTimer.textContent = `⏱ ${timeLeft}s`;

    timerInterval = setInterval(() => {
      timeLeft -= 1;
      roundTimer.textContent = `⏱ ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        statusMessage.textContent = 'Zeit vorbei! Neue Runde…';
        setTimeout(() => {
          statusMessage.textContent = '';
          startTimer();
          zeigeNaechstenBegriff();
        }, 700);
      }
    }, 1000);
  }

  async function likeCurrent() {
    const ID_User = parseInt(localStorage.getItem('ID_User') || '0', 10);
    if (!currentBegriffId || !ID_User) return;
    try {
      const res = await fetch('/api/begriff/like.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID_Begriff: currentBegriffId, ID_User })
      });
      const data = await res.json();
      if (data.status === 'success') {
        statusMessage.textContent = `Gefällt mir gespeichert ❤️ (${data.likes})`;
        setTimeout(() => statusMessage.textContent = '', 800);
      }
    } catch (e) {
      console.error(e);
    }
  }

  btnCorrect.addEventListener('click', () => {
    score += 1;
    scoreEl.textContent = `Punkte: ${score}`;
    zeigeNaechstenBegriff();
  });

  btnSkip.addEventListener('click', () => {
    zeigeNaechstenBegriff();
  });

  btnLike.addEventListener('click', likeCurrent);

  ladeBegriffe();
  startTimer();
});
