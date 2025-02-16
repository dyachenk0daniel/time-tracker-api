import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from '@app/config';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Time Tracker API Documentation',
            version: '1.0.0',
            description: 'A simple and efficient API to manage time entries, helping users track their work and productivity with ease.',
        },
        servers: [
            {
                url: `http://${config.server.host}:${config.server.port}`,
            },
        ],
        components: {
            schemas: {
                UserResponse: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '12345',
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            example: 'john.doe@example.com',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-08-01T12:34:56Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-08-01T12:34:56Z',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        error: {
                            type: 'object',
                            properties: {
                                code: {
                                    type: 'string',
                                    example: 'USER_NOT_FOUND',
                                },
                                message: {
                                    type: 'string',
                                    example: 'User not found.',
                                },
                                details: {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            example: 'Additional error details',
                                        },
                                        {
                                            type: 'array',
                                            items: { type: 'object' },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                TimeEntryResponse: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '550e8400-e29b-41d4-a716-446655440000',
                        },
                        userId: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        description: {
                            type: 'string',
                            example: 'Worked on API documentation',
                        },
                        startTime: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-10-01T09:00:00Z',
                        },
                        endTime: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-10-01T17:00:00Z',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-10-01T18:00:00Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-10-01T18:00:00Z',
                        },
                    },
                },
                TimeEntryCreateRequest: {
                    type: 'object',
                    required: ['userId', 'description', 'startTime'],
                    properties: {
                        userId: {
                            type: 'string',
                            description: 'ID of the user',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the time entry',
                            example: 'Worked on API documentation',
                        },
                        startTime: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Start time of the entry',
                            example: '2023-10-01T09:00:00Z',
                        },
                    },
                },
                TimeEntryUpdateRequest: {
                    type: 'object',
                    required: ['userId'],
                    properties: {
                        userId: {
                            type: 'string',
                            description: 'ID of the user',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        description: {
                            type: 'string',
                            description: 'Updated description of the time entry',
                            example: 'Updated description',
                        },
                        startTime: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Updated start time',
                            example: '2023-10-01T09:00:00Z',
                        },
                        endTime: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Updated end time',
                            example: '2023-10-01T17:00:00Z',
                        },
                    },
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.resolve(__dirname, '../interfaces/**/*.ts')],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
