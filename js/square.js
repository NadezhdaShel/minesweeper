import { baseElement } from "./element.js";
import { square, scoreboard, modal } from "../index.js";
import { removeLocalStorage, setLocalStorage } from "./storage.js";
import { personal } from "./personal.js";

const cssClases = {
    SQUARE: 'square',
    KEY: 'keyboard__key',
    CAPTION: 'keyboard__key-caption',
    CONTROL_KEY: 'keyboard__key_control',
    ACTIVE_KEY: 'keyboard__key_active',
}

const widthCell = 20;

const sellStyle = {
    WIDTH_LINE: 1,
    LINE_COLOR: 'rgb(69, 69, 71)',
    BACKGROUND_COLOR: 'rgb(212, 212, 214)',
    BACKGROUND_COLOR_OPEN: 'rgb(224, 224, 226)',
    WIDTH_SHADOW: 3,
    SHADOW_COLOR: 'rgba(69, 69, 71, 0.5)',

}

const captionStyle = {
    COLOR_1: 'black',
    COLOR_2: 'blue',
    COLOR_3: 'red',
    COLOR_4: 'green',
    COLOR_5: 'orange',
    COLOR_6: 'yelow',
    COLOR_7: 'pink',
    COLOR_8: 'brown',
    FONT: `${widthCell / 2}px sans-serif`,
}

const mineStyle = {
    COLOR: 'rgb(0, 0, 0)',
    ACTIVE_COLOR: 'rgba(214, 31, 31, 1)',
    FLAG_COLOR: 'rgb(16, 16, 201)',
    ROUND: widthCell / 5,
    SHADOW_COLOR: 'rgba(214, 31, 31, 0.6)',
}

function getRandomSet(min, max, i, j) {
    let randomSet = new Set();
    while (randomSet.size < personal.countMine) {
        let randomNumber = Math.floor(Math.random() * (max - min) + min);
        if ((i * personal.sizeSquare + j) !== randomNumber) {
            randomSet.add(randomNumber);
        }
    }
    return randomSet;
}

class Square {
    constructor(parentNode) {
        this.parentNode = parentNode;
        this.body = baseElement('canvas', cssClases.SQUARE, '', this.parentNode);
        if (this.body.getContext) {
            this.square = this.body.getContext("2d");
            this.createSquare();
        }
        this.matrix;
        this.countOpenSell = 0;
        this.addEventListener();
    }
    createMatrix(randomSet) {
        this.matrix = [];
        for (let i = 0; i < personal.sizeSquare; i++) {
            this.matrix.push([]);
            for (let j = 0; j < personal.sizeSquare; j++) {
                this.matrix[i].push({
                    isMine: false,
                    countMine: 0,
                    status: 'close', //'open','flag'
                });
                if (randomSet.has(i * personal.sizeSquare + j)) {
                    this.matrix[i][j].isMine = true;
                }
            }
        }
        this.calculationMines();
    }

