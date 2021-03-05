let word = ""
let textarea = document.querySelector("textarea")
let findFinalResult = document.querySelector(".findFinalResult");
let numberSearchCount = document.querySelector(".numberSearchCount");
let findWordInput = document.querySelector("#findWordInput");
let replaceWordInput = document.querySelector("#replaceWordInput");
let inputForSearch = document.querySelector(".inputForSearch");
let button = document.querySelector(".button");
let submit = document.querySelector(".submit");
let copy = document.querySelector(".copy");
let clear = document.querySelector(".clear");
let countForSearch = document.querySelector(".countForSearch");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let searchButtonCount = 0
let searchButtonValue;

clear.addEventListener("click", () => {
    textarea.value = ""
})

document.addEventListener("DOMContentLoaded", () => {
    let val = setStorage("")
    setTextArea(val)
})
//move btw search.
submit.addEventListener("click", () => {
    if (textarea.value !== "") {
        word = setStorage(textarea.value)
    }

})
copy.addEventListener("click", () => {
    textarea.select()
    textarea.setSelectionRange(0, 99999)
    document.execCommand("copy")
    alert("copied")
})

next.addEventListener("click", () => changePosition(1))
prev.addEventListener("click", () => changePosition(-1))

//set storage
function setStorage(val) {
    let value
    if (val === "") {
        value = JSON.parse(localStorage.getItem("wordValue")).word
    } else {
        let data = val.replace(/(<([^>]+)>)/gi, "")
        localStorage.setItem("wordValue", JSON.stringify({ word: data }))
        value = JSON.parse(localStorage.getItem("wordValue")).word
        setTextArea(value)
    }
    return value
}
function setTextArea(value) {
    textarea.value = value
}
//select input
document.querySelector('.custom-select-wrapper').addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open');
})
for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function () {
        if (!this.classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            this.classList.add('selected');
            this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;

            let findResult = getResult(this.dataset.value);
            findFinalResult.innerHTML = findResult.value;

        }
    })
}

function getResult(value) {
    let result = {
        count: "",
        value: "",
    };
    switch (value) {
        case "longestWord":
            result.value = longestWord(word);
            break;
        case "shortestWord":
            result.value = shortestWord(word);
            break;
        case "highestNoWord":
            result.value = highestNoWord(word);
            break;
        case "leastNoWord":
            result.value = leastNoWord(word);
            break;
        case "highestNoLetter":
            result.value = highestNoLetter(word);
            break;
        case "leastNoLetter":
            result.value = leastNoLetter(word);
            break;
        case "highestNoVowel":
            result.value = highestNoVowel(word);
            break;
        case "leastNoVowel":
            result.value = leastNoVowel(word);
            break;
        case "highestNoConsonant":
            result.value = highestNoConsonant(word);
            break;
        case "leastNoConsonant":
            result.value = leastNoConsonant(word);
            break;
        default:
            result.value = "";
            break;
        case "highestNoDigit":
            result.value = highestNoDigit(word);
            break;
        case "leastNoDigit":
            result.value = leastNoDigit(word);
            break;
        case "wordCount":
            result.value = wordCount(word);
            break;
        case "letterCount":
            result.value = letterCount(word);
            break;
        case "paragraphCount":
            result.value = paragraphCount(word);
            break;
        case "readTime":
            result.value = readTime(word);
            break;
    }
    return result;
}

