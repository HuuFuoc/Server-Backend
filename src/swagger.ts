import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { Express } from 'express'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TS API',
      version: '1.0.0',
      description: 'Swagger for Express + TypeScript'
    },
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
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      },
      {
        url: 'https://your-domain.com',
        description: 'Production server'
      }
    ]
  },

  apis: ['./src/routes/*.ts']
}
const swaggerSpec = swaggerJsdoc(swaggerOptions)

export default (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
