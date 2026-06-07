# Running the frontend

## Local development (no AWS needed)

The committed `.env.development` enables **mock auth** (`REACT_APP_MOCK_AUTH=true`)
and points the client at a local game server, so you can just:

```
npm start
```

No `aws sso login` / Cognito required. Under mock auth, `Auth.currentCredentials()`
is never called; the player identity comes from a local mock
(`src/auth/identity.ts`), defaulting to `local-player`. For local two-player
testing, give each browser tab its own identity with a query param, e.g.
`/game/testlobby/Game-0?mockIdentity=PlayerID1` and `...?mockIdentity=PlayerID2`.

You also need a game server on `http://localhost:3001`. From
`browser-fighting-game-server`, either `npm run start` or `docker compose up --build`.
For lobby-less play, use the client's debug mode (`?debug`) or open a game route
directly — see that repo's `doc/manual-verification-sop.md`.

To use **real Cognito** locally instead, create `.env.development.local` with
`REACT_APP_MOCK_AUTH=false` (and a valid `REACT_APP_API_URL`), then `aws sso login`.

## Production

Built and deployed via AWS Amplify; currently hosted at
https://frontend.sam-thompson-test-development.link

# Amplify instructions


## Initial setup

To create the Amplify stack:

```
# cd to the project root
amplify init
  name: bfgclient
  initialize project with the above configuration: Y
  authentication: AWS profile
  profile: amplify-dev
  send non-sensitive data: N
amplify add auth
  what configuration: Default configuration
  how do users sign in: Username
  Do you want to configure advanced settings? No
```

## Running the stack

```amplify run, amplify publish```


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