function changePosition(no) {
    let val = searchForWord(word, findWordInput.value);
    if (no === 1) {
        if (searchButtonCount >= val.count - 1) {

            searchButtonCount = 0
        } else {
            searchButtonCount += 1
        }
    } else if (no <= -1) {
        if (searchButtonCount === 0) {
            searchButtonCount = val.count - 1
        } else {
            searchButtonCount -= 1
        }
    }
    let lis = document.getElementsByClassName("lis")
    Array.from(lis).forEach(li => {
        li.style.color = "white"
        li.style.backgroundColor = "#5b49ac"
    })

    let currentItem
    currentItem = lis[searchButtonCount]
    currentItem.style.backgroundColor = "rgb(34, 193, 214)"
    currentItem.style.color = "white"
    console.log(currentItem.parentNode.parentNode)
    currentItem.parentNode.parentNode.scrollTop = currentItem.offsetTop - 40
    if (replaceWordInput.value !== "") {
        currentItem.innerHTML = replaceWordInput.value
        word = setStorage(inputForSearch.innerHTML)
    }
    numberSearchCount.innerHTML = searchButtonCount + 1

    searchButtonValue = val.array[searchButtonCount]

}



findWordInput.addEventListener("keyup", (e) => {
    findWord(e.target.value)

    button.style.display = "flex"
});
function findWord(strings) {
    if (strings !== "") {

        let val = searchForWord(word, strings);

        let string = val.string;
        let count = val.count;
        let div = document.createElement("div");

        if (count === 0 || count === null) {
            inputForSearch.innerHTML = word;
            countForSearch.innerHTML = 0
        } else {
            inputForSearch.innerHTML = "";
            countForSearch.innerHTML = 0
            div.innerHTML = string;

            inputForSearch.appendChild(div);
            countForSearch.innerHTML = count;
        }
    } else {
        inputForSearch.innerHTML = "";
        countForSearch.innerHTML = ""
    }
}

// search for word
function searchForWord(word, val) {
    let regex = new RegExp(val, "gi")

    let array = []
    let string = word.replace(regex, `<b class='li lis'>${val}</b>`);

    let count = Array.isArray(word.match(new RegExp(val, "gi"))) ? word.match(new RegExp(val, "gi")).length : null;
    numberSearchCount.innerHTML = 0
    return { string, count, array };
}

//longest word
function longestWord(word) {
    let arrayOfWords = sortWords(word);
    let findResult = arrayOfWords.filter(
        (word) => word.length >= arrayOfWords[arrayOfWords.length - 1].length
    );
    return removeDuplicate(findResult).join(", ");
}

//shortest word
function shortestWord(word) {
    let arrayOfWords = sortWords(word);
    let findResult = arrayOfWords.filter(
        (word) => word.length <= arrayOfWords[0].length
    );

    return removeDuplicate(findResult).join(", ");
}

// highestNoWord
function highestNoWord(word) {
    let wordSplit = splitInToWordsArray(word);
    let findHighest = useSort(wordSplit);
    let wordResultArray = findHighest.filter(
        (element) => wordSplit[element] >= wordSplit[findHighest[0]]
    );
    let result = removeDuplicate(wordResultArray).join(", ");
    return result;
}

//leastNoWord
function leastNoWord(word) {
    let wordSplit = splitInToWordsArray(word);
    let findLowest = useSort(wordSplit);
    let findResult = findLowest.filter(
        (element) =>
            wordSplit[element] <= wordSplit[findLowest[findLowest.length - 1]]
    );
    return removeDuplicate(findResult).join(", ");
}

//highestNoLetter
function highestNoLetter(word) {
    let letterSplit = splitInToLetterArray(word);
    let findHighestLetter = useSort(letterSplit);
    let findResult = findHighestLetter.filter(
        (element) => letterSplit[element] >= letterSplit[findHighestLetter[0]]
    );
    return removeDuplicate(findResult).join(", ");
}
//leastNoLetter
function leastNoLetter(word) {
    let letterSplit = splitInToLetterArray(word);
    let findHighestLetter = useSort(letterSplit);
    let findResult = findHighestLetter.filter(
        (element) =>
            letterSplit[element] <=
            letterSplit[findHighestLetter[findHighestLetter.length - 1]]
    );
    return removeDuplicate(findResult).join(", ");
}
//read time
function readTime(word) {
    const avgWordsPerMin = 250;
    let number = word.match(/\w+/g).length
    return `${Math.ceil(number / avgWordsPerMin)} mins`;
}
//paragraph count
function paragraphCount(word) {
    return word.replace(/\n$/gm, "").split(/\n/).length
}
// highestNoVowel
function highestNoVowel(word) {
    let arr = word.replace(/[^aeiou]/g, "").split("");
    let vowelObj = useReduce(arr);
    let vowelArranged = useSort(vowelObj);
    let findResult = vowelArranged.filter(
        (element) => vowelObj[element] >= vowelObj[vowelArranged[0]]
    );
    return removeDuplicate(findResult).join(", ");
}

