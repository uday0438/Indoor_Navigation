# Indoor Navigation System - Project Analysis & Status

## 📋 Project Overview
This is a full-stack indoor navigation application for KEC Sir Visveswaraiah Block. It uses:
- **Backend**: Node.js + Express + MongoDB + Socket.IO
- **Mobile**: React Native (Expo) + TypeScript
- **Real-time Updates**: WebSocket via Socket.IO

---

## 🏗️ Architecture

### Backend (Node.js + Express)
**Location**: `backend/`
**Port**: 3001
**Key Components**:
- `server.js` - Express server & Socket.IO setup
- `config/db.js` - MongoDB connection
- **Models**: `Floor.js`, `Location.js` - Database schemas
- **Routes**:
  - `/api/locations` - Building locations
  - `/api/floors` - Floor information
  - `/api/route` - Route calculation & graph data
- **Services**:
  - `navigationEngine.js` - Pathfinding algorithm
  - `socketService.js` - Real-time updates
  - `graphUtils.js` - Graph algorithms
- **Middleware**: `errorHandler.js` - Error management

### Mobile App (React Native + Expo)
**Location**: `mobile/`
**Framework**: Expo 54+, React Native 0.81+
**Key Components**:
- `App.tsx` - Root component with navigation setup
- **Screens**:
  - `HomeScreen.tsx` - Entry point
  - `MapScreen.tsx` - Floor map display
  - `NavigationScreen.tsx` - Active navigation view
- **Services**:
  - `ApiService.ts` - REST API client
  - `SensorFusionEngine.ts` - IMU/Sensor data processing
  - `SocketService.ts` - WebSocket connection
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: Zustand
- **Features**: Accelerometer, Gyroscope, Magnetometer integration

---

## 🔧 Configuration

### Database
- **Type**: MongoDB (Local instance on 127.0.0.1:27017)
- **Database**: `kec_indoor_nav`
- **Connection**: `.env` file configured

### API Server
- **URL**: `http://10.133.125.170:3001` (Your machine IP - already correct!)
- **Environment**: Node v24.14.1, npm 11.11.0

### Mobile API Connection
- **Config File**: `mobile/src/utils/constants.ts`
- **Current API URL**: `http://10.133.125.170:3001` ✅

---

## 🚀 Running the Project

### Step 1: Start Backend
```bash
cd backend
npm install  # If not done
node server.js
```
✅ **Status**: Backend running on port 3001, MongoDB connected

### Step 2: Start Mobile App
```bash
cd mobile
npm install  # If not done
npx expo start --clear
```
✅ **Status**: Expo bundler started, Metro bundler compiling...

### To Test on Phone
1. Install **Expo Go** app (App Store or Google Play)
2. Scan the QR code shown in the terminal
3. App loads and connects to backend

---

## 📊 Dependencies Summary

### Backend
- **express** (4.21.0) - Web framework
- **mongoose** (8.6.0) - MongoDB ORM
- **socket.io** (4.7.5) - WebSocket server
- **cors** (2.8.5) - Cross-origin requests
- **dotenv** (16.4.5) - Environment variables
- **nodemon** (dev) - Auto-restart during development

### Mobile
- **expo** (54+) - React Native framework
- **react-native** (0.81.5) - Core framework
- **socket.io-client** (4.7.5) - WebSocket client
- **zustand** (4.5.5) - State management
- **react-navigation** (6+) - Screen navigation
- **expo-sensors** - Hardware sensors
- **TypeScript** (5.3.3) - Type safety

---

## 🔍 Key Features

### Navigation Engine
- Dijkstra's algorithm for pathfinding
- Graph-based building model
- Real-time route recalculation

### Sensor Fusion
- Accelerometer: Step detection
- Gyroscope: Orientation tracking
- Magnetometer: Compass heading
- Kalman filtering for smoothing

### Real-time Features
- Live position updates via Socket.IO
- Multi-user support
- Real-time voice guidance (expo-speech)

---

## ✅ Current Status

| Component | Status | Details |
|-----------|--------|---------|
| Backend | ✅ Running | Port 3001, MongoDB connected |
| Mobile App | ✅ Bundling | Metro bundler compiling |
| Database | ✅ Connected | 127.0.0.1:27017 |
| API Config | ✅ Correct | IP: 10.133.125.170:3001 |
| Dependencies | ✅ Installed | Both backend & mobile |

---

## 📝 Next Steps

1. **Wait for Expo bundler to finish** (check terminal output)
2. **Scan QR code** with Expo Go app on your phone
3. **Test navigation**: 
   - Select a floor from home screen
   - Choose start & end location
   - App calculates route using backend pathfinding
4. **Monitor terminals**: Keep both running during testing

---

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Ensure MongoDB is running: `mongod` in another terminal
- Check connection string in `.env` file

### Mobile can't connect to backend
- Verify IP address: `ipconfig` (should be 10.133.125.170)
- Check `mobile/src/utils/constants.ts` API_URL matches your IP
- Ensure backend is running

### Expo QR code not scanning
- Make sure phone & computer are on same WiFi
- Redeploy with `npx expo start --clear`

---

## 📞 Project Structure Summary
```
Indoornavigationsystem-main/
├── backend/               # Node.js Express server
│   ├── server.js         # Entry point
│   ├── package.json      # Dependencies
│   ├── .env              # Configuration
│   ├── config/           # Database setup
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Error handling
│   │   └── data/         # Seed data
│   └── src/utils/        # Utilities
│
└── mobile/               # React Native Expo app
    ├── App.tsx          # Root component
    ├── package.json     # Dependencies
    ├── tsconfig.json    # TypeScript config
    └── src/
        ├── screens/     # UI screens
        ├── services/    # API & sensors
        ├── navigation/  # Screen navigation
        ├── store/       # State management
        ├── hooks/       # Custom hooks
        ├── types/       # TypeScript types
        └── utils/       # Utilities & config
```

---

**Generated**: March 2026
**IP Address**: 10.133.125.170
**Backend Port**: 3001
**MongoDB**: Connected ✅
