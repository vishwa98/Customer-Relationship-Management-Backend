import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import 'reflect-metadata';
import customerRoutes from './routes/customer.routes';
import { errorMiddleware } from './middleware/error.middleware';
import { swaggerSpec } from './config/swagger.config';

export function createApp(): Application {
  const app = express();

  // CORS configuration
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    console.warn(
      'WARNING: FRONTEND_URL environment variable is not set. CORS is configured to allow all origins in development.'
    );
  }

  // Support multiple origins (comma-separated) or single origin
  const allowedOrigins = frontendUrl ? frontendUrl.split(',').map(url => url.trim()) : [];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          return callback(null, true);
        }

        // If FRONTEND_URL is not set, allow all origins (development only)
        if (allowedOrigins.length === 0) {
          return callback(null, true);
        }

        // Check if the origin is in the allowed list
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Origin not allowed
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use('/api', customerRoutes);

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     tags: [Health]
   *     description: Check if the API is running
   *     responses:
   *       200:
   *         description: API is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   */
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
}
