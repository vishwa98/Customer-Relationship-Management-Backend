import { injectable, inject } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../../domain/entities/Customer';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { EmailAlreadyExistsError } from '../../domain/errors/EmailAlreadyExistsError';

export interface CreateCustomerDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

@injectable()
export class CreateCustomerService {
  constructor(
    @inject('ICustomerRepository')
    private customerRepository: ICustomerRepository
  ) {}

  async execute(data: CreateCustomerDTO): Promise<Customer> {
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      throw new Error('First name, last name, and email are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Check if email already exists
    const existingCustomer = await this.customerRepository.findByEmail(data.email);
    if (existingCustomer) {
      throw new EmailAlreadyExistsError(data.email);
    }

    // Create customer
    const customer = new Customer(
      uuidv4(),
      data.firstName,
      data.lastName,
      data.email,
      data.phoneNumber,
      data.address,
      data.city,
      data.state,
      data.country,
      new Date()
    );

    return await this.customerRepository.create(customer);
  }
}
