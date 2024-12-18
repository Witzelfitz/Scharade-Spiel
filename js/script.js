// Wörter-Liste
let words = [];
let usedWords = [];

// Seite navigieren
function navigateTo(page) {
    if (page === "free-for-all") {
        window.location.href = "/free-for-all.html";
    } else if (page === "team-battle") {
        window.location.href = "/team-battle.html";
    } else if (page === "add-word") {
        window.location.href = "/add-word.html";
    } else {
        alert("Feature coming soon!");
    }
}

// Wörter laden
function loadWords() {
    fetch('/words')
        .then(response => response.json())
        .then(data => {
            words = data;
            usedWords = []; // Reset used words
        });
}

// Wörter generieren
function generateRandomWord() {
    if (words.length === 0) return;

    if (usedWords.length === words.length) {
        alert("Alle Begriffe wurden angezeigt. Sie beginnen von vorne.");
        usedWords = [];
    }

    let randomIndex;
    let randomWord;

    do {
        randomIndex = Math.floor(Math.random() * words.length);
        randomWord = words[randomIndex];
    } while (usedWords.includes(randomWord.word));

    usedWords.push(randomWord.word);
    document.getElementById('randomWord').innerText = randomWord.word;
    document.getElementById('wordDetails').innerText = `Kategorie: ${randomWord.category} | Verfasser: ${randomWord.author}`;
}

// Neues Wort hinzufügen
function addNewWord() {
    const newWordInput = document.getElementById('newWordInput').value.trim();
    const categorySelect = document.getElementById('categorySelect').value;
    const authorInput = document.getElementById('authorInput').value.trim();
    const passwordInput = document.getElementById('passwordInput').value.trim();

    if (newWordInput && categorySelect && authorInput && passwordInput === "Pepe Jeans") {
        fetch('/add-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                word: newWordInput,
                category: categorySelect,
                author: authorInput
            }),
        })
        .then(response => response.json())
        .then(data => {
            words.push(data);
            usedWords = []; // Reset used words
            document.getElementById('newWordInput').value = '';
            document.getElementById('categorySelect').value = '';
            document.getElementById('authorInput').value = '';
            document.getElementById('passwordInput').value = '';
            alert(`"${data.word}" wurde zur Liste hinzugefügt!`);
        });
    } else if (passwordInput !== "Pepe Jeans") {
        alert("Falsches Passwort!");
    } else {
        alert("Bitte alle Felder ausfüllen.");
    }
}

// Event-Listener für Buttons
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateButton');
    const addWordButton = document.getElementById('addWordButton');

    if (generateButton) {
        generateButton.addEventListener('click', generateRandomWord);
    }

    if (addWordButton) {
        addWordButton.addEventListener('click', addNewWord);
    }

    // Wörter laden
    loadWords();
});

// Modal öffnen und schliessen für das Formular
function openModal() {
    document.getElementById('addWordModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addWordModal').style.display = 'none';
}

// Event Listener für das Formular
document.getElementById('addWordForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Verhindert das Neuladen der Seite

    const newWord = document.getElementById('newWordInput').value.trim();
    const category = document.getElementById('categorySelect').value;
    const language = document.getElementById('languageSelect').value;
    const author = document.getElementById('authorInput').value;

    if (newWord && category && language) {
        // Simuliert das Speichern des Begriffs
        console.log({
            word: newWord,
            category: category,
            language: language,
            author: author
        });
        alert(`"${newWord}" wurde erfolgreich hinzugefügt!`);
        closeModal();
    } else {
        alert('Bitte alle Felder ausfüllen.');
    }
});
