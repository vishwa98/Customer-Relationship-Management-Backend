import { injectable, inject } from 'tsyringe';
import { Customer } from '../../domain/entities/Customer';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';

@injectable()
export class GetCustomersByCountryService {
  constructor(
    @inject('ICustomerRepository')
    private customerRepository: ICustomerRepository
  ) {}

  async execute(country: string): Promise<Customer[]> {
    return await this.customerRepository.findByCountry(country);
  }
}
