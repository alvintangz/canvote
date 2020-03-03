const gulp = require('gulp');
const GulpMem = require('gulp-mem');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const { createProxyMiddleware } = require('http-proxy-middleware');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const proxyConfig = require('./proxy.config');
const webpackDevConfig = require('./webpack.dev');
// const webpackProdConfig = require('./webpack.prod');

const webpackDevBundler = webpack(webpackDevConfig);

sass.compiler = require('node-sass');

const canVoteArt = () => {
  console.log(
    `  ___        __   __   _       
 / __|__ _ _ \\ \\ / /__| |_ ___ 
| (__/ _\` | ' \\ V / _ \\  _/ -_)
 \\___\\__,_|_||_\\_/\\___/\\__\\___|`,
    '\nDharmik Shah; Alvin Tang; Mikhail Makarov\n',
  );
};

/* SERVING FILES */

const gulpMem = new GulpMem();
gulpMem.serveBasePath = './dist';
gulpMem.enableLog = false;

const compileSassIntoMemory = () => gulp.src('./app/styles/**/*.scss')
  .pipe(sass({
    includePaths: [
      './node_modules',
      './node_modules/wet-boew/node_modules',
      './node_modules/GCWeb/src/variant-default',
    ],
    style: 'compressed',
  }).on('error', sass.logError))
  .pipe(gulpMem.dest('./dist/styles'));

const assetsIntoMemory = () => gulp.src('./app/assets/**').pipe(gulpMem.dest('./dist/assets'));
const faviconIntoMemory = () => gulp.src('./app/favicon.ico').pipe(gulpMem.dest('./dist'));

const compileAndStreamSass = () => {
  compileSassIntoMemory().pipe(browserSync.stream());
};

// Reads from proxy.config.js - reverse proxies to microservices during development
// This is beautifully what is needed - https://github.com/chimurai/http-proxy-middleware
const getProxiesAsMiddleware = () => proxyConfig.map(
  (config) => createProxyMiddleware(config.from, {
    target: config.to,
    ws: true, // Enable for WebSocket service
    logLevel: 'silent',
    changeOrigin: true,
    prependPath: true,
    ignorePath: false,
    pathRewrite: { [`^${config.from}`]: '' },
    onProxyRes(proxyRes, req, res) {
      console.log(`(Success) Proxying to ${config.title}: ${config.from}${req.url} -> ${config.to}${req.url}`);
    },
    onError(err, req, res) {
      console.log(`(Error) Proxying to ${config.title}: ${config.from}${req.url} -> ${config.to}${req.url}`);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`
         <!doctype html>
         <html lang="en-CA">
             <head>
                 <title>Something Went Wrong: Proxying</title>
             </head>
             <body>
                  <h1>Something Went Wrong: Proxying</h1>
                  <p>Did you start the <strong>${config.title}</strong>?</p>
                  <img src="https://www.placecage.com/c/500/400" alt="Why?" />
              </body>
          </html>
       `);
    },
  }),
);

const browserSyncAndWatch = () => {
  canVoteArt();

  browserSync.init({
    server: {
      baseDir: './dist',
      middleware: getProxiesAsMiddleware().concat(
        [
          webpackDevMiddleware(webpackDevBundler, {
            publicPath: webpackDevConfig.output.publicPath,
            stats: { colors: true },
          }),
          gulpMem.middleware,
          // TODO: Ignore .html file extension
          // (req, res, next) => {
          //   createProxyMiddleware(req.url, {
          //     target: 'http://localhost:3000',
          //     pathRewrite: {
          //       '$': '', // remove base path
          //     },
          //     logLevel: 'silent',
          //   });
          //   next();
          // },
        ],
      ),
    },
    ui: {
      port: 2999,
    },
    open: false,
  });

  // Watch for changes with html files and then reload browser if change occurs
  gulp.watch('./app/html/**/*.html')
    .on('change', browserSync.reload);

  // Watch for changes with src (js or jsx) files and then reload browser if change occurs
  gulp.watch(['./app/src/**/*.js', './app/src/**/*.jsx'])
    .on('change', browserSync.reload);

  // Compile SCSS/SASS on change then auto-inject into browsers
  gulp.watch('./app/styles/**/*.scss').on('change', compileAndStreamSass);

  // Watch for changes in assets folder and put in memory
  gulp.watch('./app/assets/**').on('change', assetsIntoMemory);
};

const serveDev = gulp.series(
  compileSassIntoMemory,
  assetsIntoMemory,
  faviconIntoMemory,
  browserSyncAndWatch,
);

/* BUILD */

// TODO: Build process for CanVote frontend
// gulp.task('build', () => {
//   gulp.src('./app/styles/**/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./dist/styles'));
//
//   // Run webpack: Build js files and inject them into html files, then put in dist folder
//   webpack(webpackProdConfig);
// });

// gulp.task('default', ['serve:dev']);

exports.default = serveDev;
