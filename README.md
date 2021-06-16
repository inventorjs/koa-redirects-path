# koa-redirects-path
koa-redirects-path middleware

support options { redirects, onRedirect }

redirect support path example:
```
    redirects = [
        { source: '/pageA', destination: '/pageB', permanent: false },
        { source: '/pageA/:page', destination: '/pageB/:page', permanent: false },
    ]
```
"permanent" is true then statusCode is 302 else 301
"onRedirect" is a async callback before redirect
