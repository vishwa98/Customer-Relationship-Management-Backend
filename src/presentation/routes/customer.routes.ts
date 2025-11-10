import { Router } from 'express';
import { container } from 'tsyringe';
import { CustomerController } from '../controllers/CustomerController';
import { validate } from '../middleware/validation.middleware';
import { createCustomerSchema } from '../dto/create-customer.dto';
import { updateCustomerSchema } from '../dto/update-customer.dto';

const router = Router();

router.get('/customers', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.getAllCustomers(req, res).catch(next);
});

router.get('/customers/country/:country', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.getCustomersByCountry(req, res).catch(next);
});

router.get('/customers/email/:email', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.getCustomerByEmail(req, res).catch(next);
});

router.get('/customers/:id', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.getCustomerById(req, res).catch(next);
});

router.post('/customers', validate(createCustomerSchema), (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.createCustomer(req, res).catch(next);
});

router.put('/customers/:id', validate(updateCustomerSchema), (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.updateCustomer(req, res).catch(next);
});

router.delete('/customers/:id', (req, res, next) => {
  const customerController = container.resolve(CustomerController);
  customerController.deleteCustomer(req, res).catch(next);
});

export default router;
