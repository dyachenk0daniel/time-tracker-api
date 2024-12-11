import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from '@app/config';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Private Lock API Documentation',
      version: '1.0.0',
      description:
        "Private Lock API provides a secure and efficient solution for managing sensitive information, including passwords, personal notes, and other confidential data. This API empowers developers to integrate advanced password management features into their applications, ensuring encrypted storage, robust authentication, and seamless access controls. Whether you're building a personal security tool or an enterprise-level solution, Private Lock API offers the foundation for top-notch security and user convenience.",
    },
    servers: [
      {
        url: `http://${config.server.host}:${config.server.port}`,
      },
    ],
  },
  apis: [path.resolve(__dirname, '../interfaces/**/*.ts')],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
