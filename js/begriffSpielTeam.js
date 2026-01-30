document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title');
  const autorText = document.getElementById('autorText');
  const roundTimer = document.getElementById('roundTimer');
  const statusMessage = document.getElementById('statusMessage');
  const teamLabel = document.getElementById('teamLabel');
  const scoreAEl = document.getElementById('scoreA');
  const scoreBEl = document.getElementById('scoreB');
  const btnCorrect = document.getElementById('btnCorrect');
  const btnSkip = document.getElementById('btnSkip');
  const btnNextTeam = document.getElementById('btnNextTeam');
  const btnLike = document.getElementById('btnLike');

  const teamA = localStorage.getItem('teamA') || 'Team A';
  const teamB = localStorage.getItem('teamB') || 'Team B';
  const rounds = parseInt(localStorage.getItem('teamRounds') || '3', 10);
  const roundTime = parseInt(localStorage.getItem('teamTime') || '60', 10);

  let scoreA = parseInt(localStorage.getItem('teamScoreA') || '0', 10);
  let scoreB = parseInt(localStorage.getItem('teamScoreB') || '0', 10);
  let currentTeam = localStorage.getItem('teamCurrent') || 'A';
  let roundIndex = parseInt(localStorage.getItem('teamRoundIndex') || '1', 10);

  let begriffQueue = [];
  let keineBegriffeMehr = false;
  let timerInterval = null;
  let timeLeft = roundTime;
  let currentBegriffId = null;

  scoreAEl.textContent = `${teamA}: ${scoreA}`;
  scoreBEl.textContent = `${teamB}: ${scoreB}`;
  teamLabel.textContent = `${currentTeam === 'A' ? teamA : teamB} ist dran (Runde ${roundIndex}/${rounds})`;
  roundTimer.textContent = `⏱ ${timeLeft}s`;

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
    timeLeft = roundTime;
    roundTimer.textContent = `⏱ ${timeLeft}s`;

    timerInterval = setInterval(() => {
      timeLeft -= 1;
      roundTimer.textContent = `⏱ ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        statusMessage.textContent = 'Zeit vorbei! Team wechseln…';
      }
    }, 1000);
  }

  function switchTeam() {
    if (currentTeam === 'A') {
      currentTeam = 'B';
    } else {
      currentTeam = 'A';
      roundIndex += 1;
    }

    if (roundIndex > rounds) {
      statusMessage.textContent = 'Spiel beendet! 🎉';
      btnCorrect.disabled = true;
      btnSkip.disabled = true;
      btnNextTeam.disabled = true;
      return;
    }

    localStorage.setItem('teamCurrent', currentTeam);
    localStorage.setItem('teamRoundIndex', String(roundIndex));

    teamLabel.textContent = `${currentTeam === 'A' ? teamA : teamB} ist dran (Runde ${roundIndex}/${rounds})`;
    statusMessage.textContent = '';
    startTimer();
    zeigeNaechstenBegriff();
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
    if (currentTeam === 'A') {
      scoreA += 1;
      scoreAEl.textContent = `${teamA}: ${scoreA}`;
      localStorage.setItem('teamScoreA', String(scoreA));
    } else {
      scoreB += 1;
      scoreBEl.textContent = `${teamB}: ${scoreB}`;
      localStorage.setItem('teamScoreB', String(scoreB));
    }
    zeigeNaechstenBegriff();
  });

  btnSkip.addEventListener('click', () => {
    zeigeNaechstenBegriff();
  });

  btnNextTeam.addEventListener('click', () => {
    switchTeam();
  });

  btnLike.addEventListener('click', likeCurrent);

  ladeBegriffe();
  startTimer();
});
