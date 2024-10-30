let score = 0;
let numOfElements = 0;
var WinWidth, WinHeight;
var elements = [];
var sizeOfElemnts = [];
var dir1 = [];
var dir2 = [];
var lleft = [];
var ttop = [];
var interMove;
var gameInterval;





//בדיקת כפילויות ברשימת הבחירה של הסלקט
function DuplicateNames(dName) {
    var dup = false;
    var theOptions = document.querySelectorAll("#Nameselscts>option")
    for (var i = 0; i < theOptions.length; i++) {
        if (theOptions[i].text == dName)
            dup = true;
    }
    return dup;
}
function showTbox() {
    document.getElementById("playerName").style.display = "block";
    document.getElementById("Nameselscts").selectedIndex = -1;
}
function hideTbox() {
    document.getElementById("playerName").style.display = "none";
    document.getElementById("playerName").value = "";

}
//שליפת שמות לבחירת השם
function putDetails() {
    var sName = document.querySelector("#Nameselscts")
    for (var level = 1; level < 4; level++) {
        var key = "level" + level;
        var champions = JSON.parse(localStorage.getItem(key));
        if (champions != null) {
            for (var i = 0; i < champions.length; i++) {
                duplicate = DuplicateNames(champions[i].campionName)

                if (duplicate == false) {
                    var theOption = document.createElement("option");
                    theOption.textContent = champions[i].campionName;
                    theOption.value = champions[i].campionName;
                    sName.appendChild(theOption);
                }
            }
            document.querySelector("#playerName").style.display = "none";
        }
        sessionStorage.selectedGame = Math.floor(Math.random() * 5);
        sessionStorage.elementCount = 20;
    }

    var d = document;

    if (DuplicateNames(sessionStorage.playerName) == true) {
        d.getElementById("Nameselscts").value = sessionStorage.playerName;
    }
    else
        d.getElementById("playerName").value = sessionStorage.playerName;

    d.getElementById("elementCount").value = sessionStorage.elementCount;
    d.getElementById("gameLevel").value = sessionStorage.gameLevel;


}
function openOptions() {
    document.getElementById("gameSelect").style.display = "block";
    choose();
}
function choose() {
    sessionStorage.selectedGame = document.getElementById("gameSelect").value;
}
function closeOption() {
    document.getElementById("gameSelect").style.display = "none"
    sessionStorage.selectedGame = Math.floor(Math.random() * 5);
   

}
function startGame(document) {
    if (document.getElementById("playerName").value == "" && document.getElementById("Nameselscts").value == "בחר שם")
        document.getElementById("checkName").style.display = "block";
    else {
        if (document.getElementById("playerName").value != "")
            sessionStorage.playerName = document.getElementById("playerName").value;
        else
            sessionStorage.playerName = document.getElementById("Nameselscts").value;
        sessionStorage.elementCount = parseInt(document.getElementById("elementCount").value);
        sessionStorage.gameLevel = parseInt(document.getElementById("gameLevel").value);
        window.location = "gamePage.html"
    }
}
function startNewGame(document) {
    const gameArea = document.getElementById("game-area");
    const style = getComputedStyle(gameArea)
    WinWidth = parseInt(style.width, 10);
    WinHeight = parseInt(style.height, 10);



    var F = "../img/background" + sessionStorage.selectedGame + ".png";
    gameArea.style.backgroundImage = `url(${F})`;
    var S = "../img/mouse" + sessionStorage.selectedGame + ".png";
    gameArea.style.cursor = `url(${S}),auto`;
    // Clear previous elements and reset score
    gameArea.innerHTML = "";
    numOfElements = 0;
    score = 0;
    // Display player info
    document.getElementById("playerNameDisplay").textContent = "שחקן: " + sessionStorage.playerName;
    document.getElementById("score").textContent = "ניקוד: " + score;

    // Start game interval

    gameInterval = setInterval(() => {

        if (numOfElements < sessionStorage.elementCount) {

            createAndDisplayElement(document);
            numOfElements++;
        }
        else {

            endGame(document);
        }

        ;
    }, sessionStorage.gameLevel === 1 ? 2400 : sessionStorage.gameLevel === 2 ? 1600 : 800);
    interMove = setInterval(function () {

        for (var i = 0; i <= numOfElements; i++) {
            lleft[i] = parseInt(elements[i].style.left, 10);
            lleft[i] += 3 * dir1[i];
            elements[i].style.left = lleft[i] + "px";
            if ((lleft[i] <= 0) || (lleft[i] + sizeOfElemnts[i] >= WinWidth))
                dir1[i] = -dir1[i];
            ttop[i] = parseInt(elements[i].style.top, 10);
            ttop[i] += 3 * dir2[i];
            elements[i].style.top = ttop[i] + "px";
            if ((ttop[i] <= 0) || (ttop[i] + sizeOfElemnts[i] >= WinHeight))
                dir2[i] = -dir2[i];
        }
    }, 58);


}
function createAndDisplayElement(document) {
    const element = document.createElement("img");
    element.className = "element";
    element.src = "../img/element" + sessionStorage.selectedGame + ".png";
    var sizeOfElemnt = Math.floor(Math.random() * 70) + 30;

    element.style.setProperty('width', sizeOfElemnt + 'px');
    element.style.setProperty('height', sizeOfElemnt + 'px');

    sizeOfElemnts[numOfElements] = sizeOfElemnt;

    element.style.top = Math.floor(Math.random() * (WinHeight - sizeOfElemnt)) + "px";
    element.style.left = Math.floor(Math.random() * (WinWidth - sizeOfElemnt)) + "px";
    lleft[numOfElements] = parseInt(element.style.left, 10);
    ttop[numOfElements] = parseInt(element.style.top, 10);

    var dirX = Math.floor(Math.random() * 2);
    var dirY = Math.floor(Math.random() * 2);
    dir1[numOfElements] = dirX === 0 ? -1 : 1;
    dir2[numOfElements] = dirY === 0 ? -1 : 1;

    element.addEventListener("click", () => {
        removeElement(element, document);
        incrementScore(document);
    });
    elements[numOfElements] = element;
    document.getElementById("game-area").appendChild(element);
}
function removeElement(element) {
    element.remove();

}
function incrementScore(document) {
    score += 10;
    document.getElementById("score").textContent = "ניקוד: " + score;
}
function endGame(document) {
    clearInterval(interMove);
    clearInterval(gameInterval);
    var TheImages = document.querySelectorAll("img");

    for (var i = 0; i < TheImages.length; i++) {
        const element = TheImages[i];
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
    }

    saveChampionData();

}
//הוספת אלוף חדש לרשימת האלופים
function Campion(Cname, Cpoint) {
    this.campionName = Cname;
    this.campionPoints = Cpoint;
}
function saveChampionData() {
    var cname = sessionStorage.playerName;
    var cpoints = score;
    var clevel = sessionStorage.gameLevel;
    var key = "level" + clevel;
    var NewChamp = new Campion(cname, cpoints);
    if (JSON.parse(localStorage.getItem(key)) == null) {
        champions = [];
        champions[0] = NewChamp;
        localStorage.setItem(key, JSON.stringify(champions));
    }
    else {
        var flag = false;
        var champions = JSON.parse(localStorage.getItem(key));
        var len = champions.length;
        for (var i = 0; i < len; i++) {
            if (NewChamp.campionPoints >= champions[i].campionPoints) {
                for (var j = len - 1; j >= i; j--) {
                    champions[j + 1] = champions[j];
                }
                champions[i] = NewChamp;
                flag = true;
                break;
            }

        }
        if (flag == false) {
            champions[len] = NewChamp;
        }
        if (champions.length > 10) {
            champions.pop();
        }
        localStorage.setItem(key, JSON.stringify(champions));
    }
}
function showChampions() {
    var thed = document.querySelector("#table1");
    thed.innerHTML = "";
    for (var i = 1; i < 4; i++) {
        var div = document.getElementById("table1");
        var nTable = document.createElement("table");
        div.appendChild(nTable);
        var ntr1 = document.createElement("tr");
        var nth = document.createElement("th");
        nth.innerHTML = i + "רמה";
        ntr1.appendChild(nth);
        nTable.appendChild(ntr1);
        var key = "level" + i;
        var champions = JSON.parse(localStorage.getItem(key));
        if (champions != null) {
            var len = champions.length;
            for (var j = 0; j < len; j++) {
                var nTr = document.createElement("tr");
                var nTd1 = document.createElement("td");
                nTd1.innerHTML = champions[j].campionName;
                nTr.appendChild(nTd1);
                var nTd2 = document.createElement("td");
                nTd2.innerHTML = champions[j].campionPoints;
                nTr.appendChild(nTd2);
                nTable.appendChild(nTr);
            }
        }
    }
}
function delatech() {
    localStorage.level1 = null;
    localStorage.level2 = null;
    localStorage.level3 = null;
    showChampions();
}















