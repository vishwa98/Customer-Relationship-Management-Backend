import { injectable, inject } from 'tsyringe';
import { Customer } from '../../domain/entities/Customer';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';

@injectable()
export class GetAllCustomersService {
  constructor(
    @inject('ICustomerRepository')
    private customerRepository: ICustomerRepository
  ) {}

  async execute(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }
}
