// Custom Next.js server with Socket.io support
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeSocketServer } from './websocket/socket-server';
import { handleConnection } from './websocket/handlers/connection.handler';
import { FlightMonitoringService } from './websocket/services/flight-monitoring.service';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = initializeSocketServer(httpServer);

  // Set up monitoring service with Socket.io instance
  const monitoringService = FlightMonitoringService.getInstance();
  monitoringService.setSocketServer(io);

  // Handle WebSocket connections
  io.on('connection', handleConnection);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM signal received: closing HTTP server');
    monitoringService.cleanup();
    httpServer.close(() => {
      console.log('[Server] HTTP server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('[Server] SIGINT signal received: closing HTTP server');
    monitoringService.cleanup();
    httpServer.close(() => {
      console.log('[Server] HTTP server closed');
      process.exit(0);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> WebSocket server ready at ws://${hostname}:${port}/api/socket`);
    });
});
