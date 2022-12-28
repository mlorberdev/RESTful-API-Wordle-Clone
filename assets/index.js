!(function () {

	// Select word
	let word = [...words[Math.floor(Math.random() * words.length)]]; // pulls from words.js
	// Board setup
	const frag = document.createDocumentFragment();
	for (let i = 0; i < 30; i++) {
		let dd = document.createElement("div");
		dd.classList.add("guess");
		frag.appendChild(dd);
	}
	document.getElementById("board-container").appendChild(frag);

	// Keyboard Setup
	const layout = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "ent", "z", "x", "c", "v", "b", "n", "m", "del"];
	const fragment = document.createDocumentFragment();
	for (let i = 0; i < 28; i++) {
		let key = document.createElement("button");
		key.innerText = layout[i].toUpperCase();
		key.addEventListener("click", executeClick);
		fragment.appendChild(key);
		if (layout[i] === "p" || layout[i] === "l") fragment.appendChild(document.createElement("br"));
		if (layout[i] === "del" || layout[i] === "ent") { key.classList.add("wide"); }
	}
	document.getElementById("keyboard-container").appendChild(fragment);

	// Variables
	let def = `<a id='def' href='https://en.wiktionary.org/wiki/${word.join("")}' target='_blank'>Lookup ${word.join("").toUpperCase()} on Wiktionary ↗</a>`;
	const letters = [];
	let row = 0;
	const cells = document.querySelectorAll(".board-container div");
	const buttons = document.querySelectorAll("button");
	const stats = document.getElementById("stats");
	let sx;

	if (localStorage.getItem("statistics") === null) resetStats(); // for first-time user

	// Update stats page
	function statsPageUpdate() {
		sx = localStorage.getItem("statistics").split(",");
		sx.forEach(e => e = parseInt(e)); // change text to integer
		const sss = ["pl", "wo", "wp", "cs", "ms", "d1", "d2", "d3", "d4", "d5", "d6"];
		let ht = parseInt(document.getElementById("bars").style.height) * parseFloat(getComputedStyle(document.documentElement).fontSize);
		for (i in sss) document.getElementById(sss[i]).innerHTML = sx[i];
		for (let i = 1; i < 7; i++) {
			document.getElementById(`b${i}`).style.height = `${ht * parseInt(sx[i + 4]) / parseInt(sx[0])}px`; // set bars' inner height to % of plays
			document.getElementById(`d${i}`).innerHTML = sx[i + 4];
		}
	} statsPageUpdate();

	// Gameplay
	function executeClick() {
		const key = this.innerText;
		switch (key) {
			case "ENT": if (5 * row + 5 !== letters.length) return; else { evalGuess(); row++ } break;
			case "DEL": if (5 * row === letters.length) return; else { letters.pop(); cells[letters.length].innerText = ""; } break;
			default: if (5 * row + 5 === letters.length) return; else { cells[letters.length].innerText = key; letters.push(key.toLowerCase()); } break;
		}
		// Eval guess
		function evalGuess() {
			let gg = letters.slice(-5);
			const isValidGuess = (x) => {
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
			// Alert invalid guess
			if (isValidGuess(gg.join("")) === false) { row--; invalidGuess(); return }
			else { evalColors(); }
			function invalidGuess() { document.body.classList.add("err"); setTimeout(() => document.body.classList.remove("err"), 300); }

			// Evaluate colors & apply to board & keyboard
			function evalColors() {
				let colors = [false, false, false, false, false];
				for (i in gg) if (word.includes(gg[i])) word[i] === gg[i] ? colors[i] = "green" : colors[i] = "gold";
				if (colors.indexOf("gold") >= 0) evalGold();
				function evalGold() {
					for (i in colors) {
						if (colors[i] === "gold") {
							let N = [], G = [], W = [];
							for (j in gg) {
								let ww = word[j] === gg[i], gs = gg[i] === gg[j];
								if (gs && colors[j] === "gold") G.push(j);
								if (ww) W.push(j);
								if (gs && colors[j] === "green") N.push(j);
							}
							D = G.filter(l => !N.includes(l));
							if (D.length + N.length > W.length) {
								colors[D[Math.floor(Math.random() * D.length)]] = "gray";
								evalGold();
							}
						}
					}
				}
				for (i in colors) if (colors[i] === false) colors[i] = "gray";
				// apply colors
				for (let i = 0; i < 5; i++) {
					buttons[layout.indexOf(gg[i])].classList.add(colors[i]);
					cells[5 * row + i].classList.add(colors[i]);
				}
			}

			// Check win/loss condition
			if (row === 5 || gg.join("") === word.join("")) {
				buttons.forEach(button => button.removeEventListener("click", executeClick));
				if (row === 5 && gg.join("") !== word.join("")) {
					document.getElementById("instructions").innerHTML = `<div onclick='location.reload()'>The word was ${word.join("").toUpperCase()}! Play again?</div><div class='def'>${def}</div>`;
					updateStats(false);
				}
				if (gg.join("") === word.join("")) {
					let tt = row === 0 ? "try" : "tries";
					document.getElementById("instructions").innerHTML = `<div onclick='location.reload()'>You got it in ${row + 1} ${tt}! Play again?</div><div class='def'>${def}</div>`;
					updateStats(true, row + 1);
				}
			}
		}
	}

	// Show/Hide Statistics
	document.getElementById("statistics").addEventListener("click", () => stats.style.display === "none" ? stats.style.display = "flex" : stats.style.display = "none");

	// Update Statistics (note: localstorage sx -> "played, won, win%, curr streak, max streak, distribution (6)")
	function updateStats(win, row) {
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