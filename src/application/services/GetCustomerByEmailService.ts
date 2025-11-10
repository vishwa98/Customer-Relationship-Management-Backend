import { injectable, inject } from 'tsyringe';
import { Customer } from '../../domain/entities/Customer';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { CustomerNotFoundError } from '../../domain/errors/CustomerNotFoundError';

@injectable()
export class GetCustomerByEmailService {
  constructor(
    @inject('ICustomerRepository')
    private customerRepository: ICustomerRepository
  ) {}

  async execute(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new CustomerNotFoundError(email, 'email');
    }
    return customer;
  }
}
