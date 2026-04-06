const { checkAndRecalculate } = require('./navigationEngine');

/**
 * Socket.IO realtime position tracking and route updates
 */
function initializeSocket(io) {
  // Track active navigation sessions
  const activeSessions = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Client sends position updates
    socket.on('user:position', async (data) => {
      // data: { x, y, floor, heading, timestamp }
      const session = activeSessions.get(socket.id);
      if (!session) return;

      try {
        const result = await checkAndRecalculate(
          { x: data.x, y: data.y, floor: data.floor },
          session.currentPath,
          session.destinationId
        );

        if (result.onRoute) {
          socket.emit('user:route_update', {
            remainingPath: result.remainingPath,
            completedPercent: result.completedPercent,
          });
        } else {
          // Off route — send recalculated route
          session.currentPath = result.path;
          socket.emit('user:off_route', {
            recalculatedRoute: result,
            message: 'Route recalculated',
          });
        }

        // Check if arrived (within 3m of destination)
        const dest = session.currentPath[session.currentPath.length - 1];
        if (dest && dest.floor === data.floor) {
          const dx = dest.x - data.x;
          const dy = dest.y - data.y;
          const distToDest = Math.sqrt(dx * dx + dy * dy);
          if (distToDest < 3) {
            socket.emit('user:arrived', {
              destinationId: session.destinationId,
              message: `You have arrived at ${dest.label || dest.name}!`,
            });
            activeSessions.delete(socket.id);
          }
        }
      } catch (err) {
        console.error('Route check error:', err.message);
      }
    });

    // Client starts navigation
    socket.on('navigation:start', (data) => {
      // data: { path: [...], destinationId }
      activeSessions.set(socket.id, {
        currentPath: data.path,
        destinationId: data.destinationId,
        startTime: Date.now(),
      });
      console.log(`🧭 Navigation started: ${socket.id} → ${data.destinationId}`);
    });

    // Client stops navigation
    socket.on('navigation:stop', () => {
      activeSessions.delete(socket.id);
      console.log(`🛑 Navigation stopped: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      activeSessions.delete(socket.id);
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { initializeSocket };
