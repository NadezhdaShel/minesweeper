function baseElement(tagName = 'div', className, textContent = '', parentNode, attributes, onClick) {
    let elem = document.createElement(tagName);
    if (attributes) {
        for (let key in attributes) {
            let value = attributes[key];
            elem.setAttribute(key, value);
        }
    }
    if (className) {
        if (typeof className === 'string') {
            elem.classList.add(className);
        }
        if (typeof className === "object") {
            for (let i = 0; i < className.length; i++) {
                elem.classList.add(className[i]);
            }
        }
    }
    elem.textContent = textContent;
    if (parentNode) {
        parentNode.append(elem);
    }
    if (onClick && (typeof onClick === 'function')) {
        elem.addEventListener('click', onClick);
    }
    return elem;
}

export { baseElement };