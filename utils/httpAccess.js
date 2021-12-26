module.exports = (method, url, body, headers = {}) => {
    url = new URL(url);

    const protocol = require(url.protocol.substring(0, url.protocol.length - 1));

    let options = {
        method: method,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search + url.hash
    };

    if(Object.keys(headers).length > 0) {
        options.headers = headers;
    }

    if(true
        && typeof(body) != 'string'
        && body != null
    ) {
        try {
            body = JSON.stringify(body);
        } catch(err) {}
    }

    return(new Promise((resolve, reject) => {
        let req = protocol.request(options, res => {
            res.body = '';

            res.on('data', chunk => {
                res.body += chunk; 
            });

            res.on('end', () => {
                resolve(res);
            });
        });

        req.on('error', err => {
            reject(err);
        });

        if(typeof(body) == 'string') {
            req.end(body);
        } else {
            req.end();
        }
    }));
}