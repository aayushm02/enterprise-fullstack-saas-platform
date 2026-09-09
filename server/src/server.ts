import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';
import { SocketServer } from './websocket/socketServer';
import apiRouter from './routes';

const app = express();
const server = http.createServer(app);

// Security & Utility Middlewares
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRateLimiter);

// Root Landing Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>NexusPulse API</title></head>
      <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center;">
        <h1 style="color: #6366f1; margin-bottom: 8px;">🚀 NexusPulse Enterprise API Gateway</h1>
        <p style="color: #94a3b8; margin-bottom: 24px;">Backend API is online and listening on Port 5000.</p>
        <div>
          <a href="http://localhost:3000" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 12px;">👉 Open Frontend Dashboard (Port 3000)</a>
          <a href="/api/v1/health" style="display: inline-block; padding: 12px 24px; background: #1e293b; color: #38bdf8; text-decoration: none; border-radius: 8px; font-weight: bold;">API Health Probe</a>
        </div>
      </body>
    </html>
  `);
});

// Mount API Gateway Routes
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use(globalErrorHandler);

// Initialize WebSocket Gateway
SocketServer.initialize(server);

if (process.env.NODE_ENV !== 'test') {
  server.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 NEXUSPULSE ENTERPRISE PLATFORM API ONLINE`);
    console.log(`📡 Port: ${ENV.PORT} | Environment: ${ENV.NODE_ENV}`);
    console.log(`🔗 Health: http://localhost:${ENV.PORT}/api/v1/health`);
    console.log(`🤖 Multi-Agent AI & RAG Engine Activated`);
    console.log(`====================================================`);
  });
}

export { app, server };
