import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { env } from './config/env';
// import votanteRoutes from './routes/votante.routes';
import { errorHandler } from './middlewares/errorHandler';
import planillaRoutes from './routes/planilla.routes';
import accessCheckoutRoutes from './routes/access.routes';
import dirigenteRoutes from './routes/dirigente.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
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
          required: ['cedulaPlanillero', 'password', 'selectedCityType'],
          properties: {
            cedulaPlanillero: {
              type: 'number',
              example: 1234567,
            },
            password: {
              type: 'string',
              example: 'password',
            },
            selectedCityType: {
              type: 'number',
              example: 0,
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
                    selectedCityType: {
                      type: 'number',
                      example: 0,
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
            selectedCityType: {
              type: 'number',
              example: 0,
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
        // PLANILLA GET VALIDATION
        PlanillaGetValidation: {
          type: 'object',
          properties: {
            filterText: {
              type: 'string',
              example: 'text',
            },
            filterDate: {
              type: 'string',
              example: '2022-01-01',
            },
            filterSize: {
              type: 'integer',
              example: 10,
            },
            filterPage: {
              type: 'integer',
              example: 1,
            },
          },
        },

        // Planilla DTO
        PlanillaDTO: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            cedulaDirigente: { type: 'number', example: 1234567 },
            nombreDirigente: { type: 'string', example: 'Rodolfo Waled' },
            fechaCreacion: { type: 'string', format: 'date-time', example: '2026-02-19T10:00:00.000Z' },
            cedulaPlanillero: { type: 'number', example: 9876543 },
            nombrePlanillero: { type: 'string', example: 'Carlos Gomez' },
            totalEnviados: { type: 'integer', example: 50 },
            totalValidos: { type: 'integer', example: 45 },
            totalNoExistentes: { type: 'integer', example: 5 },
            votantes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  cedula_votante: { type: 'number', example: 1234567 },
                  nombre: { type: 'string', example: 'Juan' },
                  apellido: { type: 'string', example: 'Perez' }
                }
              }
            }
          }
        },


        // Planilla Get Validation Response
        PlanillaGetValidationResponse: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1
            },
            size: {
              type: 'integer',
              example: 25
            },
            totalElements: {
              type: 'integer',
              example: 132
            },
            totalPages: {
              type: 'integer',
              example: 6
            },
            content: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PlanillaDTO'
              }
            }
          }
        },

        // Get Estadisticas Response DTO
        GetEstadisticasResponseDTO: {
          type: 'object',
          properties: {
            totalPlanillas: {
              type: 'integer',
              example: 10
            },
            totalEnviados: {
              type: 'integer',
              example: 100
            },
            totalValidos: {
              type: 'integer',
              example: 90
            },
            totalNoEncontrados: {
              type: 'integer',
              example: 10
            }
          }
        },

        // Dirigente Get Estadisticas Response DTO
        DirigenteGetEstadisticasResponse: {
          type: 'object',
          properties: {
            cedulaDirigente: {
              type: 'integer',
              example: 1234567
            },
            nombreDirigente: {
              type: 'string',
              example: 'Rodolfo Waled'
            },
            totalPlanillas: {
              type: 'integer',
              example: 10
            },
            totalEnviados: {
              type: 'integer',
              example: 100
            },
            totalNoEncontrados: {
              type: 'integer',
              example: 10
            },
            planillas: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/EstadisticaDirigenteDTO'
              }
            }
          }
        },

        // Estadistica Dirigente DTO
        EstadisticaDirigenteDTO: {
          type: 'object',
          properties: {
            planillaId: {
              type: 'integer',
              example: 1
            },
            fechaCreacion: {
              type: 'string',
              example: '2022-01-01'
            },
            totalEnviados: {
              type: 'integer',
              example: 10
            },
            totalNoEncontrados: {
              type: 'integer',
              example: 10
            }
          }
        },

        // Planilla Borrada Response DTO
        PlanillaBorradaResponseDTO: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Planilla borrada exitosamente'
            }
          }
        }
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

if (env.nodeEnv !== 'production') {
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// Routes
// app.use('/api/votantes', votanteRoutes);
app.use('/api/planilla', planillaRoutes);
app.use('/api/access', accessCheckoutRoutes);
app.use('/api/dirigente', dirigenteRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  if (env.nodeEnv !== 'production') {
    res.json({
      message: 'Welcome to the Votantes API',
      docs: `http://localhost:${env.port}/api-docs`,
    });
  } else {
    res.json({
      message: 'Welcome to the Votantes API',
    });
  }
});

// Error Handling (Must be last)
app.use(errorHandler);

export default app;
