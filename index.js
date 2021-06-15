/**
 * koa-redirects-path middleware
 */
const querystring = require('querystring');
const {
    pathToRegexp,
    parse,
    compile
} = require('path-to-regexp');

module.exports = function ({
    redirects,
    onRedirect = async () => {}
}) {
    const redirectList = redirects.map((redirect) => {
        const parsedSourceReg = parse(redirect.source);
        const isRegPath = parsedSourceReg.length > 1;
        return {
            ...redirect,
            parsedSourceReg,
            sourceReg: pathToRegexp(redirect.source),
            parsedDestinationReg: isRegPath ? parse(redirect.destination) : [redirect.destination],
            destinationToPath: isRegPath ?
                compile(redirect.destination, {
                    encode: encodeURIComponent
                }) :
                () => redirect.destination,
        };
    });

    async function doRedirect(ctx, redirect) {
        const {
            query
        } = ctx;
        const {
            redirectPath,
            permanent = false
        } = redirect;
        let redirectUrl = redirectPath;
        if (Object.keys(query).length > 0) {
            redirectUrl = `${redirectPath}?${querystring.stringify(query)}`;
        }
        redirectUrl = redirectUrl.substr(0, 2000);
        ctx.status = permanent ? 301 : 302;
        ctx.redirect(targetUrl);
        await onRedirect(ctx, {
            ...redirect,
            redirectUrl
        });
    }

    return async function redirectsPath(ctx, next) {
        if (redirectList.length === 0) {
            return await next();
        }
        const {
            path
        } = ctx;
        let pathExec = null;
        let redirect = null;
        for (const redirectItem of redirectList) {
            pathExec = redirectItem.sourceReg.exec(path);
            if (pathExec) {
                redirect = redirectItem;
                break;
            }
        }

        if (!redirect) {
            return await next();
        }
        if (redirect.parsedDestinationReg.length === 1) {
            return await doRedirect(ctx, {
                ...redirect,
                redirectPath: redirect.destination
            });
        }

        const params = redirect.parsedSourceReg.reduce((result, reg, index) => {
            if (Object.keys(reg).includes('name')) {
                return {
                    ...result,
                    [reg.name]: pathExec[index],
                };
            }
            return result;
        }, {});
        const redirectPath = redirect.destinationToPath(params);
        return await doRedirect(ctx, {
            ...redirect,
            redirectPath
        });
    };
};
