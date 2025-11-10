import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customer Relationship Management API',
      version: '1.0.0',
      description:
        'A RESTful API for managing customer accounts built with Node.js, TypeScript, Express, TypeORM, and PostgreSQL',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Customers',
        description: 'Customer management endpoints',
      },
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          required: ['accountId', 'firstName', 'lastName', 'email', 'dateCreated'],
          properties: {
            accountId: {
              type: 'string',
              format: 'uuid',
              description: 'Auto-generated customer ID',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            firstName: {
              type: 'string',
              maxLength: 255,
              description: 'Customer first name',
              example: 'John',
            },
            lastName: {
              type: 'string',
              maxLength: 255,
              description: 'Customer last name',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Customer email address (unique)',
              example: 'john.doe@example.com',
            },
            phoneNumber: {
              type: 'string',
              maxLength: 20,
              description: 'Customer phone number',
              example: '1234567890',
            },
            address: {
              type: 'string',
              description: 'Customer address',
              example: '123 Main St',
            },
            city: {
              type: 'string',
              maxLength: 100,
              description: 'Customer city',
              example: 'New York',
            },
            state: {
              type: 'string',
              maxLength: 100,
              description: 'Customer state',
              example: 'NY',
            },
            country: {
              type: 'string',
              maxLength: 100,
              description: 'Customer country',
              example: 'USA',
            },
            dateCreated: {
              type: 'string',
              format: 'date-time',
              description: 'Customer creation timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateCustomerRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            firstName: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Customer first name',
              example: 'John',
            },
            lastName: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Customer last name',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Customer email address (must be unique)',
              example: 'john.doe@example.com',
            },
            phoneNumber: {
              type: 'string',
              maxLength: 20,
              description: 'Customer phone number',
              example: '1234567890',
            },
            address: {
              type: 'string',
              description: 'Customer address',
              example: '123 Main St',
            },
            city: {
              type: 'string',
              maxLength: 100,
              description: 'Customer city',
              example: 'New York',
            },
            state: {
              type: 'string',
              maxLength: 100,
              description: 'Customer state',
              example: 'NY',
            },
            country: {
              type: 'string',
              maxLength: 100,
              description: 'Customer country',
              example: 'USA',
            },
          },
        },
        UpdateCustomerRequest: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Customer first name',
              example: 'John',
            },
            lastName: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Customer last name',
              example: 'Smith',
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Customer email address (must be unique)',
              example: 'john.smith@example.com',
            },
            phoneNumber: {
              type: 'string',
              maxLength: 20,
              description: 'Customer phone number',
              example: '9876543210',
            },
            address: {
              type: 'string',
              description: 'Customer address',
              example: '456 Oak Ave',
            },
            city: {
              type: 'string',
              maxLength: 100,
              description: 'Customer city',
              example: 'Los Angeles',
            },
            state: {
              type: 'string',
              maxLength: 100,
              description: 'Customer state',
              example: 'CA',
            },
            country: {
              type: 'string',
              maxLength: 100,
              description: 'Customer country',
              example: 'USA',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type',
              example: 'Customer not found',
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Customer with id 123 not found',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation error',
            },
            message: {
              type: 'string',
              example: 'Invalid request data',
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Customer not found',
                message: 'Customer with id 123 not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
              example: {
                error: 'Validation error',
                message: 'Invalid email format',
              },
            },
          },
        },
        Conflict: {
          description: 'Conflict error (e.g., email already exists)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Email already exists',
                message: 'A customer with this email already exists',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Internal server error',
                message: 'An unexpected error occurred',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/presentation/routes/*.ts', './src/presentation/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
