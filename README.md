# Customer Relationship Management Backend

A RESTful API for managing customer accounts built with Node.js, TypeScript, Express, TypeORM, and PostgreSQL, following Clean Architecture principles.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete customer accounts
- **Search Functionality**: Search customers by email or country
- **Clean Architecture**: Separation of concerns with domain, application, infrastructure, and presentation layers
- **Dependency Injection**: Using tsyringe for loose coupling
- **Request Validation**: Zod schemas for type-safe request validation
- **Error Handling**: Centralized error handling middleware
- **Database Migrations**: TypeORM migrations for database schema management
- **Unit Testing**: Comprehensive test coverage with Vitest

## Technology Stack

- **Runtime**: Node.js 20
- **Language**: TypeScript (latest)
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Dependency Injection**: tsyringe
- **Validation**: Zod
- **Testing**: Vitest
- **Linting**: ESLint + Prettier

## Project Structure

```
src/
├── domain/                 # Domain layer (business entities and interfaces)
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces
│   └── errors/            # Domain-specific errors
├── application/           # Application layer (use cases)
│   └── services/          # Business logic services
├── infrastructure/        # Infrastructure layer (external concerns)
│   ├── database/          # Database configuration and migrations
│   ├── entities/          # TypeORM entities
│   ├── repositories/      # Repository implementations
│   └── di/                # Dependency injection setup
└── presentation/          # Presentation layer (API)
    ├── controllers/       # Request handlers
    ├── routes/            # Route definitions
    ├── middleware/        # Express middleware
    └── dto/               # Data Transfer Objects with Zod schemas
```

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 12 or higher
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Customer-Relationship-Management-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (use `.env.example` as a template):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres_username
DB_PASSWORD=postgres_password
DB_DATABASE=postgres_db_name

PORT=3000
NODE_ENV=development
TYPEORM_LOGGING=true
```

4. Create the PostgreSQL database:
```bash
createdb crm_db
```

5. Run database migrations:
```bash
npm run migration:run
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Health check endpoint

### Customers

- **GET** `/api/customers` - Get all customers
- **GET** `/api/customers/:id` - Get a customer by ID
- **GET** `/api/customers/email/:email` - Get a customer by email
- **GET** `/api/customers/country/:country` - Get customers by country
- **POST** `/api/customers` - Create a new customer
- **PUT** `/api/customers/:id` - Update a customer
- **DELETE** `/api/customers/:id` - Delete a customer

### Request/Response Examples

#### Create Customer
```bash
POST /api/customers
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA"
}
```

#### Update Customer
```bash
PUT /api/customers/:id
Content-Type: application/json

{
  "lastName": "Smith",
  "phoneNumber": "9876543210"
}
```

#### Get All Customers
```bash
GET /api/customers
```

#### Get Customer by ID
```bash
GET /api/customers/:id
```

#### Get Customer by Email
```bash
GET /api/customers/email/:email
```

**Example:**
```bash
GET /api/customers/email/john.doe@example.com
```

**Note:** The email parameter should be URL-encoded if it contains special characters. For example, `john.doe+test@example.com` should be encoded as `john.doe%2Btest%40example.com`.

#### Get Customers by Country
```bash
GET /api/customers/country/:country
```

**Example:**
```bash
GET /api/customers/country/USA
```

**Response:** Returns an array of customers from the specified country, ordered by creation date (newest first).

#### Delete Customer
```bash
DELETE /api/customers/:id
```

## Data Model

### Customer
- `accountId` (UUID) - Auto-generated primary key
- `firstName` (string, required) - Customer's first name
- `lastName` (string, required) - Customer's last name
- `email` (string, required, unique) - Customer's email address (indexed for efficient queries)
- `phoneNumber` (string, optional) - Customer's phone number
- `address` (string, optional) - Customer's address
- `city` (string, optional) - Customer's city
- `state` (string, optional) - Customer's state
- `country` (string, optional) - Customer's country (indexed for efficient queries)
- `dateCreated` (timestamp) - Auto-generated creation timestamp

## Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Structure
- Unit tests for services (`application/services/__tests__/`)
- Unit tests for repositories (`infrastructure/repositories/__tests__/`)
- Unit tests for controllers (`presentation/controllers/__tests__/`)

## Database Migrations

### Generate Migration
```bash
npm run migration:generate
```

### Run Migrations
```bash
npm run migration:run
```

### Revert Migration
```bash
npm run migration:revert
```

## Code Quality

### Linting
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint:fix
```

### Format Code
```bash
npm run format
```

## Architecture Principles

This project follows Clean Architecture principles:

1. **Domain Layer**: Contains business entities and repository interfaces. No framework dependencies.
2. **Application Layer**: Contains use cases (services) with business logic and validation.
3. **Infrastructure Layer**: Contains TypeORM entities, repository implementations, and database configuration.
4. **Presentation Layer**: Contains Express routes, controllers, middleware, and DTOs.

### Dependency Rule
- Domain layer has no dependencies
- Application layer depends only on the domain layer
- Infrastructure layer depends on domain and application layers
- Presentation layer depends on all other layers

## Error Handling

The application uses centralized error handling middleware that:
- Returns appropriate HTTP status codes
- Provides meaningful error messages
- Handles domain-specific errors (CustomerNotFoundError, EmailAlreadyExistsError)
- Hides sensitive information in production

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres_username` |
| `DB_PASSWORD` | Database password | `postgres_password` |
| `DB_DATABASE` | Database name | `postgres_db_name` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `TYPEORM_LOGGING` | Enable TypeORM logging | `true` |
| `FRONTEND_URL` | Frontend URL for CORS (comma-separated for multiple origins) | - |

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For issues and questions, please open an issue on the repository.

