(function (window, document) {
    'use strict';

    /**
     * Checks, if in storage (localStorage if available or Cookie) an entry exists
     * that the cookie notice was confirmed.
     * If there was no confirmation the stylesheet and content will be loaded and
     * added to the dom.
     * 
     * @param {object} params 
     * @returns {object} this
     */
    function CookieNotice(params) {
        this.settings = {
            storageName: "CookieNotice",
            storageLifetime: null, // seconds or nothing for "forever"
            uriStyles: 'Plugins/CookieNotice/styles.css',
            uriContent: 'Plugins/CookieNotice/Content.html',
            buttonQuerySelector: '#cookie-notice-confirmed', // button to hide the notice and to mark as confirmed
            container: document.createElement("DIV"), // element, where the content will be appended
            onContentLoaded: function (self) {

            },
            onButtonClicked: function (self) {
                self.removeContainer();
            }
        };

        // overwrite default settings
        if (typeof params === "object") {
            for (var key in params) {
                if (params.hasOwnProperty(key) && typeof this.settings[key] !== "undefined") {
                    this.settings[key] = params[key];
                }
            }
        }

        this.hasStorage = ("localStorage" in window && window.localStorage);

        /**
         * stores the current timestamp.
         */
        this.setConfirmed = function () {
            var useCookie = !this.hasStorage;
            if (!useCookie) {
                try {
                    localStorage.setItem(this.settings.storageName, new Date().getTime());
                } catch (e) {
                    useCookie = true;
                }
            }

            if (useCookie) {
                document.cookie = this.settings.storageName + "=" + new Date().getTime() + "; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
            }
        };

        /**
         * Finds the stored timestamp and compares it with lifetime.
         * @returns {boolean}
         */
        this.isConfirmed = function () {
            var storedTime = 0;
            var useCookie = !this.hasStorage;

            if (!useCookie) {
                try {
                    storedTime = parseInt(localStorage.getItem(this.settings.storageName));
                    if (!storedTime) {
                        return false;
                    }
                } catch (e) {
                    useCookie = true;
                }
            }

            if (useCookie) {
                var nameEQ = this.settings.storageName + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1, c.length);
                    }
                    if (c.indexOf(nameEQ) === 0) {
                        storedTime = parseInt(c.substring(nameEQ.length, c.length));
                    }
                }

                if (!storedTime) {
                    return false;
                }
            }

            if (this.settings.storageLifetime) {
                var expirationDate = new Date();
                expirationDate.setTime(storedTime - (this.settings.storageLifetime * 1000));
                return storedTime > expirationDate.getTime();
            } else {
                return true;
            }
        };

        /**
         * removes the container from dom
         */
        this.removeContainer = function () {
            if (this.settings.container) {
                this.settings.container.parentNode.removeChild(this.settings.container);
            }
        };

        /**
         * Loads the CSS-file
         */
        this.loadStyles = function () {
            if (!this.settings.uriStyles) {
                return;
            }
            var f = document.createElement("link");
            f.setAttribute("rel", "stylesheet");
            f.setAttribute("type", "text/css");
            f.setAttribute("href", this.settings.uriStyles);
            document.querySelector("head").appendChild(f);
        };

        /**
         * Loads the xhr-content for container.
         */
        this.loadContent = function () {
            // load content
            var CN = this;
            var request = new XMLHttpRequest();
            request.open("GET", this.settings.uriContent);
            request.addEventListener('load', function (event) {
                if (request.status >= 200 && request.status < 300) {
                    CN.settings.container.innerHTML += request.responseText;

                    if (typeof CN.settings.onContentLoaded === "function") {
                        CN.settings.onContentLoaded(CN);
                    }

                    var btns = document.querySelectorAll(CN.settings.buttonQuerySelector);
                    if (btns.length) {
                        for (var b = 0; b < btns.length; b++) {
                            btns[b].addEventListener("click", function () {
                                CN.setConfirmed();
                                if (typeof CN.settings.onButtonClicked === "function") {
                                    CN.settings.onButtonClicked(CN);
                                } else {
                                    CN.removeContainer();
                                }
                            }, false);
                        }
                    }
                } else {
                    console.warn(request.statusText, request.responseText);
                }
            });
            request.send();
        };

        // load styles and content, if the notice was not confirmed
        if (!this.isConfirmed()) {
            this.loadStyles();
            this.loadContent();
        }
    };

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return CookieNotice;
        });
    } else {
        window.CookieNotice = CookieNotice;
    }

})(window, document);
