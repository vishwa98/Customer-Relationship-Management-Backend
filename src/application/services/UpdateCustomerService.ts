import { injectable, inject } from 'tsyringe';
import { Customer } from '../../domain/entities/Customer';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { CustomerNotFoundError } from '../../domain/errors/CustomerNotFoundError';
import { EmailAlreadyExistsError } from '../../domain/errors/EmailAlreadyExistsError';

export interface UpdateCustomerDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

@injectable()
export class UpdateCustomerService {
  constructor(
    @inject('ICustomerRepository')
    private customerRepository: ICustomerRepository
  ) {}

  async execute(id: string, data: UpdateCustomerDTO): Promise<Customer> {
    // Check if customer exists
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new CustomerNotFoundError(id);
    }

    // If email is being updated, validate format and uniqueness
    if (data.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }

      // Check if email is already taken by another customer
      const customerWithEmail = await this.customerRepository.findByEmail(data.email);
      if (customerWithEmail && customerWithEmail.accountId !== id) {
        throw new EmailAlreadyExistsError(data.email);
      }
    }

    // Update customer
    return await this.customerRepository.update(id, data);
  }
}
