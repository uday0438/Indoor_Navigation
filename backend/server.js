require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { initializeSocket } = require('./src/services/socketService');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

// Routes
const locationRoutes = require('./src/routes/locationRoutes');
const floorRoutes    = require('./src/routes/floorRoutes');
const routeRoutes    = require('./src/routes/routeRoutes');

const PORT = process.env.PORT || 3001;

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const app = express();
  const server = http.createServer(app);

  // Socket.IO
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });
  initializeSocket(io);

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'KEC Indoor Navigation', timestamp: new Date() });
  });

  // API Routes
  app.use('/api/locations', locationRoutes);
  app.use('/api/floors',    floorRoutes);
  app.use('/api/route',     routeRoutes);

  // Graph endpoint lives under route
  app.use('/api/graph', (req, res, next) => {
    req.url = '/graph';
    routeRoutes(req, res, next);
  });

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║  KEC Indoor Navigation — Backend Server             ║
║  Running on port ${PORT}                               ║
║  Socket.IO: ws://localhost:${PORT}                      ║
║  REST API:  http://localhost:${PORT}/api                ║
╚══════════════════════════════════════════════════════╝
    `);
  });
}

startServer().catch(console.error);
