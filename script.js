let words = [];
let usedWords = [];

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

// Funktion zum Hinzufügen eines neuen Wortes zur Liste und zur Datenbank
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
            usedWords = []; // Zurücksetzen der verwendeten Wörter
            document.getElementById('newWordInput').value = '';
            document.getElementById('categorySelect').value = '';
            document.getElementById('authorInput').value = '';
            document.getElementById('passwordInput').value = '';
            alert(`"${data.word}" wurde zur Liste hinzugefügt!`);
        });
    } else if (passwordInput !== "pepejeans") {
        alert("Falsches Passwort!");
    } else {
        alert("Bitte alle Felder ausfüllen.");
    }
}

// Event Listener für den Button zum Generieren eines zufälligen Wortes
document.getElementById('generateButton').addEventListener('click', generateRandomWord);

// Event Listener für den Button zum Hinzufügen eines neuen Wortes
document.getElementById('addWordButton').addEventListener('click', addNewWord);

// Wörter beim Laden der Seite abrufen
loadWords();
