import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetCustomersByCountryService } from '../GetCustomersByCountryService';
import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { Customer } from '../../../domain/entities/Customer';

describe('GetCustomersByCountryService', () => {
  let service: GetCustomersByCountryService;
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

    service = new GetCustomersByCountryService(mockRepository);
  });

  it('should return customers by country', async () => {
    const customers = [
      new Customer(
        '1',
        'John',
        'Doe',
        'john@example.com',
        undefined,
        undefined,
        undefined,
        undefined,
        'USA'
      ),
      new Customer(
        '2',
        'Jane',
        'Smith',
        'jane@example.com',
        undefined,
        undefined,
        undefined,
        undefined,
        'USA'
      ),
    ];

    vi.mocked(mockRepository.findByCountry).mockResolvedValue(customers);

    const result = await service.execute('USA');

    expect(result).toEqual(customers);
    expect(result).toHaveLength(2);
    expect(mockRepository.findByCountry).toHaveBeenCalledWith('USA');
    expect(mockRepository.findByCountry).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no customers found for country', async () => {
    vi.mocked(mockRepository.findByCountry).mockResolvedValue([]);

    const result = await service.execute('Canada');

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
    expect(mockRepository.findByCountry).toHaveBeenCalledWith('Canada');
  });

  it('should handle different country formats', async () => {
    const customers = [
      new Customer(
        '1',
        'John',
        'Doe',
        'john@example.com',
        undefined,
        undefined,
        undefined,
        undefined,
        'United States'
      ),
    ];

    vi.mocked(mockRepository.findByCountry).mockResolvedValue(customers);

    const result = await service.execute('United States');

    expect(result).toEqual(customers);
    expect(mockRepository.findByCountry).toHaveBeenCalledWith('United States');
  });
});
