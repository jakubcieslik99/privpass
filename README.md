# <img src="https://i.ibb.co/Pg2Qwk9/percpass-1.png" width="600">

## PercPASS 🔐

📌 Simple yet complete OTP accessed password manager app with REST API server, based on the MERN stack. Project contains
Express.js app as a backend (server) and React app as a frontend (client).

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/jakubcieslik99/percpass?color=orange&filename=server%2Fpackage.json&label=server%20version)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/jakubcieslik99/percpass?color=orange&filename=client%2Fpackage.json&label=client%20version)
![GitHub top language](https://img.shields.io/github/languages/top/jakubcieslik99/percpass)
![GitHub repo size](https://img.shields.io/github/repo-size/jakubcieslik99/percpass)
[![Website)](https://img.shields.io/website?label=demo%20website&url=https%3A%2F%2Fpercpass.jakubcieslik.com%2F)](https://percpass.jakubcieslik.com/)

## Features

- Access via OTP sent to the email address
- Adding, editing and deleting passwords
- Getting user's selected password
- Sorting and searching through all user's passwords
- Storing encrypted passwords

## Screenshots

<img src="https://i.ibb.co/ZxYmFqL/percpass-2.png" width="800">

## Run Locally

- Clone repository

```bash
  git clone https://github.com/jakubcieslik99/percpass.git
```

ℹ️ Instructions for running server app locally:

- Navigate to the server directory and install dependencies

```bash
  cd percpass/server
  npm install
```

- Run server app in development mode

```bash
  npm run dev
  npm run dev:win   //only on Windows
```

ℹ️ Instructions for running client app locally:

- Navigate to the client directory and install dependencies

```bash
  cd percpass/client
  npm install
```

- Run client app in development mode

```bash
  npm run dev
  npm run dev:win   //only on Windows
```

## Deployment

ℹ️ Instructions for building and running server app in production

- Transpile to production build

```bash
  npm run build
```

- Run server app in production mode

```bash
  npm install --omit=dev
  npm run prod
```

ℹ️ Instructions for building client app to production

- Create production build

```bash
  npm run build
```

## Environment Variables

⚙️ To run server app, you will need to add the following environment variables to your .env file

- `ENV`

- `PORT`

- `IP`

- `API_URL`

- `WEBAPP_URL`

- `MONGODB_URI`

- `JWT_ACCESS_TOKEN_SECRET`

- `JWT_REFRESH_TOKEN_SECRET`

- `CRYPTO_SECRET`

- `GMAIL_ADDRESS`

- `GMAIL_PASSWORD`

- `NOREPLY_ADDRESS`

⚙️ To build client app, you will need to add the following environment variables to your .env file

- `REACT_APP_ENV`

- `REACT_APP_API_URL`

## Languages

🔤 Available client app languages: **PL**

## Feedback

If you have any feedback, please reach out to me at ✉️ contact@jakubcieslik.com

## Authors

- [@jakubcieslik99](https://www.github.com/jakubcieslik99) (Frontend dev, UI/UX, backend dev, DB management, deployment)

- [@juras99](https://www.github.com/juras99) (Presentation, documentation, some HomeScreen components styling)

This project was developed as part of the subject "Group project" at the _University of Zielona Góra_ under the patronage of
_Perceptus Sp. z o.o._

<img src="https://i.ibb.co/RPk2grd/percpass-3.png" width="300">
