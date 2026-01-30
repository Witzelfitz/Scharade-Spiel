document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startTeam');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const teamA = document.getElementById('teamA').value.trim() || 'Team A';
      const teamB = document.getElementById('teamB').value.trim() || 'Team B';
      const rounds = parseInt(document.getElementById('teamRounds').value, 10) || 3;
      const time = parseInt(document.getElementById('teamTime').value, 10) || 60;

      const checked = Array.from(document.querySelectorAll('input[name="kategorie"]:checked'))
        .map(cb => cb.value);

      localStorage.setItem('selectedKategorien', JSON.stringify(checked));
      localStorage.setItem('teamA', teamA);
      localStorage.setItem('teamB', teamB);
      localStorage.setItem('teamRounds', String(rounds));
      localStorage.setItem('teamTime', String(time));
      localStorage.setItem('teamScoreA', '0');
      localStorage.setItem('teamScoreB', '0');
      localStorage.setItem('teamCurrent', 'A');
      localStorage.setItem('teamRoundIndex', '1');

      window.location.href = '/html/spiel/Begriff-Team.html';
    });
  }
});
