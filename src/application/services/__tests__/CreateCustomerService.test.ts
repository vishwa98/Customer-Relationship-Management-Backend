import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateCustomerService } from '../CreateCustomerService';
import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { EmailAlreadyExistsError } from '../../../domain/errors/EmailAlreadyExistsError';
import { Customer } from '../../../domain/entities/Customer';

describe('CreateCustomerService', () => {
  let service: CreateCustomerService;
  let mockRepository: ICustomerRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByCountry: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new CreateCustomerService(mockRepository);
  });

  it('should create a customer successfully', async () => {
    const customerData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
    };

    const savedCustomer = new Customer(
      '123',
      'John',
      'Doe',
      'john.doe@example.com',
      '1234567890',
      undefined,
      undefined,
      undefined,
      undefined,
      new Date()
    );

    vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(mockRepository.create).mockResolvedValue(savedCustomer);

    const result = await service.execute(customerData);

    expect(result).toEqual(savedCustomer);
    expect(mockRepository.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it('should throw error if email already exists', async () => {
    const customerData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com',
    };

    const existingCustomer = new Customer('123', 'Jane', 'Doe', 'existing@example.com');

    vi.mocked(mockRepository.findByEmail).mockResolvedValue(existingCustomer);

    await expect(service.execute(customerData)).rejects.toThrow(EmailAlreadyExistsError);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error if required fields are missing', async () => {
    const customerData = {
      firstName: '',
      lastName: 'Doe',
      email: 'test@example.com',
    };

    await expect(service.execute(customerData)).rejects.toThrow(
      'First name, last name, and email are required'
    );
  });

  it('should throw error if email format is invalid', async () => {
    const customerData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
    };

    vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);

    await expect(service.execute(customerData)).rejects.toThrow('Invalid email format');
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