// leastNoVowel
function leastNoVowel(word) {
    let arr = word.replace(/[^aeiou]/g, "").split("");
    let vowelObj = useReduce(arr);
    let vowelArranged = useSort(vowelObj);
    let findResult = vowelArranged.filter(
        (element) =>
            vowelObj[element] <=
            vowelObj[vowelArranged[vowelArranged.length - 1]]
    );
    return removeDuplicate(findResult).join(", ");
}

// highestNoConsonant
function highestNoConsonant(word) {
    let arr = word.replace(/[aeiou\W_\s]/g, "").split("");
    let consonantObj = useReduce(arr);
    let consonantArranged = useSort(consonantObj);
    let findResult = consonantArranged.filter(
        (element) =>
            consonantObj[element] >= consonantObj[consonantArranged[0]]
    );
    return removeDuplicate(findResult).join(", ");
}

// leastNoConsonant
function leastNoConsonant(word) {
    let arr = word.replace(/[aeiou\W_\s]/g, "").split("");
    let consonantObj = useReduce(arr);
    let consonantArranged = useSort(consonantObj);
    let findResult = consonantArranged.filter(
        (element) =>
            consonantObj[element] <=
            consonantObj[consonantArranged[consonantArranged.length - 1]]
    );
    return removeDuplicate(findResult).join(", ");
}

// highestNoDigit
function highestNoDigit(word) {
    let arr = word.replace(/[^\d]/g, "").split("");
    let digitObj = useReduce(arr);
    let digitArranged = useSort(digitObj);
    let findResult = digitArranged.filter(
        (element) => digitObj[element] >= digitObj[digitArranged[0]]
    );
    return removeDuplicate(findResult).join(", ");
}

//leastNoDigit
function leastNoDigit(word) {
    let arr = word.replace(/[^\d]/g, "").split("");
    let digitObj = useReduce(arr);
    let digitArranged = useSort(digitObj);
    let findResult = digitArranged.filter(
        (element) =>
            digitObj[element] <=
            digitObj[digitArranged[digitArranged.length - 1]]
    );
    return removeDuplicate(findResult).join(", ");
}

// word count
function wordCount(word) {
    let arr = word.replace(/[^a-zA-Z0-9\s]()/g, "").split(/\s+/g);
    return arr.length;
}

// letter count
function letterCount(word) {
    let arr = word.replace(/[^a-zA-Z0-9\s]()/g, "").split("");
    console.log(arr);
    return arr.length;
}

//special functions
function removeDuplicate(arr) {
    return [...new Set(arr)];
}

function useSort(arr) {
    return Object.keys(arr).sort((a, b) => arr[b] - arr[a]);
}
function useReduce(arr) {
    return arr.reduce((acc, cur) => {
        if (acc[cur]) {
            acc[cur]++;
        } else {
            acc[cur] = 1;
        }
        return acc;
    }, {});
}
function sortWords(word) {
    return word
        .split(/\s/g)
        .sort((a, b) => a.length - b.length);
}
function splitInToWordsArray(word) {
    let arr = word.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s/g);
    return useReduce(arr);
}
function splitInToLetterArray(word) {
    let arr = word.replace(/[^a-zA-Z0-9]/g, "").split("");
    return useReduce(arr);
}