import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateCustomerService } from '../UpdateCustomerService';
import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { CustomerNotFoundError } from '../../../domain/errors/CustomerNotFoundError';
import { EmailAlreadyExistsError } from '../../../domain/errors/EmailAlreadyExistsError';
import { Customer } from '../../../domain/entities/Customer';

describe('UpdateCustomerService', () => {
  let service: UpdateCustomerService;
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

    service = new UpdateCustomerService(mockRepository);
  });

  it('should update a customer successfully', async () => {
    const existingCustomer = new Customer('123', 'John', 'Doe', 'john@example.com');
    const updatedCustomer = new Customer('123', 'John', 'Updated', 'john@example.com');

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);
    vi.mocked(mockRepository.update).mockResolvedValue(updatedCustomer);

    const result = await service.execute('123', { lastName: 'Updated' });

    expect(result).toEqual(updatedCustomer);
    expect(mockRepository.findById).toHaveBeenCalledWith('123');
    expect(mockRepository.update).toHaveBeenCalledWith('123', {
      lastName: 'Updated',
    });
  });

  it('should throw error if customer not found', async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(service.execute('123', { firstName: 'John' })).rejects.toThrow(
      CustomerNotFoundError
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error if email already exists for another customer', async () => {
    const existingCustomer = new Customer('123', 'John', 'Doe', 'john@example.com');
    const otherCustomer = new Customer('456', 'Jane', 'Doe', 'jane@example.com');

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(otherCustomer);

    await expect(service.execute('123', { email: 'jane@example.com' })).rejects.toThrow(
      EmailAlreadyExistsError
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should allow updating email to same value', async () => {
    const existingCustomer = new Customer('123', 'John', 'Doe', 'john@example.com');
    const updatedCustomer = new Customer('123', 'John', 'Doe', 'john@example.com');

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(existingCustomer);
    vi.mocked(mockRepository.update).mockResolvedValue(updatedCustomer);

    const result = await service.execute('123', { email: 'john@example.com' });

    expect(result).toEqual(updatedCustomer);
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it('should throw error if email format is invalid', async () => {
    const existingCustomer = new Customer('123', 'John', 'Doe', 'john@example.com');

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCustomer);

    await expect(service.execute('123', { email: 'invalid-email' })).rejects.toThrow(
      'Invalid email format'
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
