# JSCookieNotice
A small JavaScript to show a cookie notice.

First it checks, if in storage is stored the info, if the notice was already be shown (localStorage or cookie as fallback).
If the there is the info, nothing else will be done.
If the there is no info or the lifetime is expired, the styles and the content will be loaded and the notice will be shown. Via click on the button the notice will be removed and the cookie will be set.

## include it in a classical way

```
<div id="cookie-notice-wrap"></div>
<script src="CookieNotice.js"></script>
<script>
var config = {
    uriContent: 'content.html',
    uriStyles: 'styles.css',
    storageName: "cookie_notice",
    storageLifetime: null, // seconds or nothing for "forever"
    container: document.querySelector("#cookie-notice-wrap"),
    buttonQuerySelector: '#cookie-notice-confirmed',
    onContentLoaded: function (that) {
        document.querySelector("body").style.marginBottom = document.querySelector("#cookie-notice-wrap").clientHeight + "px";
    },
    onButtonClicked: function (that) {
        that.removeContainer();
        document.querySelector("body").style.marginBottom = null;
    }
};
new CookieNotice(config);
</script>
```

## or use requirejs

```
<div id="cookie-notice-wrap"></div>
<script>
requirejs(["CookieNotice"], function (CookieNotice) {
    var config = {
        uriContent: 'content.html',
        uriStyles: 'styles.css',
        storageName: "cookie_notice",
        storageLifetime: null, // seconds or nothing for "forever"
        container: document.querySelector("#cookie-notice-wrap"),
        buttonQuerySelector: '#cookie-notice-confirmed',
        onContentLoaded: function (that) {
            document.querySelector("body").style.marginBottom = document.querySelector("#cookie-notice-wrap").clientHeight + "px";
        },
        onButtonClicked: function (that) {
            that.removeContainer();
            document.querySelector("body").style.marginBottom = null;
        }
    };
    new CookieNotice(config);
});
</script>
```
