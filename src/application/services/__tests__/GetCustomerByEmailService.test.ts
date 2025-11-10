import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetCustomerByEmailService } from '../GetCustomerByEmailService';
import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { CustomerNotFoundError } from '../../../domain/errors/CustomerNotFoundError';
import { Customer } from '../../../domain/entities/Customer';

describe('GetCustomerByEmailService', () => {
  let service: GetCustomerByEmailService;
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

    service = new GetCustomerByEmailService(mockRepository);
  });

  it('should return a customer by email', async () => {
    const customer = new Customer('123', 'John', 'Doe', 'john@example.com');

    vi.mocked(mockRepository.findByEmail).mockResolvedValue(customer);

    const result = await service.execute('john@example.com');

    expect(result).toEqual(customer);
    expect(mockRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(mockRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  it('should throw CustomerNotFoundError if customer not found', async () => {
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);

    await expect(service.execute('nonexistent@example.com')).rejects.toThrow(CustomerNotFoundError);
    await expect(service.execute('nonexistent@example.com')).rejects.toThrow(
      'Customer with email nonexistent@example.com not found'
    );
    expect(mockRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(mockRepository.findByEmail).toHaveBeenCalledTimes(2);
  });

  it('should handle email with special characters', async () => {
    const customer = new Customer('123', 'John', 'Doe', 'john.doe+test@example.com');

    vi.mocked(mockRepository.findByEmail).mockResolvedValue(customer);

    const result = await service.execute('john.doe+test@example.com');

    expect(result).toEqual(customer);
    expect(mockRepository.findByEmail).toHaveBeenCalledWith('john.doe+test@example.com');
  });
});
