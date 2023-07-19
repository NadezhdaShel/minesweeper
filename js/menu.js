import { setLocalStorage, currentLang } from "./storage.js";
import { baseElement } from "./element.js";
import { scoreboard, settings, square } from "../index.js";

const cssClases = {
    MENU: 'menu',
    RESTART: ['button', 'restart'],
    SETTINGS: ['button', 'settings'],
    THEME: ['button', 'theme'],
}

class Menu {
    constructor(parentNode) {
        this.parentNode = parentNode;
        this.menu = baseElement('div', cssClases.MENU, '', this.parentNode);
        this.restartButton = baseElement('button', cssClases.RESTART, '', this.menu);
        this.settingsButton = baseElement('button', cssClases.SETTINGS, '', this.menu);
        this.themeButton = baseElement('button', cssClases.THEME, '', this.menu);

        this.addEventListener();
    }

    addEventListener() {
        this.restartButton.addEventListener('click', () => {
            square.clearGame();
        });
        this.settingsButton.addEventListener('click', () => {
            settings.toggleSettings();
            scoreboard.isPause = true;
        });
        this.themeButton.addEventListener('click', () => {
            if (document.documentElement.hasAttribute('theme')) {
                document.documentElement.removeAttribute('theme');
            } else {
                document.documentElement.setAttribute('theme', 'dark');
            }
        });
    }
}

export { Menu }