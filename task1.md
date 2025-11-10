## Objective
    Create a CRUD Application for managing customer accounts. The system needs to do the following.
    
    - Display all customer accounts
    - Read a customer account
    - Create customer accounts
    - Update existing customer accounts
    - Delete a customer account

## Data Model
   Each customer account should have the below fields:

    accountId - auto-generated primary key (UUID)
    firstName - String (Required)
    lastName - String (Required)
    email - String (Required unique)
    phoneNumber - String (Optional)
    address - String (Optional)
    city - String (Optional)
    state - String (Optional)
    country - String (Optional)
    dateCreated - Timestamp (Auto-generated)

## Technologies

    Node.js 20
    Latest version of TypeScript
    TypeORM
    PostgreSQL as the database
    Express for the API framework
    Use tsyringe Dependency injection library
    Use Zod for request validation in routes

## Architecture Guidelines

 - System needs to follow clean architecture principles with clear seperation of concerns between data access, business logic and presentation layers. 

 - Implement a Repository pattern for data access layer

 - Create a service layer for business logic and validation

 - Use dependency injection

 - Implement proper error handling and validation middleware

 - Use **.env** file for configuration


## ESLint Configuration

 - Install ESLint and TypeScript plugins.

 - Verify that everything runs cleanly with no ESLint errors or warnings remaining.


## Testing

Configure Vitest for unit testing

Write unit tests using Vitest for:
    - Service layer business logic
    - Repository layer data operations
    - API endpoint handlers

Run unit tests

Verify all tests pass.