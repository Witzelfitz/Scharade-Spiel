let words = [];
let usedWords = [];

// Funktion, um das Modal anzuzeigen
function openModal() {
    const modal = document.getElementById('addWordModal');
    modal.style.display = 'flex';
}

// Funktion, um das Modal zu schliessen
function closeModal() {
    const modal = document.getElementById('addWordModal');
    modal.style.display = 'none';
}

// Funktion, die alle Wörter vom Server lädt
function loadWords() {
    fetch('/words')
        .then(response => response.json())
        .then(data => {
            words = data;
            usedWords = []; // Zurücksetzen der verwendeten Wörter
        });
}

// Funktion, die ein zufälliges Wort auswählt und anzeigt
function generateRandomWord() {
    if (words.length === 0) {
        alert("Keine Begriffe verfügbar. Bitte füge Begriffe hinzu.");
        return;
    }

    if (usedWords.length === words.length) {
        alert("Alle Begriffe wurden angezeigt. Neustart der Liste.");
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
    document.getElementById('wordDetails').innerText = 
        `Kategorie: ${randomWord.category} | Sprache: ${randomWord.language} | Verfasser: ${randomWord.author}`;
}

// Funktion zum Hinzufügen eines neuen Wortes zur Liste und zur Datenbank
function addNewWord() {
    const newWordInput = document.getElementById('newWordInput').value.trim();
    const categorySelect = document.getElementById('categorySelect').value;
    const languageSelect = document.getElementById('languageSelect').value;
    const authorInput = document.getElementById('authorInput').value.trim();
    const passwordInput = document.getElementById('passwordInput').value.trim();

    if (!newWordInput || !categorySelect || !languageSelect || !authorInput || !passwordInput) {
        alert("Bitte alle Felder ausfüllen.");
        return;
    }

    if (passwordInput !== "pepejeans") {
        alert("Falsches Passwort! Hinweis: Meine Lieblingshosen.");
        return;
    }

    fetch('/add-word', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            word: newWordInput,
            category: categorySelect,
            language: languageSelect,
            author: authorInput
        }),
    })
        .then(response => response.json())
        .then(data => {
            words.push(data);
            usedWords = []; // Zurücksetzen der verwendeten Wörter
            document.getElementById('newWordInput').value = '';
            document.getElementById('categorySelect').value = '';
            document.getElementById('languageSelect').value = '';
            document.getElementById('authorInput').value = '';
            document.getElementById('passwordInput').value = '';
            closeModal();
            alert(`"${data.word}" wurde zur Liste hinzugefügt!`);
        })
        .catch(error => {
            console.error("Fehler beim Hinzufügen:", error);
            alert("Fehler beim Hinzufügen des Begriffs. Bitte versuche es später erneut.");
        });
}

// Event Listener für den Button zum Generieren eines zufälligen Wortes
document.getElementById('generateButton').addEventListener('click', generateRandomWord);

// Event Listener für den Button zum Öffnen des Modals
document.getElementById('addWordButton').addEventListener('click', openModal);

// Event Listener für den Close-Button im Modal
document.querySelector('.modal-close').addEventListener('click', closeModal);

// Wörter beim Laden der Seite abrufen
loadWords();