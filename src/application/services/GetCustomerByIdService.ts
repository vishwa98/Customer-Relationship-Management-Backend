import { injectable, inject } from 'tsyringe';
import { Customer } from '../../domain/entities/Customer';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { CustomerNotFoundError } from '../../domain/errors/CustomerNotFoundError';

@injectable()
export class GetCustomerByIdService {
  constructor(
    @inject('ICustomerRepository')
    private customerRepository: ICustomerRepository
  ) {}

  async execute(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundError(id);
    }
    return customer;
  }
}
