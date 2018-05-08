(function (window) {
    'use strict';

    class CookieNotice {
        constructor(params, languageParams) {
            this.settings = {
                cookieName: 'cn_confirmed',
                cookieValue: 'yes',
                cookieLivetime: 30758400000, // one year (24 * 60 * 60 * 365 * 1000)
                uriDataPrivacy: '/datenschutz',
                uriStyles: 'CookieNotice.css',
                language: 'de',
                container: document.querySelector("body"), // the element the notice should be added
                position: 'append' // either append or prepend
            };

            this.language = {
                de: {
                    content_header: 'Cookie Notiz',
                    content_before_link: 'Diese Domain nutzt Cookies, um Ihnen einen besseren Service gewähr­­leisten zu können. Mit der Nutzung unserer Seite erklären Sie sich mit unserer ',
                    content_link: 'Cookie- und Daten­schutz­­richt­linie',
                    content_after_link: ' einverstanden.',
                    content_button: 'OK'
                },
                en: {
                    content_header: 'Cookie Notice',
                    content_before_link: 'This domain uses cookies to ensure you a better service. By using our site, you agree to our ',
                    content_link: 'cookie and privacy policy',
                    content_after_link: '.',
                    content_button: 'OK'
                }
            };

            if (typeof this.language[this.settings.language] === "undefined") {
                this.language[this.settings.language] = {};
            }

            // overwrite default settings
            if (typeof params === "object") {
                for (var key in params) {
                    if (params.hasOwnProperty(key) && typeof this.settings[key] !== "undefined") {
                        this.settings[key] = params[key];
                    }
                }
            }

            // set language
            if (typeof languageParams === "object") {
                for (var key in languageParams) {
                    if (languageParams.hasOwnProperty(key) && typeof this.language[this.settings.language][key] !== "undefined") {
                        this.language[this.settings.language][key] = languageParams[key];
                    }
                }
            }

            return this;
        };

        isConfirmed() {
            var name = this.settings.cookieName + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return this.setting.cookieValue === c.substring(name.length, c.length) ? true : false;
                }
            }
            return false;
        };

        setConfirmed() {
            var d = new Date();
            d.setTime(d.getTime() + this.settings.cookieLivetime);
            document.cookie = this.settings.cookieName + "=" + this.settings.cookieValue + ";expires=" + d.toUTCString() + ";path=/";
        };

        loadStyles() {
            if (!this.settings.uriStyles) {
                return;
            }
            var f = document.createElement("link");
            f.setAttribute("rel", "stylesheet");
            f.setAttribute("type", "text/css");
            f.setAttribute("href", this.settings.uriStyles);
            document.querySelector('head').appendChild(f);
        };

        getLanguage(key) {
            if (typeof this.language[this.settings.language][key] === "string") {
                return this.language[this.settings.language][key];
            } else {
                return "";
            }
        };

        showNotice() {
            var wrap = document.createElement("div");
            wrap.setAttribute("class", "cookie-notice-wrap");

            var cn = document.createElement("div");
            cn.setAttribute("class", "cookie-notice");
            wrap.appendChild(cn);

            if (this.getLanguage("content_header")) {
                var header = document.createElement("span");
                header.setAttribute("class", "content-header");
                var tn = document.createTextNode(this.getLanguage("content_header"));
                header.appendChild(tn);
                cn.appendChild(header);
            }

            var notice = document.createElement("span");
            notice.setAttribute("class", "notice");
            cn.appendChild(notice);

            var content1 = document.createElement("span");
            content1.setAttribute("class", "content-1");
            var tn = document.createTextNode(this.getLanguage("content_before_link"));
            content1.appendChild(tn);
            notice.appendChild(content1);

            var link = document.createElement("a");
            link.setAttribute("class", "content-link");
            link.setAttribute("href", this.settings.uriDataPrivacy);
            link.setAttribute("target", "_blank");
            var tn = document.createTextNode(this.getLanguage("content_link"));
            link.appendChild(tn);
            notice.appendChild(link);

            var content2 = document.createElement("span");
            content2.setAttribute("class", "content-2");
            var tn = document.createTextNode(this.getLanguage("content_after_link"));
            content2.appendChild(tn);
            notice.appendChild(content2);

            var buttonWrap = document.createElement("span");
            buttonWrap.setAttribute("class", "button-wrap");
            notice.appendChild(buttonWrap);

            var button = document.createElement("a");
            button.setAttribute("href", "#");
            button.setAttribute("class", "button");
            var tn = document.createTextNode(this.getLanguage("content_button"));
            button.appendChild(tn);
            var self = this;
            button.addEventListener("click", function (evt) {
                evt.preventDefault();
                self.setConfirmed();
                self.settings.container.removeChild(wrap);
                return false;
            }, false);
            buttonWrap.appendChild(button);

            if (this.settings.position === "prepend") {
                this.settings.container.insertBefore(wrap, this.settings.container.firstChild);
            } else {
                this.settings.container.appendChild(wrap);
            }
        };

        init() {
            if (this.isConfirmed()) {
                return true;
            }

            this.loadStyles();
            this.showNotice();
            return false;
        };
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return CookieNotice;
        });
    } else {
        window.CookieNotice = CookieNotice;
    }

})(window);