    calculationMines() {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                let sum = 0;
                let n1 = ((i - 1) > 0) ? i - 1 : 0;
                let m1 = ((i + 1) < this.matrix.length) ? i + 1 : this.matrix.length - 1;
                let n2 = ((j - 1) > 0) ? j - 1 : 0;
                let m2 = ((j + 1) < this.matrix[i].length) ? j + 1 : this.matrix[i].length - 1;
                for (let a = n1; a <= m1; a++) {
                    for (let b = n2; b <= m2; b++) {
                        if (this.matrix[a][b].isMine === true) sum++;
                    }
                }
                if (this.matrix[i][j].isMine === true) sum--;
                this.matrix[i][j].countMine = sum;
            }
        }
    }
    createLine(posX, posY) {
        let grad = this.square.createLinearGradient(0, 0, this.body.width, this.body.width);
        grad.addColorStop(0, 'rgb(139, 48, 136)');
        grad.addColorStop(0.5, 'rgb(105, 58, 144)');
        grad.addColorStop(1, 'rgb(65, 65, 145)');
        this.square.lineWidth = 1;//sellStyle.WIDTH_LINE;
        this.square.strokeStyle = grad;
        this.square.beginPath();

        if (posY === null) {
            // this.square.moveTo(widthCell * posX, 0);
            // this.square.lineTo(widthCell * posX, widthCell * posY + this.body.width);
        }
        if (posX === null) {
            this.square.moveTo(0, widthCell * posY);
            this.square.lineTo(widthCell * posX + this.body.width, widthCell * posY);
        }
        this.square.closePath();
        this.square.stroke();
    }
    createSell(posX, posY) {
        this.square.lineWidth = sellStyle.WIDTH_LINE;
        this.square.strokeStyle = sellStyle.LINE_COLOR;
        this.square.strokeRect(widthCell * posX, widthCell * posY, widthCell, widthCell);
        this.square.shadowBlur = sellStyle.WIDTH_SHADOW;
        this.square.shadowColor = sellStyle.SHADOW_COLOR;
        this.square.fillStyle = sellStyle.BACKGROUND_COLOR;
        this.square.fillRect(widthCell * posX + 3, widthCell * posY + 3, widthCell - 6, widthCell - 6);
    }
    createHoverSell(posX, posY) {
        this.square.fillStyle = 'red';
        this.square.fillRect(widthCell * posX + 3, widthCell * posY + 3, widthCell - 6, widthCell - 6);
    }
    createOpenSell(posX, posY) {
        this.square.shadowBlur = 0;
        this.square.fillStyle = sellStyle.BACKGROUND_COLOR_OPEN;
        this.square.fillRect(widthCell * posX + 1, widthCell * posY + 1, widthCell - 2, widthCell - 2);
    }

    createCaption(posX, posY, text) {
        this.square.shadowBlur = 0;
        this.square.font = captionStyle.FONT;
        this.square.textAlign = 'center';
        this.square.fillStyle = captionStyle[`COLOR_${text}`];
        this.square.fillText(text, widthCell * posX + widthCell / 2, widthCell * posY + widthCell / 1.5)
    }

    createMine(posX, posY, type = 'base') {
        /** type: 'base','flag','active' */
        switch (type) {
            case 'flag':
                this.square.shadowBlur = 0;
                this.square.fillStyle = mineStyle.FLAG_COLOR;
                break;
            case 'active':
                this.square.shadowBlur = 5;
                this.square.shadowColor = mineStyle.SHADOW_COLOR;
                this.square.fillStyle = mineStyle.ACTIVE_COLOR;
                break;
            default:
                this.square.shadowBlur = 0;
                this.square.fillStyle = mineStyle.COLOR;
                break;
        }
        this.square.beginPath();
        this.square.arc(widthCell * posX + widthCell / 2, widthCell * posY + widthCell / 2, mineStyle.ROUND, 0, 2 * Math.PI);
        this.square.fill();

        let grad = this.square.createRadialGradient(widthCell * posX + widthCell / 2 + mineStyle.ROUND / 3, widthCell * posY + widthCell / 2 - mineStyle.ROUND / 3, 1, widthCell * posX + widthCell / 2, widthCell * posY + widthCell / 2, mineStyle.ROUND);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)');
        this.square.fillStyle = grad;
        this.square.beginPath();
        this.square.arc(widthCell * posX + widthCell / 2, widthCell * posY + widthCell / 2, mineStyle.ROUND, 0, 2 * Math.PI);
        this.square.fill();

    }

    createSquare() {
        this.body.width = personal.sizeSquare * widthCell;
        this.body.height = personal.sizeSquare * widthCell;
        for (let i = 0; i < personal.sizeSquare; i++) {
            // this.createLine(i, null);
            for (let j = 0; j < personal.sizeSquare; j++) {
                // this.createLine(null, j);
                this.createSell(i, j);
            }
        }
    }

    showMines(i, j) {
        for (let n = 0; n < personal.sizeSquare; n++) {
            for (let m = 0; m < personal.sizeSquare; m++) {
                const elem = this.matrix[n][m];
                this.createOpenSell(m, n);
                elem.status = 'open';
                if (elem.isMine === true) {
                    if (i === n && j === m) {
                        this.createMine(m, n, 'active');
                    } else {
                        this.createMine(m, n);
                    }
                } else {
                    if (elem.countMine > 0) {
                        this.createCaption(m, n, elem.countMine);
                    }
                }
            }
        }
    }
    clearGame() {
        this.matrix = [];
        this.countClick = 0;
        this.countOpenSell = 0;
        this.createSquare();
        scoreboard.clear();
        removeLocalStorage();

    }
    startGame(i, j) {
        let randomSet = getRandomSet(0, personal.sizeSquare * personal.sizeSquare - 1, i, j);
        this.createMatrix(randomSet);
        console.log(randomSet);
        console.log(this.matrix);
    }
    restoreGame() {
        square.isActive = true;
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                const elem = this.matrix[i][j];
                if (elem.status === 'flag') {
                    this.createMine(j, i, 'flag');
                }
                if (elem.status === 'open') {
                    this.createOpenSell(j, i);
                    this.createCaption(j, i, elem.countMine);
                }
            }
        }
    }
    openEmpty(i, j) {
        let n1 = ((i - 1) > 0) ? i - 1 : 0;
        let m1 = ((i + 1) < this.matrix.length) ? i + 1 : this.matrix.length - 1;
        let n2 = ((j - 1) > 0) ? j - 1 : 0;
        let m2 = ((j + 1) < this.matrix[i].length) ? j + 1 : this.matrix[i].length - 1;
        this.createOpenSell(j, i);
        this.matrix[i][j].status = 'open';
        this.countOpenSell++;
        for (let a = n1; a <= m1; a++) {
            for (let b = n2; b <= m2; b++) {
                const elem = this.matrix[a][b];
                if (elem.status === 'close') {
                    if (elem.countMine > 0) {
                        this.createOpenSell(b, a);
                        this.createCaption(b, a, elem.countMine);
                        elem.status = 'open';
                        this.countOpenSell++;
                    }
                    if (elem.countMine === 0) {
                        this.openEmpty(a, b);
                    }
                }
            }
        }
    }
    openAroundSell(i, j) {
        let n1 = ((i - 1) > 0) ? i - 1 : 0;
        let m1 = ((i + 1) < this.matrix.length) ? i + 1 : this.matrix.length - 1;
        let n2 = ((j - 1) > 0) ? j - 1 : 0;
        let m2 = ((j + 1) < this.matrix[i].length) ? j + 1 : this.matrix[i].length - 1;
        let mines = 0;
        for (let a = n1; a <= m1; a++) {
            for (let b = n2; b <= m2; b++) {
                const elem = this.matrix[a][b];
                if (elem.status === 'flag') {
                    mines++;
                }
            }
        }
        if (mines !== this.matrix[i][j].countMine) {
            return;
        }
        for (let a = n1; a <= m1; a++) {
            for (let b = n2; b <= m2; b++) {
                const elem = this.matrix[a][b];
                if (elem.status === 'close') {
                    this.onClick(a, b);
                }
            }
        }
    }
    toggleFlag(i, j) {
        if (this.matrix[i][j].status === 'close') {
            this.createMine(j, i, 'flag');
            this.matrix[i][j].status = 'flag';
            return;
        }
        if (this.matrix[i][j].status === 'flag') {
            this.createSell(j, i);
            this.matrix[i][j].status = 'close';
        }
    }
    onClick(i, j) {
        const elem = this.matrix[i][j];
        if (elem.isMine === true) {
            this.showMines(i, j);
            scoreboard.timerStop();
            modal.open('LOSS');
            return;
        }
        if (elem.countMine > 0 && elem.status === 'close') {
            this.createOpenSell(j, i);
            this.createCaption(j, i, elem.countMine);
            this.countOpenSell++;
            elem.status = 'open';
            return;
        }
        if (elem.countMine === 0) {
            this.openEmpty(i, j);
        }
    }

    addEventListener() {
        this.body.addEventListener('click', (event) => {
            let posX = event.clientX - event.target.getBoundingClientRect().left;
            let posY = event.clientY - event.target.getBoundingClientRect().top;
            let j = Math.trunc(posX / widthCell);
            let i = Math.trunc(posY / widthCell);
            if (scoreboard.countClick === 0) {
                this.startGame(i, j);
                scoreboard.timerStart(1);
            }
            if (!this.matrix) {
                return;
            }
            if (scoreboard.isPause) {
                scoreboard.isPause = false;
            }
            if (this.matrix[i][j].status === 'close') {
                scoreboard.changeClickCount();
                this.onClick(i, j);
            }
            setLocalStorage();
            if (this.countOpenSell === personal.sizeSquare * personal.sizeSquare - personal.countMine) {
                this.showMines(null, null);
                scoreboard.timerStop();
                modal.open('WIN');
            }
        });
        this.body.addEventListener('contextmenu', (event) => {
            if (scoreboard.countClick === 0) { return };
            let posX = event.clientX - event.target.getBoundingClientRect().left;
            let posY = event.clientY - event.target.getBoundingClientRect().top;
            let j = Math.trunc(posX / widthCell);
            let i = Math.trunc(posY / widthCell);
            event.preventDefault();
            if (!this.matrix) {
                return;
            }
            if (scoreboard.isPause) {
                scoreboard.isPause = false;
            }
            if (this.matrix[i][j].status !== 'open') {
                this.toggleFlag(i, j);
                scoreboard.changeClickCount();
            }
            setLocalStorage();
        });
        this.body.addEventListener('mousemove', (event) => {
            // let posX = event.clientX - event.target.getBoundingClientRect().left;
            // let posY = event.clientY - event.target.getBoundingClientRect().top;
            // let j = Math.trunc(posX / widthCell);
            // let i = Math.trunc(posY / widthCell);
            // if (this.matrix[i][j] && this.matrix[i][j].status === 'close') {
            //     this.createHoverSell(j, i);
            // }

        });
        this.body.addEventListener('dblclick', (event) => {
            let posX = event.clientX - event.target.getBoundingClientRect().left;
            let posY = event.clientY - event.target.getBoundingClientRect().top;
            let j = Math.trunc(posX / widthCell);
            let i = Math.trunc(posY / widthCell);
            this.openAroundSell(i, j);
        });
    }
}

export { Square }


