import { injectable, inject } from 'tsyringe';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { CustomerNotFoundError } from '../../domain/errors/CustomerNotFoundError';

@injectable()
export class DeleteCustomerService {
  constructor(
    @inject('ICustomerRepository')
    private customerRepository: ICustomerRepository
  ) {}

  async execute(id: string): Promise<void> {
    // Check if customer exists
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundError(id);
    }

    await this.customerRepository.delete(id);
  }
}
