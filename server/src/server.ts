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
