(() => {
	//constants
	const TYPE_A = "a";
	const TYPE_B = "b";
	const EL_A = document.getElementById("a");
	const EL_B = document.getElementById("b");
	const EL_FAV_A = document.getElementById("fav-a");
	const EL_FAV_B = document.getElementById("fav-b");
	const EL_FAV_AB = document.getElementById("fav-ab");
	const EL_SAVE_BTN_A = document.getElementById("btn-save-a");
	const EL_SAVE_BTN_B = document.getElementById("btn-save-b");
	const EL_SAVE_BTN_AB = document.getElementById("btn-save-ab");
	const EL_UPDATE_BTN_A = document.getElementById("btn-update-a");
	const EL_UPDATE_BTN_B = document.getElementById("btn-update-b");
	const EL_UPDATE_BTN_AB = document.getElementById("btn-update-ab");
	const EL_NEXT_BTN_A = document.getElementById("btn-next-a");
	const EL_NEXT_BTN_B = document.getElementById("btn-next-b");
	const EL_PREV_BTN_A = document.getElementById("btn-prev-a");
	const EL_PREV_BTN_B = document.getElementById("btn-prev-b");
	const EL_CALC_WIDTH_A = document.getElementById("calc-width-a");
	const EL_CALC_WIDTH_B = document.getElementById("calc-width-b");

	//variables
	const HISTORY_A = [];
	const HISTORY_B = [];
	let isFetch = false;
	
	// main functions
	const getRandomA = async () => {
		if (isFetch) return;
		isFetch = true; 
		try {
			const response = await fetch(`/get/random/word/${TYPE_A}`);
			const data = await response.json();
			if(data) {
				const word = eschtml(trim(data[12]));
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
				let word = eschtml(trim(data[12]));
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
					li.textContent = eschtml(`${a}を${b}`);
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
					const li = document.createElement("li");
					const word = eschtml(data);
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
					const li = document.createElement("li");
					const word = eschtml(data);
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
		const a = trim(EL_A.value);
		const b = trim(EL_B.value);
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
		const word = trim(EL_A.value);
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
		const word = trim(EL_B.value);
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
		if (event.target.tagName === "BUTTON" && event.target.dataset.type === "delete") {
			const word = event.target.parentNode.querySelector("span").textContent;
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
		if (event.target.tagName === "BUTTON" && event.target.dataset.type === "delete") {
			const word = event.target.parentNode.querySelector("span").textContent;
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
		if (event.target.tagName === "BUTTON" && event.target.dataset.type === "use") {
			const word = event.target.parentNode.querySelector("span").textContent;
			EL_A.value = word;
			addHistory(HISTORY_A, word);
			calcWidth(EL_A, EL_CALC_WIDTH_A);
		}
	}

	const useFavB = async (event) => {
		if(isFetch) return;
		if (event.target.tagName === "BUTTON" && event.target.dataset.type === "use") {
			const word = event.target.parentNode.querySelector("span").textContent;
			EL_A.value = word;
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

	const getRandomAB = async () => {
		await getRandomA();
		await getRandomB();
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
		document.getElementById("content").style.display = "block";
		document.getElementById("loading").style.display = "none";
	})();

	//utility functions
	function eschtml(str) {
		return str
		  .replace(/&/g, "&amp;")
		  .replace(/</g, "&lt;")
		  .replace(/>/g, "&gt;")
		  .replace(/"/g, "&quot;")
		  .replace(/'/g, "&#039;");
	}
	
	function trim(str) {
		return str.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
	}

	function calcWidth(wordEl, calcEl) {
		calcEl.textContent = wordEl.value;
		wordEl.style.width = calcEl.offsetWidth + "px" ;
	}
	
	function addHistory(history, word) {
		history.push(word);
		if (history.length >= 10 ) history.shift();
	}

})();