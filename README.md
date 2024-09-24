# <img src="https://i.ibb.co/kc4tWZM/privpass-1.png" width="600">

## PrivPASS 🔐

📌 Simple yet complete OTP accessed password manager app with REST API server, based on the MERN stack. Project contains
Express.js app as a backend (server) and React app as a frontend (client).

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/jakubcieslik99/privpass?color=orange&filename=server%2Fpackage.json&label=server%20version)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/jakubcieslik99/privpass?color=orange&filename=client%2Fpackage.json&label=client%20version)
![GitHub top language](https://img.shields.io/github/languages/top/jakubcieslik99/privpass)
![GitHub repo size](https://img.shields.io/github/repo-size/jakubcieslik99/privpass)
[![Website)](https://img.shields.io/website?label=demo%20website&url=https%3A%2F%2Fprivpass.jakubcieslik.com%2F)](https://privpass.jakubcieslik.com/)

## Features

- Access via OTP sent to the email address
- Adding, editing and deleting passwords
- Getting user's selected password
- Sorting and searching through all user's passwords
- Storing encrypted passwords

## Screenshots

<img src="https://i.ibb.co/fC8WCkq/privpass-2.png" width="800">

## Endpoints Documentation

📚 Documentation of all available endpoints can be found here:
[API Documentation](https://documenter.getpostman.com/view/20607862/2s93m7X29r)

## Run Locally

- Clone repository

```bash
  git clone https://github.com/jakubcieslik99/privpass.git
```

ℹ️ Instructions for running server app locally:

- Navigate to the server directory and install dependencies

```bash
  cd privpass/server
  pnpm install
```

- Run server app in development mode

```bash
  npm run docker
  pnpm run dev
```

ℹ️ Instructions for running client app locally:

- Navigate to the client directory and install dependencies

```bash
  cd privpass/client
  pnpm install
```

- Run client app in development mode

```bash
  pnpm run dev
```

## Deployment

ℹ️ Instructions for building and running server app in production

- Transpile to production build

```bash
  pnpm run build
```

- Run server app in production mode

```bash
  pnpm install --prod
  pnpm run start
```

ℹ️ Instructions for building and running client app in production

- Create production build

```bash
  pnpm run build
```

- Run client app in production mode

```bash
  pnpm run preview
```

## Environment Variables

⚙️ To run server app, you will need to add the following environment variables to your .env file

- `DIR` _(default already set for development)_
- `ENV` _(default already set for development)_

- `MONGO_VER`

- `HOST`
- `PORT`
- `API_URL`
- `APP_URL`

- `MONGO_HOST`
- `MONGO_PORT`
- `MONGO_DB`
- `MONGO_USER`
- `MONGO_PASSWORD`

- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_SECRET`
- `CRYPTO_SECRET`
- `GMAIL_ADDRESS`
- `GMAIL_PASSWORD`
- `NOREPLY_ADDRESS`

( ℹ️ - sample .env config file is provided in the server directory under the name `.env.sample` )

⚙️ To build client app, you will need to add the following environment variables to your .env file

- `VITE_PREVIEW_PORT`
- `VITE_API_URL`

( ℹ️ - sample .env config file is provided in the client app directory under the name `.env.sample` )

## Languages

🔤 Available client app languages: **EN**, **PL**

## Feedback

If you have any feedback, please reach out to me at ✉️ contact@jakubcieslik.com

## Authors

- [@jakubcieslik99](https://www.github.com/jakubcieslik99) (Frontend dev, UI/UX, backend dev, DB management, deployment)

- [@juras99](https://www.github.com/juras99) (Presentation, documentation, some HomeScreen components styling)

Initial versions of this project were developed as part of the subject "Group project" at the _University of Zielona Góra_
under the patronage of _Perceptus Sp. z o.o._. Project was originally called _PercPass_. **Some of the mechanics of the
application were changed after the final presentation.**

<img src="https://i.ibb.co/RPk2grd/privpass-3.png" width="300">
