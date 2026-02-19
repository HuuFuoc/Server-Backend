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
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },

  apis: ['./src/routes/*.ts']
}
const swaggerSpec = swaggerJsdoc(swaggerOptions)

export default (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
