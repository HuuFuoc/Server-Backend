import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { Express } from 'express'

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TS API',
      version: '1.0.0',
      description: 'Swagger for Express + TypeScript'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      },
      {
        url: 'https://api-server-backend.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            handbagName: { type: 'string' },
            cost: { type: 'number' },
            category: { type: 'string' },
            color: {
              type: 'array',
              items: { type: 'string' }
            },
            gender: { type: 'boolean' },
            uri: { type: 'string' },
            brand: { type: 'string' },
            percentOff: { type: 'number' }
          }
        },

        Perfume: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            perfumeName: { type: 'string' },
            uri: { type: 'string' },
            price: { type: 'number' },
            concentration: { type: 'string' },
            description: { type: 'string' },
            ingredients: { type: 'string' },
            volume: { type: 'number' },
            targetAudience: { type: 'string' },
            brand: { type: 'string' }
          }
        },

        PerfumeReqBody: {
          type: 'object',
          required: [
            'perfumeName',
            'uri',
            'price',
            'concentration',
            'description',
            'ingredients',
            'volume',
            'targetAudience',
            'brand'
          ],
          properties: {
            perfumeName: { type: 'string' },
            uri: { type: 'string' },
            price: { type: 'number' },
            concentration: { type: 'string' },
            description: { type: 'string' },
            ingredients: { type: 'string' },
            volume: { type: 'number' },
            targetAudience: { type: 'string' },
            brand: { type: 'string' }
          }
        },

        Brand: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            logo: { type: 'string' },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'] // đảm bảo đúng path file route
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

export default function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
