import { setLocalStorage} from "./storage.js";
import { baseElement } from "./element.js";
import { personal } from "./personal.js";
import { square, menu, scoreboard } from "../index.js";

const cssClases = {
    SETTINGS: 'settings-menu',
    LEVEL_GROUP: 'settings-menu__level-group',
    LEVEL_GROUP_TITLE: 'settings-menu__level-group-title',
    LEVEL_TITLE: 'settings-menu__level-title',
    PROPERTY: 'settings-menu__property',
    INPUT: 'settings-menu__input',
    CAPTION: 'settings-menu__input-caption',
    CLOSE: 'settings-menu__close',
    ACTIVE: 'open',
}

const levels = {
    EASY: {
        name: 'easy',
        text: 'Easy',
        mines: 5,
        size: 5,
    },
    MEDIUM: {
        name: 'medium',
        text: 'Medium',
        mines: 10,
        size: 10,
    },
    HARD: {
        name: 'hard',
        text: 'Hard',
        mines: 20,
        size: 20,
    },
    OTHER: {
        name: 'other',
        text: 'Other...',
    }
}

const textContent = {
    LEVEL_GROUP_TITLE: 'Choose the level of difficulty:',
    MINES: 'Number mines:',
    SIZE: 'Size square:',
}

class Settings {
    constructor(parentNode) {
        this.parentNode = parentNode;
        this.body = baseElement('div', cssClases.SETTINGS, '', this.parentNode);
        this.levelProperty = baseElement('div', cssClases.PROPERTY, '', this.body);
        this.minesTitle = baseElement('label', cssClases.CAPTION, textContent.MINES, this.levelProperty, {
            for: 'mines',
        });
        this.mines = baseElement('input', cssClases.INPUT, '', this.levelProperty, {
            type: 'number',
            value: '10',
            id: 'mines',
            disabled: true,
            min: 1,
            max: 10000,
        });
        this.sizeTitle = baseElement('label', cssClases.CAPTION, textContent.SIZE, this.levelProperty, {
            for: 'size',
        });
        this.size = baseElement('input', cssClases.INPUT, '', this.levelProperty, {
            type: 'number',
            id: 'size',
            value: '10',
            disabled: true,
            min: 2,
            max: 100,
        });

        this.levelGroup = baseElement('fieldset', cssClases.LEVEL_GROUP, '', this.body);
        this.levelGroupTitle = baseElement('legend', cssClases.LEVEL_GROUP_TITLE, textContent.LEVEL_GROUP_TITLE, this.levelGroup);
        this.levelRadio = [];
        for (let key in levels) {
            let elem = levels[key];
            let nameCapitalize = `level${elem.name[0].toUpperCase() + elem.name.slice(1)}`;
            this.levelRadio.push(baseElement('input', null, '', this.levelGroup, {
                type: 'radio',
                name: 'level',
                id: nameCapitalize,
                value: elem.name,
            }));
            if (elem.name === 'medium') {
                this.levelRadio[this.levelRadio.length - 1].checked = true;
            }
            let levelTitle = baseElement('label', cssClases.LEVEL_TITLE, elem.text, this.levelGroup, {
                for: nameCapitalize,
            });
        }
        this.closeButton = baseElement('button', cssClases.CLOSE, 'Close', this.body);
        this.addEventListener();
    }
    toggleSettings() {
        this.body.classList.toggle(cssClases.ACTIVE);
    }
    toggleDisabledInput(value) {
        if (value === 'other') {
            this.mines.disabled = false;
            this.size.disabled = false;
        } else {
            this.mines.disabled = true;
            this.size.disabled = true;
        }
    }
    addEventListener() {
        this.levelGroup.addEventListener('change', (event) => {
            const target = event.target.value;
            this.toggleDisabledInput(target);
            personal.level = this.levelRadio.find(e => e.checked === true).value;
            if (target !== 'other') {
                this.mines.value = levels[target.toUpperCase()].mines;
                this.size.value = levels[target.toUpperCase()].size;
            }

        })
        this.size.addEventListener('change', () => {
            if (this.size.value > 100) {
                this.size.value = 100;
            }
        })
        this.mines.addEventListener('change', () => {
            if (this.mines.value > this.size.value * this.size.value) {
                this.mines.value = this.size.value * this.size.value;
            }
        })
        this.closeButton.addEventListener('click', () => {
            if (personal.sizeSquare !== this.size.value || personal.countMine !== this.mines.value) {
                personal.sizeSquare = this.size.value;
                personal.countMine = this.mines.value;
                setLocalStorage();
                square.clearGame();
            }
            this.toggleSettings();
            scoreboard.isPause = false;
        })
        document.addEventListener('click', (event) => {
            const target = event.target;
            const isSettings = target == this.body || this.body.contains(target);
            if (target === menu.settingsButton) {
                return;
            }
            if (this.body.classList.contains("open") && !isSettings) {
                this.toggleSettings();
            }
        });
    }


}

export { Settings }