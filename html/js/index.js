(() => {
	//constants
	const TYPE_A = "a";
	const TYPE_B = "b";
	const CLASS_ACTIVE_BTN = "active-btn";
	const TIMER_INTERVAL = 1500;
	const EL_A = document.getElementById("a");
	const EL_B = document.getElementById("b");
	const EL_FAV_A = document.getElementById("fav-a-list");
	const EL_FAV_B = document.getElementById("fav-b-list");
	const EL_FAV_AB = document.getElementById("fav-ab-list");
	const EL_SEARCH = document.getElementById("search-list");
	const EL_SAVE_BTN_A = document.getElementById("btn-save-a");
	const EL_SAVE_BTN_B = document.getElementById("btn-save-b");
	const EL_SAVE_BTN_AB = document.getElementById("btn-save-ab");
	const EL_UPDATE_BTN_A = document.getElementById("btn-update-a");
	const EL_UPDATE_BTN_B = document.getElementById("btn-update-b");
	const EL_UPDATE_BTN_AB = document.getElementById("btn-update-ab");
	const EL_PLAY_BTN_A = document.getElementById("btn-play-a");
	const EL_PLAY_BTN_B = document.getElementById("btn-play-b");
	const EL_PLAY_BTN_AB = document.getElementById("btn-play-ab");
	const EL_STOP_BTN = document.getElementById("btn-stop");
	const EL_NEXT_BTN_A = document.getElementById("btn-next-a");
	const EL_NEXT_BTN_B = document.getElementById("btn-next-b");
	const EL_PREV_BTN_A = document.getElementById("btn-prev-a");
	const EL_PREV_BTN_B = document.getElementById("btn-prev-b");
	const EL_SEARCH_BTN = document.getElementById("btn-search");
	const EL_CALC_WIDTH_A = document.getElementById("calc-width-a");
	const EL_CALC_WIDTH_B = document.getElementById("calc-width-b");

	//variables
	const HISTORY_A = [];
	const HISTORY_B = [];
	let isFetch = false;
	let isPlayA = false;
	let isPlayB = false;
	let isPlayAB = false;
	
	// main functions
	const getRandomA = async () => {
		if (isFetch) return;
		isFetch = true; 
		try {
			const response = await fetch(`/get/random/word/${TYPE_A}`);
			const data = await response.json();
			if(data) {
				const word = data[12];
				EL_A.value = word;
				addHistory(HISTORY_A, word);
				calcWidth(EL_A, EL_CALC_WIDTH_A);
			}
		} catch (error) {
			console.error(error);
		}
		finally {
			isFetch = false;
		}	
	}

	const getRandomB = async () => {
		if (isFetch) return;
		isFetch = true; 
		try {
			const response = await fetch(`/get/random/word/${TYPE_B}`);
			const data = await response.json();
			if(data) {
				let word = data[12];
				if (data[7] === "サ変可能") word = word + "する";
				EL_B.value = word;
				addHistory(HISTORY_B, word);
				calcWidth(EL_B, EL_CALC_WIDTH_B);
			}
		} catch (error) {
			console.error(error);
		}
		finally {
			isFetch = false;
		}
	}

	const getFavABs = async () => {
		if(isFetch) return;
		isFetch = true;
		try {
			const response = await fetch(`/get/fav/abs`);
			const datas = await response.json();
			if(datas) {
				const fragment = document.createDocumentFragment();
				datas.forEach(data => {
					const li = document.createElement("li");
					const a = data[0];
					const b = data[1];
					li.textContent = `${a}を${b}`;
					const btn = document.createElement("button");
					btn.textContent = "DELETE";
					btn.dataset.a = a;
					btn.dataset.b = b;
					li.appendChild(btn);
					fragment.appendChild(li);
				});
				EL_FAV_AB.innerHTML = "";
				EL_FAV_AB.appendChild(fragment);
			}
		} catch (error) {
			console.error(error);
		}
		finally {
			isFetch = false;
		}
	}

	const getFavAs = async () => {
		if(isFetch) return;
		isFetch = true;
		try {
			const response = await fetch(`/get/fav/words/${TYPE_A}`);
			const datas = await response.json();
			if(datas) {
				const fragment = document.createDocumentFragment();
				datas.forEach(data => {
					const li = createFavList(data);
					fragment.appendChild(li);
				});
				EL_FAV_A.innerHTML = "";
				EL_FAV_A.appendChild(fragment);
			}
		} catch (error) {
			console.error(error);
		}
		finally {
			isFetch = false;
		}
	}

	const getFavBs = async () => {
		if(isFetch) return;
		isFetch = true;
		try {
			const response = await fetch(`/get/fav/words/${TYPE_B}`);
			const datas = await response.json();
			if(datas) {
				const fragment = document.createDocumentFragment();
				datas.forEach(data => {
					const li = createFavList(data);
					fragment.appendChild(li);
				});
				EL_FAV_B.innerHTML = "";
				EL_FAV_B.appendChild(fragment);
			}
		} catch (error) {
			console.error(error);
		}
		finally {
			isFetch = false;
		}
	}

	const saveFavAB = async () => {
		if(isFetch) return;
		isFetch = true;
		const a = EL_A.value;
		const b = EL_B.value;
		if(a && b) {
			try {
				const response = await fetch(`/save/fav/ab/${a}/${b}`, {method: "POST"});
				const data = await response.json();
				if(data) {
					isFetch = false;
					getFavABs();
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			isFetch = false;
		}
	}

	const saveFavA = async (event) => {
		if(isFetch) return;
		isFetch = true;
		const word = EL_A.value;
		if(word) {
			try {
				const response = await fetch(`/save/fav/word/${TYPE_A}/${word}`, {method: "POST"});
				const data = await response.json();
				if(data) {
					isFetch = false;
					getFavAs();
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			isFetch = false;
		}
	}

	const saveFavB = async (event) => {
		if(isFetch) return;
		isFetch = true;
		const word = EL_B.value;
		if(word) {
			try {
				const response = await fetch(`/save/fav/word/${TYPE_B}/${word}`, {method: "POST"});
				const data = await response.json();
				if(data) {
					isFetch = false;
					getFavBs();
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			isFetch = false;
		}
	}

	const deleteFavAB = async (event) => {
		if(isFetch) return;
		isFetch = true;
		const a = event.target.dataset.a;
		const b = event.target.dataset.b;
		if(a && b) {
			try {
				const response = await fetch(`/delete/fav/ab/${a}/${b}`, {method: "POST"});
				const data = await response.json();
				if(data) {
					isFetch = false;
					getFavABs();
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			isFetch = false;
		}
	}

	const deleteFavA = async (event) => {
		if(isFetch) return;
		isFetch = true;
		const target = event.target;
		if (target.tagName === "BUTTON" && target.dataset.type === "delete") {
			const word = target.parentNode.querySelector("span").textContent;
			try {
				const response = await fetch(`/delete/fav/word/${TYPE_A}/${word}`, {method: "POST"});
				const data = await response.json();
				if(data) {
					isFetch = false;
					getFavAs();
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			isFetch = false;
		}
	}

	const deleteFavB = async (event) => {
		if(isFetch) return;
		isFetch = true;
		const target = event.target;
		if (target.tagName === "BUTTON" && target.dataset.type === "delete") {
			const word = target.parentNode.querySelector("span").textContent;
			try {
				const response = await fetch(`/delete/fav/word/${TYPE_B}/${word}`, {method: "POST"});
				const data = await response.json();
				if(data) {
					isFetch = false;
					getFavBs();
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			isFetch = false;
		}
	}

	const useFavA = async (event) => {
		if(isFetch) return;
		const target = event.target;
		if (target.tagName === "BUTTON" && target.dataset.type === "use") {
			const word = target.parentNode.querySelector("span").textContent;
			EL_A.value = word;
			addHistory(HISTORY_A, word);
			calcWidth(EL_A, EL_CALC_WIDTH_A);
		}
	}

	const useFavB = async (event) => {
		if(isFetch) return;
		const target = event.target;
		if (target.tagName === "BUTTON" && target.dataset.type === "use") {
			const word = target.parentNode.querySelector("span").textContent;
			EL_B.value = word;
			addHistory(HISTORY_B, word);
			calcWidth(EL_B, EL_CALC_WIDTH_B);
		}
	}

	const prevA = () => {
		const word = EL_A.value;
		const index = HISTORY_A.indexOf(word);
		if (index > 0) {
			EL_A.value = HISTORY_A[index - 1];
			calcWidth(EL_A, EL_CALC_WIDTH_A);
		}
	}

	const prevB = () => {
		const word = EL_B.value;
		const index = HISTORY_B.indexOf(word);
		if (index > 0) {
			EL_B.value = HISTORY_B[index - 1];
			calcWidth(EL_B, EL_CALC_WIDTH_B);
		}
	}

	const nextA = () => {
		const word = EL_A.value;
		const index = HISTORY_A.indexOf(word);
		if (index !== -1) {
			const next = HISTORY_A[index + 1];
			if (next) {
				EL_A.value = next;
				calcWidth(EL_A, EL_CALC_WIDTH_A);
			}
		}
	}

	const nextB = () => {
		const word = EL_B.value;
		const index = HISTORY_B.indexOf(word);
		if (index !== -1) {
			const next = HISTORY_B[index + 1];
			if (next) {
				EL_B.value = next;
				calcWidth(EL_B, EL_CALC_WIDTH_B);
			}
		}
	}

	const stopPlayRandom = () => {
		isPlayA = false;
		isPlayB = false;
		isPlayAB = false;
		EL_PLAY_BTN_A.classList.remove(CLASS_ACTIVE_BTN);
		EL_PLAY_BTN_B.classList.remove(CLASS_ACTIVE_BTN);
		EL_PLAY_BTN_AB.classList.remove(CLASS_ACTIVE_BTN);
	}

	const playRandomA = () => {
		stopPlayRandom();
		isPlayA = true;
		EL_PLAY_BTN_A.classList.add(CLASS_ACTIVE_BTN);
	}

	const playRandomB = () => {
		stopPlayRandom();
		isPlayB = true;
		EL_PLAY_BTN_B.classList.add(CLASS_ACTIVE_BTN);
	}

	const playRandomAB = () => {
		stopPlayRandom();
		isPlayAB = true;
		EL_PLAY_BTN_AB.classList.add(CLASS_ACTIVE_BTN);
	}

	let lastTime = 0;
	const playRandom = async (timestamp) => {
		if (timestamp - lastTime >= TIMER_INTERVAL) {
			lastTime = timestamp;
			if (isPlayA) {
				await getRandomA();
			} else if (isPlayB) {
				await getRandomB();
			} else if (isPlayAB) {
				await getRandomAB();
			}
		}
		requestAnimationFrame(playRandom);
	};

	const getSearchWords = async (event) => {
		event.preventDefault();
		if (isFetch) return;
		isFetch = true;
		const matchWord = document.getElementById('match-word').value;
		const matchPosition = document.querySelector('input[name="match-position"]:checked').value;
		const matchType = document.querySelector('input[name="match-type"]:checked').value;
		if (matchWord !== "") {
			try {
				const response = await fetch(`/get/search/words/${matchType}/${matchPosition}/${matchWord}`);
				const datas = await response.json();
				if(datas) {
					const fragment = document.createDocumentFragment();
					datas.forEach(data => {
						const li = document.createElement("li");
						let word = data[12];
						if (matchType === TYPE_B && data[7] === "サ変可能") word = word + "する";
						li.textContent = word;
						li.dataset.type = matchType;
						fragment.appendChild(li);
					});
					EL_SEARCH.innerHTML = "";
					EL_SEARCH.appendChild(fragment);
				}
			} catch (error) {
				console.error(error);
			}
			finally {
				isFetch = false;
			}	
		} else {
			EL_SEARCH.innerHTML = "";
			isFetch = false;
		}
	}

	const useSearchWord = async (event) => {
		if(isFetch) return;
		const target = event.target;
		if (target.tagName === "LI") {
			const type = target.dataset.type;
			const word = target.textContent;
			if (type === TYPE_A) {
				EL_A.value = word;
				addHistory(HISTORY_A, word);
				calcWidth(EL_A, EL_CALC_WIDTH_A);
			} else if (type === TYPE_B) {
				EL_B.value = word;
				addHistory(HISTORY_B, word);
				calcWidth(EL_B, EL_CALC_WIDTH_B);
			}
		}
	}


	//initialize
	(async () => {
		await getRandomAB();
		await getFavABs();
		await getFavAs();
		await getFavBs();
		EL_FAV_AB.addEventListener("click", deleteFavAB);
		EL_FAV_A.addEventListener("click", deleteFavA);
		EL_FAV_A.addEventListener("click", useFavA);
		EL_FAV_B.addEventListener("click", deleteFavB);
		EL_FAV_B.addEventListener("click", useFavB);
		EL_SAVE_BTN_A.addEventListener("click", saveFavA);
		EL_SAVE_BTN_B.addEventListener("click", saveFavB);
		EL_SAVE_BTN_AB.addEventListener("click", saveFavAB);
		EL_UPDATE_BTN_A.addEventListener("click", getRandomA);
		EL_UPDATE_BTN_B.addEventListener("click", getRandomB);
		EL_UPDATE_BTN_AB.addEventListener("click",getRandomAB);
		EL_PREV_BTN_A.addEventListener("click", prevA);
		EL_PREV_BTN_B.addEventListener("click", prevB);
		EL_NEXT_BTN_A.addEventListener("click", nextA);
		EL_NEXT_BTN_B.addEventListener("click", nextB);
		EL_PLAY_BTN_A.addEventListener("click", playRandomA);
		EL_PLAY_BTN_B.addEventListener("click", playRandomB);
		EL_PLAY_BTN_AB.addEventListener("click", playRandomAB);
		EL_STOP_BTN.addEventListener("click", stopPlayRandom);
		EL_SEARCH.addEventListener("click", useSearchWord);
		EL_SEARCH_BTN.addEventListener("click", getSearchWords);
		requestAnimationFrame(playRandom);
		document.getElementById("content").style.display = "block";
		document.getElementById("loading").style.display = "none";
	})();

	//utility functions
	async function getRandomAB() {
		await getRandomA();
		await getRandomB();
	}

	function calcWidth(wordEl, calcEl) {
		calcEl.textContent = wordEl.value;
		wordEl.style.width = calcEl.offsetWidth + "px" ;
	}
	
	function addHistory(history, word) {
		const index = history.indexOf(word);
		if (index !== -1) history.splice(index, 1);
		history.push(word);
		if (history.length >= 10) history.shift();
	}
	
	function createFavList(word) {
		const li = document.createElement("li");
		const span = document.createElement("span");
		span.textContent = word;
		li.appendChild(span);
		const deleteBtn = document.createElement("button");
		deleteBtn.dataset.type = "delete";
		deleteBtn.textContent = "DELETE";
		li.appendChild(deleteBtn);
		const useBtn = document.createElement("button");
		useBtn.dataset.type = "use";
		useBtn.textContent = "USE";
		li.appendChild(useBtn);
		return li;
	}
})();
