import { container } from 'tsyringe';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { CreateCustomerService } from '../../application/services/CreateCustomerService';
import { GetAllCustomersService } from '../../application/services/GetAllCustomersService';
import { GetCustomerByIdService } from '../../application/services/GetCustomerByIdService';
import { GetCustomerByEmailService } from '../../application/services/GetCustomerByEmailService';
import { GetCustomersByCountryService } from '../../application/services/GetCustomersByCountryService';
import { UpdateCustomerService } from '../../application/services/UpdateCustomerService';
import { DeleteCustomerService } from '../../application/services/DeleteCustomerService';
import { CustomerController } from '../../presentation/controllers/CustomerController';

export function setupContainer(): void {
  // Register repository
  container.registerSingleton<ICustomerRepository>('ICustomerRepository', CustomerRepository);

  // Register services with repository injection
  container.register(CreateCustomerService, {
    useFactory: c => {
      const repo = c.resolve<ICustomerRepository>('ICustomerRepository');
      return new CreateCustomerService(repo);
    },
  });
  container.register(GetAllCustomersService, {
    useFactory: c => {
      const repo = c.resolve<ICustomerRepository>('ICustomerRepository');
      return new GetAllCustomersService(repo);
    },
  });
  container.register(GetCustomerByIdService, {
    useFactory: c => {
      const repo = c.resolve<ICustomerRepository>('ICustomerRepository');
      return new GetCustomerByIdService(repo);
    },
  });
  container.register(GetCustomerByEmailService, {
    useFactory: c => {
      const repo = c.resolve<ICustomerRepository>('ICustomerRepository');
      return new GetCustomerByEmailService(repo);
    },
  });
  container.register(GetCustomersByCountryService, {
    useFactory: c => {
      const repo = c.resolve<ICustomerRepository>('ICustomerRepository');
      return new GetCustomersByCountryService(repo);
    },
  });
  container.register(UpdateCustomerService, {
    useFactory: c => {
      const repo = c.resolve<ICustomerRepository>('ICustomerRepository');
      return new UpdateCustomerService(repo);
    },
  });
  container.register(DeleteCustomerService, {
    useFactory: c => {
      const repo = c.resolve<ICustomerRepository>('ICustomerRepository');
      return new DeleteCustomerService(repo);
    },
  });

  // Register controller
  container.register(CustomerController, {
    useFactory: c => {
      return new CustomerController(
        c.resolve(CreateCustomerService),
        c.resolve(GetAllCustomersService),
        c.resolve(GetCustomerByIdService),
        c.resolve(GetCustomerByEmailService),
        c.resolve(GetCustomersByCountryService),
        c.resolve(UpdateCustomerService),
        c.resolve(DeleteCustomerService)
      );
    },
  });
}
