# JSCookieNotice
A small JavaScript to show a cookie notice.

First it checks, if a cookie is set, which has the information, if the notice was already be shown.
If the cookie exists, nothing else will be done.
If the cookie does not exists, the styles will be loaded and the notice will be shown. Via click on the button the notice will be removed and the cookie will be set.

## include it in a classical way

```
<script src="CookieNotice.js"></script>
<script>
new CookieNotice({
    cookieName: 'cn_confirmed',
    cookieValue: 'yes',
    cookieLivetime: 30758400000, // one year (24 * 60 * 60 * 365 * 1000)
    uriDataPrivacy: '/data_privacy',
    uriStyles: 'CookieNotice.css',
    language: 'en',
    container: document.querySelector("body"), // the element the notice should be added
    position: 'append' // either append or prepend to container
}).init();
</script>
```

## or use requirejs

```
<script>
requirejs(["CookieNotice"], function (CookieNotice) {
    new CookieNotice({
        cookieName: 'cn_confirmed',
        cookieValue: 'yes',
        cookieLivetime: 30758400000, // one year (24 * 60 * 60 * 365 * 1000)
        uriDataPrivacy: '/data_privacy',
        uriStyles: 'CookieNotice.css',
        language: 'en',
        container: document.querySelector("body"), // the element the notice should be added
        position: 'append' // either append or prepend to container
    }).init();
});
</script>
```

## language

The german and english language is built in and is selected by the parameter `language:'de'` or `language:'en'`.
If you want to use your own translation, use the second parameter to override some values:

```
<script>
new CookieNotice({
    language: 'en'
}, {
    content_header: 'Notice about the use of cookies',
    content_button: 'confirm'
}).init();
</script>
```

Or add a complete new language:

```
<script>
new CookieNotice({
    language: 'xy'
}, {
    content_header: 'header',
    content_before_link: 'some text before the data privacy link',
    content_link: 'the data privacy link content',
    content_after_link: 'some text after the data privacy link',
    content_button: 'the button content'
}).init();
</script>
```
