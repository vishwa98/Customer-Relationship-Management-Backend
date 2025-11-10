import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetAllCustomersService } from '../GetAllCustomersService';
import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { Customer } from '../../../domain/entities/Customer';

describe('GetAllCustomersService', () => {
  let service: GetAllCustomersService;
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

    service = new GetAllCustomersService(mockRepository);
  });

  it('should return all customers', async () => {
    const customers = [
      new Customer('1', 'John', 'Doe', 'john@example.com'),
      new Customer('2', 'Jane', 'Smith', 'jane@example.com'),
    ];

    vi.mocked(mockRepository.findAll).mockResolvedValue(customers);

    const result = await service.execute();

    expect(result).toEqual(customers);
    expect(mockRepository.findAll).toHaveBeenCalledOnce();
  });

  it('should return empty array when no customers exist', async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue([]);

    const result = await service.execute();

    expect(result).toEqual([]);
    expect(mockRepository.findAll).toHaveBeenCalledOnce();
  });
});
