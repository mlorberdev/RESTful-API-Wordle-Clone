!(function () {

    // let word = "";
    // const Http = new XMLHttpRequest();
    // const url = 'https://wrdl-dictionary-api-nodejs.herokuapp.com/';
    // Http.open("GET", url);
    // Http.send();
    // Http.onreadystatechange = (e) => {
    //     word = Http.responseText.split('"')[3];
    // }

    let word = words[Math.floor(Math.random() * words.length)];
		
    // Gameboard
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 30; i++) { 
        let dd = document.createElement("div");
        dd.classList.add("shade", "guess");
        frag.appendChild(dd); 
    }
    document.getElementById("wordl-board-container").appendChild(frag);

    // Keyboard
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
    const cells = document.querySelectorAll(".board-container div");
    const buttons = document.querySelectorAll("button");
    const letters = [];
    let row = 0;

    // Gameplay
    function executeClick() {
        const key = this.innerText;
        switch (key) {
            case "ENT": if (5 * row + 5 !== letters.length) return; else { evalGuess(); row++} break;
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
            if (isValidGuess(gg) === false) { row--; document.body.classList.add("err"); setTimeout(()=>document.body.classList.remove("err"),500); return };
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
                if (row === 5 && check !== word) document.getElementById("instructions").innerHTML = `<button class='shade reload' onclick='location.reload()'>The word was ${word}. Play again?</button>`;
                if (check === word) document.getElementById("instructions").innerHTML = `<button class='shade reload' onclick='location.reload()'>You got it in ${row + 1} tries! Play again?</button>`;
            }
        }
    }

})();