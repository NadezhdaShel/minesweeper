import { setLocalStorage, currentLang } from "./storage.js";
import { baseElement } from "./element.js";
import { scoreboard, settings, square, modal } from "../index.js";

const cssClases = {
    MODAL: 'modal',
    WRAPPER: 'modal__wrapper',
    CONTENT: 'modal__content',
    IMAGE: 'modal__img',
    TITLE: 'modal__title',
    BUTTON: 'modal__button',
    ACTIVE: 'open',
}

const textContent = {
    TITLE: {
        WIN: `Hooray! You found all S mines in seconds and`,// ${scoreboard.countClick} moves!`,
        LOSS: 'Game over. Try again',
        TABLE: '',
    },
    BUTTON: 'OK',
}

class Modal {
    constructor(parentNode) {
        this.parentNode = parentNode;
        this.modal = baseElement('div', cssClases.MODAL, '', this.parentNode);
        this.wrapper = baseElement('div', cssClases.WRAPPER, '', this.modal);
        this.content = baseElement('div', cssClases.CONTENT, '', this.wrapper);
        this.image = baseElement('div', cssClases.IMAGE, '', this.content);
        this.title = baseElement('p', cssClases.TITLE, '', this.content);
        this.buttonBlock = baseElement('p', cssClases.TITLE, '', this.wrapper);
        this.button = baseElement('button', cssClases.BUTTON, textContent.BUTTON, this.buttonBlock);

        this.addEventListener();
    }

    toggleModal() {
        this.modal.classList.toggle(cssClases.ACTIVE);
    }

    open(type) {
        this.image.classList.add(type.toLowerCase());
        this.title.textContent = textContent.TITLE[type];
        this.toggleModal();
    }

    addEventListener() {
        this.button.addEventListener('click', () => {
            this.toggleModal();
            square.clearGame();
        });
    }
}

export { Modal }