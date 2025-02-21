# ebuddy-turborepo  
Ebuddy-Turborepo is a monorepo setup using Turborepo to manage a Next.js frontend and a Node.js backend efficiently. It includes shared utilities and integrates Firebase for authentication and storage.

## How to Run

Clone the Repository:
```
git clone git@github.com:xminds/ebuddy-turborepo.git
cd ebuddy-turborepo
```

Install Dependencies:
```
npm install
```

Install Turbo (if not already installed):
```
npm install -g turbo
```

Start the Development Servers:
```
turbo run dev
```
* The frontend will be available at http://localhost:3000
* The backend will run at http://localhost:5000



## Running Firebase Emulator for Auth and Storage

To ensure the correct configuration of ports and project settings, use the `firebase.json` file in the root folder:
```
firebase emulators:start --only auth,firestore
```
This will properly configure Firestore, Authentication, and any other Firebase services used in development.

### Prerequisites
1. Install Firebase CLI (if not installed):
    ```
    npm install -g firebase-tools
    ```
2. The Firebase Emulator requires Java to run. Install Java (JDK 8 or later) from the official source: [Download Java](https://www.oracle.com/java/technologies/downloads/?er=221886)


## Notes

* Ensure dependencies are installed (npm install) before running.
* If the frontend fails to start, run `turbo build` first.
* Check for port conflicts (Frontend: 3000, Backend: 5000 by default).
* `.env` files are committed without sensitive credentials. For testing, you don't have to update anything.


