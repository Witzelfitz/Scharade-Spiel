<p align="center">
  <img src="./0_media/bilder/Logo%20Happy%20Scharade%20V1%20white.svg" alt="Scharade Logo" width="150">
</p>

# 🎭 Scharade WebApp

## Lokales Setup (SQLite)
1) Stelle sicher, dass PHP mit SQLite aktiviert ist (PDO SQLite).
2) Starte lokal: `php -S localhost:8000`
3) Öffne `http://localhost:8000`
4) Beim ersten Start wird `system/scharade.sqlite` automatisch erstellt.

Willkommen zur **Scharade WebApp** – einer Plattform, um Begriffe für das Theaterspiel Scharade zu erhalten. <br>
🔗 [Zur Website](https://scharade.happyscharade.ch)

---

## 📋 Inhaltsverzeichnis

- [🎯 Ziel der WebApp](#-ziel-der-webapp)
- [✨ Features](#-features)
- [🧰 Verwendete Tools](#-verwendete-tools)
- [📚 Learnings](#-learnings)
- [🐞 Herausforderungen](#-herausforderungen)
- [🤖 Einsatz von KI](#-einsatz-von-ki)
- [📎 Externe Quellen](#-externe-quellen)
- [📄 Lizenz](#-lizenz)

---

## 🎯 Ziel der WebApp

> Scharade ist ein Spiel, bei dem Begriffe pantomimisch dargestellt und erraten werden.  
> Damit das auch spontan, ortsunabhängig und ohne Vorbereitung möglich ist, habe ich eine WebApp entwickelt, in der man Begriffe speichern, abrufen und direkt verwenden kann.

---

## ✨ Features

- ✅ Registrierung und Login
- ➕ Begriffe zur Datenbank hinzufügen
- 🗂️ Kategorien auswählen:
  - Eine oder mehr
  - Keine Auswahl = alle Kategorien
- 🔀 Zufällige Begriffe abrufen (Autor wird auch angezeigt)
- 🎮 Spielmodi:
  - Freies Spiel
  - Weitere geplant (z. B. Zeitmodus, Teams, Extras)

---

## 🧰 Verwendete Tools

- **Visual Studio Code** – Code Editor  
- **FileZilla** – FTP-Client  
- **PHP** – Backend  
- **SQLite** – Datenbank (lokal)  
- **JavaScript** – Frontend-Logik  
- **HTML/CSS** – Struktur & Design  

---

## 📚 Learnings

- JavaScript, PHP und SQL im Zusammenspiel zu nutzen, war ein grosser Lernschritt.
- Ich habe durch KI gelernt, wie man API-Endpunkte erstellt und Daten sicher verarbeitet.
- Die Organisation von Begriffen über Kategorien hat mein Verständnis für Datenbankstrukturen vertieft und was man darauf achten muss.

---

## 🐞 Herausforderungen

- 🔁 **Wiederholtes Einfügen von Code in ChatGPT**  
  Besonders bei vielen zusammenhängenden Dateien wurde es mühsam, alle relevanten Abschnitte bereitzustellen.

- 📂 **Komplexe Dateistruktur & Pfadangaben**  
  Das korrekte Verlinken von Dateien und Ressourcen wurde bei wachsender Projektstruktur zunehmend fehleranfällig.

- ♻️ **Änderungen in bestehenden JS- und PHP-Dateien**  
  Anpassungen an früher geschriebenem Code führten oft zu unerwarteten Seiteneffekten und erforderten erneutes Testen.

- 🗃️ **Probleme mit LocalStorage**  
  Beim Zwischenspeichern ausgewählter Kategorien wurden Daten teils nicht korrekt übernommen oder beim Laden ignoriert.

- 🐞 **Intensives Bugtesting erforderlich**  
  Häufige Kontrollläufe waren notwendig, um Fehler in Logik und UI zu entdecken und zu beheben.

---

## 🤖 Einsatz von KI

**ChatGPT 4.0o** war ein zentrales Werkzeug bei der Entwicklung.

**Beispielprompt:**  
> „Schreibe eine PHP-Funktion, die einen neuen Begriff in die Datenbank einträgt. Dabei soll geprüft werden, ob alle Felder ausgefüllt sind.“

**Genutzte Funktionen:**

- PHP- und SQL-Skripte schreiben
- Fehler analysieren und beheben
- Features schrittweise umsetzen
- Konzepte und Code erklären lassen

Trotz KI war eigenes Verständnis entscheidend – nicht alles funktioniert auf Anhieb.

---

## 📎 Externe Quellen

- [Markdown Guide](https://www.markdownguide.org/)
- [MDN Web Docs – JavaScript](https://developer.mozilla.org/de/docs/Web/JavaScript)
- [PHP Dokumentation](https://www.php.net/docs.php)
- [SQLite Doku](https://www.sqlite.org/docs.html)
- [Semantic UI Dokumentation](https://semantic-ui.com/introduction/getting-started.html)

---

## 📄 Lizenz

Dieses Projekt steht unter der [MIT Lizenz](https://opensource.org/licenses/MIT).  
Die Nutzung ist kostenlos für private und nicht-kommerzielle Zwecke.