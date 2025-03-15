let startTime;
let bestScore = localStorage.getItem("bestScore") || "-";
document.getElementById("best-score").innerText = bestScore;

// Standardmodus
document.getElementById("start-button").addEventListener("click", function() {
    document.getElementById("start-button").style.display = "none";
    document.getElementById("game-info").innerText = "Warte...";
    
    setTimeout(() => {
        startTime = Date.now();
        document.getElementById("reaction-button").style.display = "block";
    }, Math.random() * 3000 + 2000);
});

document.getElementById("reaction-button").addEventListener("click", function() {
    let reactionTime = Date.now() - startTime;
    document.getElementById("game-info").innerText = `Deine Reaktionszeit: ${reactionTime} ms`;

    if (bestScore === "-" || reactionTime < bestScore) {
        bestScore = reactionTime;
        localStorage.setItem("bestScore", bestScore);
        document.getElementById("best-score").innerText = bestScore;
    }

    document.getElementById("reaction-button").style.display = "none";
    document.getElementById("start-button").style.display = "block";
});

// Multiplayer-Modus
document.getElementById("start-multiplayer").addEventListener("click", function() {
    document.getElementById("multi-result").innerText = "Warte auf Start...";

    setTimeout(() => {
        let player1 = prompt("Spieler 1: Drücke OK, wenn du bereit bist.");
        let start1 = Date.now();
        prompt("Drücke OK, sobald du den Button siehst!");
        let reaction1 = Date.now() - start1;

        let player2 = prompt("Spieler 2: Drücke OK, wenn du bereit bist.");
        let start2 = Date.now();
        prompt("Drücke OK, sobald du den Button siehst!");
        let reaction2 = Date.now() - start2;

        if (reaction1 < reaction2) {
            document.getElementById("multi-result").innerText = `🎉 ${player1} gewinnt mit ${reaction1}ms!`;
        } else {
            document.getElementById("multi-result").innerText = `🎉 ${player2} gewinnt mit ${reaction2}ms!`;
        }
    }, Math.random() * 3000 + 2000);
});

// Hardcore-Modus
document.getElementById("start-hardcore").addEventListener("click", function() {
    document.getElementById("game-info").innerText = "Achtung: Fake-Buttons sind aktiv!";
    
    setTimeout(() => {
        let fakeButton = document.createElement("button");
        fakeButton.innerText = "Klick mich!";
        fakeButton.style.background = "red";
        fakeButton.onclick = () => alert("Falscher Button! Versuch gescheitert.");
        document.getElementById("game-container").appendChild(fakeButton);
        
        startTime = Date.now();
        document.getElementById("reaction-button").style.display = "block";
    }, Math.random() * 3000 + 2000);
});

// Tägliche Challenge
const today = new Date().getDay();
const challenges = [
    "Erreiche unter 300ms!",
    "Spiele den Multiplayer-Modus!",
    "Gewinne im Hardcore-Modus!",
    "Schlage deinen Highscore!",
    "Trainiere 10 Minuten Reaktionszeit!",
    "Fordere einen Freund heraus!",
    "Spiele Reaction Rush mit geschlossenen Augen!"
];
document.getElementById("daily-challenge").innerText = `🔹 Tages-Challenge: ${challenges[today]}`;