const { createProxyMiddleware } = require('http-proxy-middleware');
const conditional = require('express-conditional-middleware');
const chalk = require('chalk');
const proxyThese = require('../proxy.config');

// react-scripts (create-react-app) utilizes Webpack Dev Server
// https://webpack.js.org/configuration/dev-server/
// https://create-react-app.dev/docs/proxying-api-requests-in-development/
module.exports = function(app) {
  proxyThese.forEach(config => {
    app.use(conditional((req, res, next) => {
      return req.headers.host.startsWith(config.context);
    }, createProxyMiddleware({
      target: config.proxyTo,
      changeOrigin: true,
      ws: false, // TODO: Enable for WebSocket service
      logLevel: 'silent',
      onProxyRes(proxyRes, req, res) {
        const proxyResStatusMsg = `(${proxyRes.statusCode} ${proxyRes.statusMessage})`;
        const proxyDirectionMsg = `${req.protocol}://${req.headers.host}${req.originalUrl} -> ${config.proxyTo}${req.originalUrl}`;
        console.log(`${proxyRes.statusCode >= 200 && proxyRes.statusCode < 300 ? chalk.green(proxyResStatusMsg) : chalk.red(proxyResStatusMsg)} Proxying to ${chalk.bold(config.title)}: ${proxyDirectionMsg}`);
      },
      onError(err, req, res) {
        const proxyDirectionMsg = `${req.protocol}://${req.headers.host}${req.originalUrl} -> ${config.proxyTo}${req.originalUrl}`;
        console.log(`${chalk.red('(Error)')} Proxying to ${chalk.bold(config.title)}: ${proxyDirectionMsg}`);

        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
          <!doctype html>
          <html lang="en-CA">
              <head>
                  <title>Something Went Wrong: Proxying</title>
              </head>
              <body>
                    <h1>Something Went Wrong: Proxying</h1>
                    <p>Did you start the development (or production) server for the <strong>${config.title}</strong>?</p>
                    <img src="https://www.placecage.com/c/500/400" alt="Why?" />
                </body>
            </html>
        `);
      },
    })));
  });
};
