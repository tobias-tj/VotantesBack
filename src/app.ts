import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { env } from './config/env';
import votanteRoutes from './routes/votante.routes';
import { errorHandler } from './middlewares/errorHandler';
import planillaRoutes from './routes/planilla.routes';
import accessCheckoutRoutes from './routes/access.routes';
import dirigenteRoutes from './routes/dirigente.routes';

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

      // Planilla Get Validation Response
      PlanillaGetValidationResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                },
                cedulaDirigente: {
                  type: 'number',
                  example: 1234567,
                },
                nombreDirigente: {
                  type: 'string',
                  example: 'Rodolfo Waled',
                },
                fechaCreacion: {
                  type: 'string',
                  example: '2022-01-01',
                },
                cedulaPlanillero: {
                  type: 'number',
                  example: 1234567,
                },
                totalEnviados: {
                  type: 'integer',
                  example: 10,
                },
                totalValidos: {
                  type: 'integer',
                  example: 10,
                },
                totalNoExistentes: {
                  type: 'integer',
                  example: 10,
                },
                votantes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      cedula: {
                        type: 'number',
                        example: 1234567,
                      },
                      nombre: {
                        type: 'string',
                        example: 'Rodolfo Waled',
                      },
                      apellido: {
                        type: 'string',
                        example: 'Waled',
                      },
                      sexo: {
                        type: 'string',
                        example: "masculino"
                      },
                      fechaNacimiento: {
                        type: 'string',
                        example: '2022-01-01'
                      },
                      fechaInscripcion: {
                        type: 'string',
                        example: '2022-01-01'
                      },
                      tipo: {
                        type: 'string',
                        example: 'votante'
                      },
                      direccion: {
                        type: 'string',
                        example: 'Calle 123'
                      },
                      votoPlra: {
                        type: 'string',
                        example: 'votoPlra'
                      },
                      votoAnr: {
                        type: 'string',
                        example: 'votoAnr'
                      },
                      votoGenerales: {
                        type: 'string',
                        example: 'votoGenerales'
                      },
                      afiliaciones: {
                        type: 'string',
                        example: 'afiliaciones'
                      },
                      afiliadoPlra2025: {
                        type: 'string',
                        example: 'afiliadoPlra2025'
                      },
                      departamentoNombre: {
                        type: 'string',
                        example: 'departamentoNombre'
                      },
                      distritoNombre: {
                        type: 'string',
                        example: 'distritoNombre'
                      },
                      zonaNombre: {
                        type: 'string',
                        example: 'zonaNombre'
                      },
                      comiteNombre: {
                        type: 'string',
                        example: 'comiteNombre'
                      },
                      localGenerales: {
                        type: 'string',
                        example: 'localGenerales'
                      },
                      localInterna: {
                        type: 'string',
                        example: 'localInterna'
                      },
                    },
                  },
                },
              },
            },
          },
        },
       },
       DirigenteGetAllResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                cedulaDirigente: {
                  type: 'number',
                  example: 1234567,
                },
                nombreDirigente: {
                  type: 'string',
                  example: 'Rodolfo Waled',
                },
              },
            },
          },
        },
       }
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/votantes', votanteRoutes);
app.use('/api/planilla', planillaRoutes);
app.use('/api/access', accessCheckoutRoutes);
app.use('/api/dirigente', dirigenteRoutes);

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
