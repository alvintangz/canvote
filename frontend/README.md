# CanVote: Frontend :page_facing_up:

The frontend of CanVote. It should serve files 
It utilizes [GulpJS](https://gulpjs.com/) and [Webpack](https://webpack.js.org/) to build, and with [Browser Sync](https://browsersync.io/) to serve the project.

## Install

You will need [node](https://nodejs.org/en/) with npm. When you have it, install all dependencies.

```shell script
npm install
```

*Note that you may see a message from npm about 2 vulnerabilities. You can safely ignore this message as this project does not utilize jQuery which is a dependency of GCWeb.*

## Development

### Start Development Server

Run the npm script below and then head over to [http://localhost:3000](http://localhost:3000). [http://localhost:2999](http://localhost:2999) is where you'll have access to Browser Sync UI.

```shell script
npm run serve:dev
```

In addition to starting the development server, you should start all other required microservices. Learn more about [proxying](#proxying) here.

With [Browser Sync](https://browsersync.io/) and middleware such as Webpack Dev Middleware, any changes to `app/styles`, `app/assets`, `app/html`, and `app/js` may restart your browser.

### Developing with JavaScript

This project utilizes [Webpack](https://webpack.js.org/) to bundle JavaScript and JSX into separate JavaScript files. As such, you can define all JavaScript entry points in `pages-scripts.config.js` for easy bundling. This allows specific JavaScript to be bundled together, separating page specific JavaScript in one JavaScript file and another in another file. Also note to set specific JavaScript entry points for each HTML page in `pages.config.js` which will then be injected into specified HTML files.

In `app/src`, you should see:
- `/api` - API to backend microservices live here
- `/components` - React components, which may use JS from `/api`
- `/pages` - Page specific JavaScript files which can import React components or api functions from `/api`
- `shared.jsx` - JSX that should be shared with all HTML files. For example, it contains JavaScript and JSX for header and footer

### Proxying

Look at `proxy.config.js` and then look at your console when you go to specific URLs. Proxying has been done via `http-proxy-middleware` in gulpfile.

### Stylesheets

All stylesheets live in `app/styles`. Imported styles from `GCWeb`, a Canada.ca theme that uses wet-boew and Bootstrap v3.4.1.

*Note: This may need to be moved over to webpack in order to bundle Glyphicons fonts from Bootstrap v3.4.1.*

## Deployment

TODO.
