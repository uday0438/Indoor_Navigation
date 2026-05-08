# KEC Indoor Campus Navigation 🧭

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

An AI-powered, sensor-driven indoor navigation application designed specifically for the Kuppam Engineering College (KEC) campus. This mobile application solves the "indoor GPS blind-spot" by utilizing advanced Pedestrian Dead Reckoning (PDR) and custom vector mapping to provide highly accurate, offline-capable wayfinding.

---

## 📲 Quick Access (Production)

| Item | Details |
| :--- | :--- |
| **Backend API** | [https://indoor-nav-backend.onrender.com](https://indoor-nav-backend.onrender.com) |
| **Android APK** | [**Download Latest APK**](https://expo.dev/accounts/uday0438/projects/kec-indoor-nav/builds/cd5b2794-3954-4ea6-b40d-519174e968e2) |

---

## ✨ Key Features

- **📍 Sensor Fusion Navigation:** Uses smartphone Accelerometers, Gyroscopes, and Magnetometers to track movement with sub-meter accuracy without relying on external hardware (BLE/Beacons).
- **🗺️ Interactive Vector Maps:** Buttery-smooth, multi-floor SVG mapping with pinch-to-zoom and pan capabilities.
- **🧠 Intelligent Pathfinding:** Implements Dijkstra's Algorithm on a custom spatial graph to calculate the shortest paths, including stairs and elevators.
- **📴 Offline Fallback:** A robust, zero-connectivity mode ensuring navigation never stops, even in campus Wi-Fi dead zones.
- **🗣️ Multi-Lingual Voice Guidance:** Turn-by-turn spoken instructions available in English, Hindi, Telugu, Kannada, and Tamil.
- **🌗 Dynamic UI Theming:** Fully integrated Dark and Light modes for accessibility and battery preservation.

## 🏗️ Architecture & Tech Stack

This project is built using a decoupled Client-Server architecture:

*   **Frontend (Mobile):** React Native (Expo), TypeScript, Zustand (State Management), React Native SVG.
*   **Backend (API):** Node.js, Express.js, Socket.IO (Real-time tracking).
*   **Database:** MongoDB Atlas & Mongoose (Spatial Node storage).

## 🚀 Step-by-Step: How to Proceed

### 1. Backend Hosting (Render)
The backend is already hosted on Render. If you need to re-deploy:
1. Push the `backend` folder to a new GitHub repository.
2. Create a "Web Service" on [Render.com](https://render.com).
3. Set the build command to `npm install` and start command to `node server.js`.
4. Update the `MONGODB_URI` environment variable.

### 2. Mobile App Configuration
Before building your own APK, ensure the API points to your live server:
1. Open `mobile/src/utils/constants.ts`.
2. Set `API_URL` to your hosted URL (e.g., `https://your-app.onrender.com`).

### 3. Generate Your Own APK
1. Install EAS CLI: `npm install -g eas-cli`.
2. Login: `eas login`.
3. Run Build: `eas build -p android --profile preview`.
4. Follow the download link provided at the end of the build.

## 🛠️ Local Development Setup

### Backend Setup
```bash
cd backend
npm install
# Configure your .env file with your MongoDB URI
node src/data/seedData.js  # Seeds the database with KEC map data
node server.js             # Starts the server
```

### Mobile App Setup
```bash
cd mobile
npm install
npx expo start
```
*Scan the QR code with the **Expo Go** app on your Android or iOS device to start testing.*

## 🤝 Project Team
*   **Mr. K. Uday Bhaskar** — Developer
*   **Ms. P. Sravya** — Project Lead & UI/UX Designer

---
*Developed for the Department of Electronics & Communication Engineering, Kuppam Engineering College.*

