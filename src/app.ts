import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { env } from './config/env';
import votanteRoutes from './routes/votante.routes';
import { errorHandler } from './middlewares/errorHandler';
import planillaRoutes from './routes/planilla.routes';
import accessCheckoutRoutes from './routes/access.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js TypeScript Backend Votantes',
      version: '1.0.0',
      description: 'A clean architecture backend template',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/votantes', votanteRoutes);
app.use('/planilla', planillaRoutes);
app.use('/access', accessCheckoutRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    docs: `http://localhost:${env.port}/api-docs`,
  });
});

// Error Handling (Must be last)
app.use(errorHandler);

export default app;
