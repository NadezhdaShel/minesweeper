import { setLocalStorage, currentLang } from "./storage.js";
import { baseElement } from "./element.js";
import { square, page } from "../index.js";

const cssClases = {
    SCOREBOARD: 'scoreboard',
    TIMER: 'scoreboard__timer',
    CLICK_COUNT: 'scoreboard__clickCounter',
}

const textContent = {
    TIMER: '00:00:00',
    CLICK_COUNT: '0000',
}

class Scoreboard {
    constructor(parentNode) {
        this.parentNode = parentNode;
        this.scoreboard = baseElement('div', cssClases.SCOREBOARD, '', this.parentNode);
        this.timer = baseElement('div', cssClases.TIMER, textContent.TIMER, this.scoreboard);
        this.clickCounter = baseElement('div', cssClases.CLICK_COUNT, textContent.CLICK_COUNT, this.scoreboard);
        this.timeTick = 0;
        this.countClick = 0;
        this.isPause = false;
    }
    clear() {
        this.timerStop();
        this.timeTick = 0;
        this.countClick = 0;
        this.timer.textContent = textContent.TIMER;
        this.clickCounter.textContent = textContent.CLICK_COUNT;
    }
    timerStart(tick) {
        this.showTime(tick);
        this.time = setInterval(() => {
            if (!this.isPause) {
                this.showTime(tick);
                this.timeTick = tick;
                tick++;
            }
        }, 1000);
    }
    showTime(tick) {
        let hours = Math.floor(tick / 60 / 60);
        let min = Math.floor(tick / 60) - (hours * 60);
        let second = tick % 60;
        if (this.timer && !isNaN(tick)) {
            this.timer.textContent = `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        }
    }
    timerStop() {
        clearInterval(this.time);
    }
    changeClickCount() {
        this.countClick++;
        this.showClickCount();
    }
    showClickCount() {
        if (this.clickCounter && !isNaN(this.countClick)) {
            this.clickCounter.textContent = this.countClick.toString().padStart(4, '0');
        }
    }
}

export { Scoreboard }