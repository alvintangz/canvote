# CanVote: Frontend :page_facing_up:

The frontend of CanVote. It communicates with a variety of services that make up CanVote: Authentication Service, Voting Service, WebSocket Service.

<small>*This project was originally bootstrapped with [Create React App](https://github.com/facebook/create-react-app). A previous iteration of the frontend project utilized Babel, Gulp and Webpack from scratch to create bundled JS files (multiple Webpack entries w/ split chunk optimization) for a multi-paged frontend application. It was ultimately decided to scrap that and switch to Create React App to bundle everything and utilize React Router. Note that Create React App uses Babel for compiling ES6 down, and Webpack to bundle everything.*</small>

## Prerequisites

1. [NodeJs](https://nodejs.org/)
2. [Yarn](https://yarnpkg.com/getting-started/install), a package manager favoured by Facebook
3. The CanVote Authentication Service
4. The CanVote Voting Service
5. The CanVote WebSocket Service

## First Step

Before building the project for distribution or starting the development server, follow the steps below.

1. Install all dependencies, including development dependencies
    ```bash
    $ yarn
    ```
2. [Environment variables set up](#environment-variables-set-up)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

*You may notice a `proxy.config.js` file in the project directory. Through Webpack (a dependency in Create React App), any requests made to certain subdomains that match domains in `proxy.config.js` will be proxied instead. For example, making a request to `http://auth.localhost:3000/api/v1/` will proxy to `http://localhost:3001/api/v1/`. However, due to the fact that cookies can not work cross domain with `localhost` subdomains, we recommend that you don't set these localhost subdomains [when setting service base urls in the environment variables](#environment-variables-set-up).*

<small>*This will automatically run the `yarn watch-css` script.*</small>

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

<small>*This will automatically run the `yarn build-css` script.*</small>

### `yarn build-css`, `yarn watch-css`, `yarn clean-css`

`yarn build-css` will build any sass files from `styles/` into compressed CSS files in `public/styles/` using the basic the preprocessor for Sass, [node-sass](https://github.com/sass/node-sass).

With that in mind, `yarn watch-css` can watch for any changes to sass files in `styles/` and runs `yarn build-css` when changes are detected.

`yarn clean-css` will just delete the contents in `public/styles/`, if any exists.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Environment variables set up

With create-react-app, [adding custom environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/) can be embedded into JS during build time. Here are all the required environment variables this application requires.

- CanVote Services
    - `REACT_APP_AUTH_SERVICE_BASE_URL` - The full base url of the authentication service (and should end with /api/v1)
    - `REACT_APP_VOTING_SERVICE_BASE_URL` - The full base url of the voting service
    - `REACT_APP_WS_SERVICE_WS_URL` - The full url of the websocket in the service
- Map: This app utilzes [Mapbox](https://www.mapbox.com/) to display map data
    - `REACT_APP_MAPBOX_API_KEY` - The API key from Mapbox
    - `REACT_APP_MAPBOX_MAP_STYLE` - Mapbox style which should be formatted as so: `<username>/<style-id>`; we recommend you use `alvintangz/ck8p1gfx445tp1jo0153rv86m`
    - `REACT_APP_MAP_DEFAULT_POS_LAT` - The default latitude position of the map; we recommend you use `56.1304` for the centre of Canada
    - `REACT_APP_MAP_DEFAULT_POS_LONG` - The default longitude position of the map; we recommend you use `106.3468` for the centre of Canada
    - `REACT_APP_MAP_DEFAULT_POS_ZOOM` - The default zoom position of the map; we recommend you use `4` to fit Canada in

You can create a [`.env` file](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-development-environment-variables-in-env) where you can place all these environment variables. You can use this to start off with:

```
REACT_APP_AUTH_SERVICE_BASE_URL=http://localhost:3001/api/v1
REACT_APP_VOTING_SERVICE_BASE_URL=http://localhost:3002
REACT_APP_WS_SERVICE_WS_URL=ws://localhost:3003
REACT_APP_MAPBOX_API_KEY=<REACT_APP_MAPBOX_API_KEY>
REACT_APP_MAPBOX_MAP_STYLE=alvintangz/ck8p1gfx445tp1jo0153rv86m
REACT_APP_MAP_DEFAULT_POS_LAT=56.1304
REACT_APP_MAP_DEFAULT_POS_LONG=-106.3468
REACT_APP_MAP_DEFAULT_POS_ZOOM=4
```
