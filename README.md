# ebuddy-turborepo  
Ebuddy-Turborepo is a monorepo setup using Turborepo to manage a Next.js frontend and a Node.js backend efficiently. It includes shared utilities and integrates Firebase for authentication and storage.

## How to Run

Clone the Repository:
```
git clone git@github.com:xminds/ebuddy-turborepo.git
cd ebuddy-turborepo
```

Install Dependencies
```
npm install
```

Build the project:
```
turbo run build
```

Start Development Servers:

```
turbo run dev
```


## Running Firebase Emulator for Auth and Storage

To start the Firebase emulator suite for authentication and storage, run:

```
npx firebase emulators:start --only auth,storage
```

Make sure you have Firebase CLI installed. If not, install it globally:
```
npm install -g firebase-tools
```


## Notes

* Ensure dependencies are installed (npm install) before running.

* If the frontend fails to start, run `turbo run build` first.
* Check for port conflicts (Frontend: 3000, Backend: 5000 by default).
* `.env` files are committed without sensitive credentials. For testing, you don't have to update anything.


