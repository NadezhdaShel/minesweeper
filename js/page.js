import { setLocalStorage, currentLang } from "./storage.js";
import { baseElement } from "./element.js";
import { square, page } from "../index.js";

const cssClases = {
    PAGE: 'page',
    HEADER: 'header',
    HEADER_TITLE: 'header__title',
    HEADER_SUBTITLE: 'header__subtitle',
    MAIN: 'main',
    FOOTER: 'footer',
    TEXT_LANG: 'footer__text',
    INPUT: 'text-input',
    TEXT_BUTTON: 'footer__button-lang',
}

const textContentLang = 'Alt + ShiftLeft';
const textTitleHeader = {
    'en': '',
    'ru': ''
}
const textSubtitleHeader = {
    'en': 'for Windows',
    'ru': 'для Windows'
}
const textPlaceholderInput = {
    'en': 'Input text...',
    'ru': 'Введите текст...'
}

class Page {
    constructor(parentNode) {
        this.parentNode = parentNode;
        this.page = baseElement('div', cssClases.PAGE, '', this.parentNode);
        this.header = baseElement('header', cssClases.HEADER, '', this.page);
        this.headerTitle = baseElement('h1', cssClases.HEADER_TITLE, textTitleHeader[currentLang], this.header);
        this.main = baseElement('main', cssClases.MAIN, '', this.page);
        this.footer = baseElement('footer', cssClases.FOOTER, '', this.page);
        this.language = baseElement('button', cssClases.TEXT_BUTTON, currentLang, this.footer);
        this.textLang = baseElement('p', cssClases.TEXT_LANG, textContentLang, this.footer);
        this.addEventListener();
    }
    toggleLangPage() {
        this.headerTitle.textContent = textTitleHeader[currentLang];
        page.language.textContent = currentLang;
    }
    
    addEventListener() {
        this.language.addEventListener('click', this.clickButtonLang);
    }

    clickButtonLang() {
        if (page.language.textContent === 'en') {
            page.language.textContent = 'ru';
        } else {
            page.language.textContent = 'en';
        }
        setLocalStorage();
        page.toggleLangPage();
    }

}

export { Page }