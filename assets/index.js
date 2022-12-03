!(function () {

    // 5-Letter Word List Rest API (deprecated: heroku removed free hosting)
    // let word = "";
    // const Http = new XMLHttpRequest();
    // const url = 'https://wrdl-dictionary-api-nodejs.herokuapp.com/';
    // Http.open("GET", url);
    // Http.send();
    // Http.onreadystatechange = (e) => {
    //     word = Http.responseText.split('"')[3];
    // }

    // Load Random Word from Dictionary
    let word = words[Math.floor(Math.random() * words.length)]; // pulls from words.js

    // Merriam-Webster API Call (for word definition)
    const Http = new XMLHttpRequest();
    const apikey = "3c16aff2-2881-4d91-8f22-84a75451848b"; // mw dictionary
    const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apikey}`; // mw
    let def;
    Http.open("GET", url);
    Http.send();
    Http.addEventListener("load", function () {
        try {
            def = Http.responseText.toString().split("{bc}")[1].split('"]')[0].replace(/\W/g, ' '); // mw
        } catch (e) {
            def = `<a href='https://en.wiktionary.org/wiki/${word}' target='_blank'>Define ${word} on Wiktionary ↗</a>`; // if not in mw, give link
        }
    });

    // Gameboard Setup
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 30; i++) {
        let dd = document.createElement("div");
        dd.classList.add("shade", "guess");
        frag.appendChild(dd);
    }
    document.getElementById("wordl-board-container").appendChild(frag);

    // Keyboard Setup
    const layout = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "del", "a", "s", "d", "f", "g", "h", "j", "k", "l", "ent", "z", "x", "c", "v", "b", "n", "m"];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 28; i++) {
        let key = document.createElement("button");
        key.classList.add("shade");
        key.innerText = layout[i].toUpperCase();
        key.addEventListener("click", executeClick);
        fragment.appendChild(key);
        if (i === 10 || i === 20) { key.classList.add("wide"); fragment.appendChild(document.createElement("br")); }
    }
    document.getElementById("keyboard-container").appendChild(fragment);

    // Variables
    const letters = [];
    let row = 0;
    const cells = document.querySelectorAll(".board-container div");
    const buttons = document.querySelectorAll("button");
    const stats = document.getElementById("stats");
    let sx;
    // const d = new Date();
    // d.setTime(d.getTime() + 31536e6);
    // let expires = "expires=" + d.toUTCString();
    // document.cookie = "wordlestats" + "=" + "cvalue" + ";" + expires + ";path=/";
    // let cookies = decodeURIComponent(document.cookie).split(";");
    // cookies.forEach(c => c = )
    console.log(document.cookie);

    if (localStorage.getItem("statistics") === null) resetStats(); // for first-time user

    // Update stats page
    function statsPageUpdate() {
        sx = localStorage.getItem("statistics").split(",");
        sx.forEach(e => e = parseInt(e)); // change text to integer
        const sss = ["pl", "wo", "wp", "cs", "ms", "d1", "d2", "d3", "d4", "d5", "d6"];
        const bbb = ["b1", "b2", "b3", "b4", "b5", "b6"];
        let ht = parseInt(document.getElementById("bars").style.height) * parseFloat(getComputedStyle(document.documentElement).fontSize);
        for (i in sss) document.getElementById(sss[i]).innerHTML = sx[i];
        for (let i = 0; i < 6; i++) document.getElementById(bbb[i]).style.height = `${ht * parseInt(sx[i + 5]) / parseInt(sx[0])}px`; // set bars' inner height to % of plays
    } statsPageUpdate();

    // Gameplay
    function executeClick() {
        const key = this.innerText;
        switch (key) {
            case "ENT": if (5 * row + 5 !== letters.length) return; else { evalGuess(); row++ } break;
            case "DEL": if (5 * row === letters.length) return; else { letters.pop(); cells[letters.length].innerText = ""; } break;
            default: if (5 * row + 5 === letters.length) return; else { cells[letters.length].innerText = key; letters.push(key.toLowerCase()); } break;
        }

        function evalGuess() {
            let gg = letters.slice(-5).join("");
            function isValidGuess(x) {
                let hi = 8635;
                let lo = 0;
                let mm = 0;
                while (lo <= hi) {
                    mm = Math.floor((hi + lo) / 2);
                    if (words[mm] === x) return true;
                    else if (x > words[mm]) lo = mm + 1;
                    else hi = mm - 1;
                }
                return false;
            }
            if (isValidGuess(gg) === false) { row--; document.body.classList.add("err"); setTimeout(() => document.body.classList.remove("err"), 500); return };
            let color;
            let check = letters.slice(-5).join('');
            for (let i = 0; i < 5; i++) {
                if (word.includes(check[i])) { word[i] !== check[i] ? color = "gold" : color = "green"; }
                else { color = "gray"; }
                buttons[layout.indexOf(check[i])].classList.add(color);
                cells[5 * row + i].classList.add(color);
            }
            if (row === 5 || check === word) {
                buttons.forEach(button => button.removeEventListener("click", executeClick));
                if (row === 5 && check !== word) {
                    document.getElementById("instructions").innerHTML = `<div class='shade reload' onclick='location.reload()'>The word was ${word}:<br>Play again?</div><div class='shade reload'>${word}: ${def}</div>`;
                    updateStats(false);
                }
                if (check === word) {
                    document.getElementById("instructions").innerHTML = `<div class='shade reload' onclick='location.reload()'>You got it in ${row + 1} tries!<br>Play again?</div><div class='shade reload'>${word}: ${def}</div>`;
                    updateStats(true, row + 1);
                }
            }
        }
    }

    // Show/Hide Statistics
    document.getElementById("statistics").addEventListener("click", () => stats.style.display === "none" ? stats.style.display = "flex" : stats.style.display = "none");

    // Update Statistics
    function updateStats(win, row) {
        // stat stored in localStorage as text
        // sx -> "played, won, win%, curr streak, max streak, distribution (6)"
        sx[0]++; // number played
        if (win === true) {
            sx[1]++; // wins
            sx[3]++; // curr streak
            if (sx[3] > sx[4]) sx[4] = sx[3]; // max streak update
        } else {
            sx[3] = 0; // reset current streak to 0
        }
        sx[2] = `${(100 * sx[1] / sx[0]).toFixed(0)}%`; // win pct
        if (row > 0) sx[sx.length - 7 + row]++; // distribution update
        localStorage.setItem("statistics", sx); // update localStorage (statistics)
        statsPageUpdate();
    }

    // Reset Statistics
    document.getElementById("reset").addEventListener("click", resetStats);
    function resetStats() { localStorage.setItem("statistics", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); statsPageUpdate(); }

})();