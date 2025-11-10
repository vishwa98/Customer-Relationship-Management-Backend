import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetCustomerByIdService } from '../GetCustomerByIdService';
import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { CustomerNotFoundError } from '../../../domain/errors/CustomerNotFoundError';
import { Customer } from '../../../domain/entities/Customer';

describe('GetCustomerByIdService', () => {
  let service: GetCustomerByIdService;
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

    service = new GetCustomerByIdService(mockRepository);
  });

  it('should return a customer by id', async () => {
    const customer = new Customer('123', 'John', 'Doe', 'john@example.com');

    vi.mocked(mockRepository.findById).mockResolvedValue(customer);

    const result = await service.execute('123');

    expect(result).toEqual(customer);
    expect(mockRepository.findById).toHaveBeenCalledWith('123');
  });

  it('should throw error if customer not found', async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(service.execute('123')).rejects.toThrow(CustomerNotFoundError);
    expect(mockRepository.findById).toHaveBeenCalledWith('123');
  });
});
