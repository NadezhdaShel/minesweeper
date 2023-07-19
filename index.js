import { setLocalStorage, getLocalStorage } from "./js/storage.js";
import { Page } from "./js/page.js";
import { Square } from "./js/square.js";
import { Scoreboard } from "./js/scoreboard.js";
import { Menu } from "./js/menu.js";
import { Settings } from "./js/settings.js";
import { Modal } from "./js/modal.js";


let page = new Page(document.body);
let menu = new Menu(page.header);
let settings = new Settings(page.header);
let scoreboard = new Scoreboard(page.header);
let square = new Square(page.main);
let modal = new Modal(page.page);


window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);


export { page, square, scoreboard, settings, menu, modal }


