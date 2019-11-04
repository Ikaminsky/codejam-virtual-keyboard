const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        lang: true
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();


        var keyLayout = [];

        if (this.properties.lang == true) {
            var enArr = [
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
                "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lang",
                "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
                "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
                'tab', 'alt', "space", 'ctrl', 'tab'
            ];

            for (el of enArr) {
                keyLayout.push(el)
            }

        } else if (this.properties.lang == false) {

            var ruArr = [
                "c", "v", "b", "n", "m", ",", ".", "?"
            ];

            for (el of ruArr) {
                keyLayout.push(el)
            }
        }




        // const keyLayout = [
        //     "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        //     "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lang",
        //     "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
        //     "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
        //     "space"
        // ];



        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "lang", "enter", "?"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "tab":
                    keyElement.classList.add("keyboard__key");
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "    ";
                        this._triggerEvent("oninput");
                    });

                    break;


                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "ctrl":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.textContent = key.toLowerCase();

                    break;

                case "lang":
                    keyElement.classList.add("keyboard__key--wide", "language");
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener('click', () => {
                        console.log('Lang switched');
                        this.properties.lang = !this.properties.lang;

                    })

                    break;


                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },



    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;

        this.elements.main.classList.add("keyboard--hidden");
    },

    lightButton() {


        window.addEventListener('keydown', function (e) {

                for (el of Keyboard.elements.keys) {
                    if (e.key == el.textContent.toLowerCase()) {
                        el.classList.add('keyboard__key--press');

                    } else if (e.key == ' ') {
                        if (el.textContent == 'space_bar') {
                        el.classList.add('keyboard__key--press')
                        }
                    } else if (e.key == 'Backspace') {
                        if (el.textContent == 'backspace') {
                        el.classList.add('keyboard__key--press')
                        }
                    } else if (e.key == 'Enter') {
                        if (el.textContent == 'keyboard_return') {
                        el.classList.add('keyboard__key--press')
                        }
                    } else if (e.key == 'CapsLock') {
                        if (el.textContent == 'keyboard_capslock') {
                        el.classList.add('keyboard__key--press')
                        }
                    } else if (e.key == 'Tab') {
                        if (el.textContent == 'tab') {
                        e.preventDefault();
                        el.classList.add('keyboard__key--press')
                        }
                    }
                }
        })


        window.addEventListener('keyup', function (e) {

            for (el of Keyboard.elements.keys) {
                if (e.key == el.textContent.toLowerCase()) {
                    el.classList.remove('keyboard__key--press');

                } else if (e.key == ' ') {
                    if (el.textContent == 'space_bar') {
                    el.classList.remove('keyboard__key--press')
                    }
                } else if (e.key == 'Backspace') {
                    if (el.textContent == 'backspace') {
                    el.classList.remove('keyboard__key--press')
                    }
                } else if (e.key == 'Enter') {
                    if (el.textContent == 'keyboard_return') {
                    el.classList.remove('keyboard__key--press')
                    }
                } else if (e.key == 'CapsLock') {
                    if (el.textContent == 'keyboard_capslock') {
                    el.classList.remove('keyboard__key--press')
                    }
                } else if (e.key == 'Tab') {
                    if (el.textContent == 'tab') {
                    el.classList.remove('keyboard__key--press')
                    }
                }
            }
    })


}



};



var div = document.createElement('div');
var textarea = document.createElement('textarea');
textarea.className = 'use-keyboard-input';
div.appendChild(textarea);

document.body.appendChild(div);


// var langButton = document.querySelector('.language');

// langButton.addEventListener('click', () => {


//     if (Keyboard.properties.lang = true) {

//         Keyboard._createKeys();

//     } else {
//         Keyboard._createKeys()
//     }

// })



window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    Keyboard.lightButton()

});
