import { page, settings, square, scoreboard } from "../index.js";
import { personal } from "./personal.js";


let currentLang = 'en';

function removeLocalStorage() {
    localStorage.removeItem('matrix');
    localStorage.removeItem('sizeSquare');
    localStorage.removeItem('time');
}
function setLocalStorage() {
    currentLang = page.language.textContent;
    localStorage.setItem('lang', page.language.textContent);
    localStorage.setItem('countMine', personal.countMine);
    localStorage.setItem('sizeSquare', personal.sizeSquare);
    localStorage.setItem('level', personal.level);
    localStorage.setItem('matrix', JSON.stringify(square.matrix));
    localStorage.setItem('countClick', scoreboard.countClick);
    localStorage.setItem('time', scoreboard.timeTick);
}

function getLocalStorage() {
    if (localStorage.getItem('lang')) {
        currentLang = localStorage.getItem('lang');
        page.toggleLangPage();
    }
    if (localStorage.getItem('countMine')) {
        personal.countMine = localStorage.getItem('countMine');
        settings.mines.value = personal.countMine;
    }
    if (localStorage.getItem('sizeSquare')) {
        personal.sizeSquare = localStorage.getItem('sizeSquare');
        settings.size.value = personal.sizeSquare;
        square.createSquare();
    }
    if (localStorage.getItem('level')) {
        personal.level = localStorage.getItem('level');
        settings.levelRadio.forEach(elem => {
            if (elem.value === personal.level) {
                elem.checked = true;
            } else {
                elem.checked = false;
            }
        })
        settings.toggleDisabledInput(personal.level);
    }
    if (localStorage.getItem('matrix')) {
        square.matrix = JSON.parse(localStorage.getItem('matrix'));
        square.restoreGame();
        if (localStorage.getItem('countClick')) {
            scoreboard.countClick = localStorage.getItem('countClick');
            scoreboard.showClickCount();
        }
        if (localStorage.getItem('time')) {
            scoreboard.timeTick = localStorage.getItem('time');
            scoreboard.isPause = true;
            scoreboard.timerStart(scoreboard.timeTick);
        }
    }
}

export { setLocalStorage, getLocalStorage, removeLocalStorage, currentLang }