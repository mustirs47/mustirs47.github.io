let startTime;
let bestScore = localStorage.getItem("bestScore") || "-";

document.getElementById("best-score").innerText = bestScore;

document.getElementById("start-button").addEventListener("click", function() {
    document.getElementById("start-button").style.display = "none";
    document.getElementById("result").innerText = "Warte...";
    
    setTimeout(() => {
        startTime = Date.now();
        document.getElementById("reaction-button").style.display = "block";
    }, Math.random() * 3000 + 2000);  // Zufällig zwischen 2-5 Sekunden warten
});

document.getElementById("reaction-button").addEventListener("click", function() {
    let reactionTime = Date.now() - startTime;
    document.getElementById("result").innerText = `Deine Reaktionszeit: ${reactionTime} ms`;

    if (bestScore === "-" || reactionTime < bestScore) {
        bestScore = reactionTime;
        localStorage.setItem("bestScore", bestScore);
        document.getElementById("best-score").innerText = bestScore;
    }

    document.getElementById("reaction-button").style.display = "none";
    document.getElementById("start-button").style.display = "block";
});