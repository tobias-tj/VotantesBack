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
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },  
      schemas: {
        // LOGIN REQUEST
        Login: {
          type: 'object',
          required: ['cedulaPlanillero', 'password'],
          properties: {
            cedulaPlanillero: {
              type: 'number',
              example: 1234567,
            },
            password: {
              type: 'string',
              example: 'password',
            },
          },
        },

        // LOGIN RESPONSE
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                result: {
                  type: 'object',
                  properties: {
                    cedulaPlanillero: {
                      type: 'number',
                      example: 1234567,
                    },
                    isAdmin: {
                      type: 'boolean',
                      example: true,
                    },
                  },
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
            message: {
              type: 'string',
              example: 'Login exitoso',
            },
          },
        },

        // REGISTER REQUEST
        Register: {
          type: 'object',
          required: ['cedulaPlanillero', 'nombreCompleto', 'password'],
          properties: {
            cedulaPlanillero: {
              type: 'number',
              example: 1234567,
            },
            nombreCompleto: {
              type: 'string',
              example: 'Rodolfo Waled',
            },
            password: {
              type: 'string',
              example: '123456',
            },
          },
        },

        // REGISTER RESPONSE
        RegisterResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Planillero registrado correctamente',
            },
          },
        },

        // CREATE PLANILLA DTO
        CreatePlanillaDTO: {
          type: 'object',
          required: ['cedulaDirigente', 'nombreDirigente', 'cedulasVotantes'],
          properties: {
            cedulaDirigente: {
              type: 'number',
              example: 1234567,
            },
            nombreDirigente: {
              type: 'string',
              example: 'Rodolfo Waled',
            },
            cedulasVotantes: {
              type: 'array',
              items: {
                type: 'number',
                example: 1234567,
              },
            }
          },
        },

        // PLANILLA RESPONSE
        Planilla: {
          type: 'object',
          properties: {
            planillaId: {
              type: 'integer',
              example: 1,
            },
            cedulasRepetidas: {
              type: 'array',
              items: {
                type: 'number',
                example: 1234567,
              },
            },
            message: {
              type: 'string',
              example: 'Planilla creada exitosamente',
            },
          },
        },
      },
    },
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
