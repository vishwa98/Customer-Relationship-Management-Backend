import { Router } from 'express';
import { container } from 'tsyringe';
import { CustomerController } from '../controllers/CustomerController';
import { validate } from '../middleware/validation.middleware';
import { createCustomerSchema } from '../dto/create-customer.dto';
import { updateCustomerSchema } from '../dto/update-customer.dto';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management endpoints
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     description: Retrieve a list of all customers, ordered by creation date (newest first)
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *             example:
 *               - accountId: "123e4567-e89b-12d3-a456-426614174000"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *                 phoneNumber: "1234567890"
 *                 address: "123 Main St"
 *                 city: "New York"
 *                 state: "NY"
 *                 country: "USA"
 *                 dateCreated: "2024-01-01T00:00:00.000Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/customers', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.getAllCustomers(req, res).catch(next);
});

/**
 * @swagger
 * /api/customers/country/{country}:
 *   get:
 *     summary: Get customers by country
 *     tags: [Customers]
 *     description: Retrieve all customers from a specific country, ordered by creation date (newest first)
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Country name to filter customers
 *         example: USA
 *     responses:
 *       200:
 *         description: List of customers from the specified country
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *             example:
 *               - accountId: "123e4567-e89b-12d3-a456-426614174000"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *                 country: "USA"
 *                 dateCreated: "2024-01-01T00:00:00.000Z"
 *               - accountId: "223e4567-e89b-12d3-a456-426614174001"
 *                 firstName: "Jane"
 *                 lastName: "Smith"
 *                 email: "jane.smith@example.com"
 *                 country: "USA"
 *                 dateCreated: "2024-01-02T00:00:00.000Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/customers/country/:country', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.getCustomersByCountry(req, res).catch(next);
});

/**
 * @swagger
 * /api/customers/email/{email}:
 *   get:
 *     summary: Get customer by email
 *     tags: [Customers]
 *     description: Retrieve a customer by their email address. The email parameter should be URL-encoded if it contains special characters.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *           maxLength: 255
 *         description: Customer email address (URL-encoded if needed)
 *         example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *             example:
 *               accountId: "123e4567-e89b-12d3-a456-426614174000"
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john.doe@example.com"
 *               phoneNumber: "1234567890"
 *               address: "123 Main St"
 *               city: "New York"
 *               state: "NY"
 *               country: "USA"
 *               dateCreated: "2024-01-01T00:00:00.000Z"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/customers/email/:email', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.getCustomerByEmail(req, res).catch(next);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     description: Retrieve a customer by their unique identifier (UUID)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer unique identifier
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *             example:
 *               accountId: "123e4567-e89b-12d3-a456-426614174000"
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john.doe@example.com"
 *               phoneNumber: "1234567890"
 *               address: "123 Main St"
 *               city: "New York"
 *               state: "NY"
 *               country: "USA"
 *               dateCreated: "2024-01-01T00:00:00.000Z"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/customers/:id', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.getCustomerById(req, res).catch(next);
});

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     description: Create a new customer account. Email must be unique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerRequest'
 *           example:
 *             firstName: "John"
 *             lastName: "Doe"
 *             email: "john.doe@example.com"
 *             phoneNumber: "1234567890"
 *             address: "123 Main St"
 *             city: "New York"
 *             state: "NY"
 *             country: "USA"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *             example:
 *               accountId: "123e4567-e89b-12d3-a456-426614174000"
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john.doe@example.com"
 *               phoneNumber: "1234567890"
 *               address: "123 Main St"
 *               city: "New York"
 *               state: "NY"
 *               country: "USA"
 *               dateCreated: "2024-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/customers', validate(createCustomerSchema), (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.createCustomer(req, res).catch(next);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
 *     description: Update an existing customer's information. All fields are optional. Email must be unique if provided.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer unique identifier
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCustomerRequest'
 *           example:
 *             lastName: "Smith"
 *             phoneNumber: "9876543210"
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *             example:
 *               accountId: "123e4567-e89b-12d3-a456-426614174000"
 *               firstName: "John"
 *               lastName: "Smith"
 *               email: "john.doe@example.com"
 *               phoneNumber: "9876543210"
 *               address: "123 Main St"
 *               city: "New York"
 *               state: "NY"
 *               country: "USA"
 *               dateCreated: "2024-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/customers/:id', validate(updateCustomerSchema), (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.updateCustomer(req, res).catch(next);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     description: Delete a customer by their unique identifier
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer unique identifier
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       204:
 *         description: Customer deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/customers/:id', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.deleteCustomer(req, res).catch(next);
});

export default router;
