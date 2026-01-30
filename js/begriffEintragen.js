document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBegriff');
  const begriffInput = document.getElementById('begriffInput');
  const feedbackText = document.getElementById('feedbackText');
  const counter = document.getElementById('begriffCounter');
  const hint = document.getElementById('begriffHint');
  const randomBtn = document.getElementById('randomBegriffBtn');

  const funIdeas = [
    'Regenschirm im Sturm',
    'Kaffeemaschine',
    'Schneemann bauen',
    'Drachen steigen',
    'U-Bahn fahren',
    'Fahrrad reparieren',
    'Weltraumtourist',
    'Kaktus umarmen',
    'Pingpong-Champion',
    'Yoga im Park',
    'Bücherstapel tragen',
    'Kofferpacken',
    'Balletttänzer',
    'Geisterbahn',
    'Wasserfall',
    'Bergsteiger',
    'Staubsauger',
    'Zirkusdirektor'
  ];

  function isValidBegriff(value) {
    const trimmed = value.trim();
    if (trimmed.length < 4 || trimmed.length > 100) return false;
    return /^[\p{L}\p{N}\s\-()!?.,:]+$/u.test(trimmed);
  }

  function updateUI() {
    const value = begriffInput.value;
    counter.textContent = `${value.length}/100`;

    if (!value) {
      hint.textContent = 'Mind. 4 Zeichen, max. 100. Buchstaben, Zahlen und einfache Zeichen.';
      hint.classList.remove('error');
      return;
    }

    if (!isValidBegriff(value)) {
      hint.textContent = 'Ungültiger Begriff: zu kurz/lang oder Sonderzeichen.';
      hint.classList.add('error');
    } else {
      hint.textContent = 'Sieht gut aus ✨';
      hint.classList.remove('error');
    }
  }

  function showFeedback(message, type = 'success') {
    feedbackText.textContent = message;
    feedbackText.className = type;
    feedbackText.classList.remove('hidden');
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Speichern…' : 'Bestätigen';
  }

  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      const idea = funIdeas[Math.floor(Math.random() * funIdeas.length)];
      begriffInput.value = idea;
      updateUI();
      begriffInput.focus();
    });
  }

  begriffInput.addEventListener('input', updateUI);
  updateUI();

  async function loadTop() {
    const list = document.getElementById('topBegriffeList');
    if (!list) return;
    try {
      const res = await fetch('/api/begriff/top.php?limit=8');
      const data = await res.json();
      if (data.status !== 'success') return;
      list.innerHTML = '';
      data.data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.Begriff_Name}</span><span class="likes">❤️ ${item.likes}</span>`;
        list.appendChild(li);
      });
    } catch (e) {
      // ignore
    }
  }

  loadTop();

  submitBtn.addEventListener('click', async () => {
    const begriff = begriffInput.value.trim();
    const selectedKategorie = document.querySelector('input[name="kategorie"]:checked');
    const ID_User = localStorage.getItem('ID_User');

    feedbackText.textContent = '';
    feedbackText.className = 'hidden';

    if (!begriff || !selectedKategorie || !ID_User || ID_User === 'null') {
      showFeedback('Bitte Begriff, Kategorie und Login prüfen.', 'error');
      return;
    }

    if (!isValidBegriff(begriff)) {
      showFeedback('Bitte einen gültigen Begriff eingeben.', 'error');
      return;
    }

    const payload = {
      begriff_name: begriff,
      ID_Kategorie: parseInt(selectedKategorie.value, 10),
      ID_User: parseInt(ID_User, 10)
    };

    try {
      setLoading(true);
      const res = await fetch('/api/begriff-eintragen.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        const messages = [
          'Begriff gespeichert! 🎉',
          'Nice! Dein Begriff ist dabei.',
          'Gespeichert — bereit fürs Spiel.'
        ];
        showFeedback(messages[Math.floor(Math.random() * messages.length)], 'success');
        begriffInput.value = '';
        document.getElementById('dropdown-label').textContent = 'Kategorie auswählen';
        document.querySelectorAll('input[name="kategorie"]').forEach(r => r.checked = false);
        updateUI();
        loadTop();
      } else if (res.status === 409) {
        showFeedback(result.message || 'Begriff existiert bereits.', 'error');
      } else {
        showFeedback(result.message || 'Fehler beim Speichern.', 'error');
      }

    } catch (err) {
      showFeedback('Serverfehler – bitte später versuchen.', 'error');
    } finally {
      setLoading(false);
    }
  });
});
