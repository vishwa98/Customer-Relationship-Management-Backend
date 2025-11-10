import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteCustomerService } from '../DeleteCustomerService';
import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { CustomerNotFoundError } from '../../../domain/errors/CustomerNotFoundError';
import { Customer } from '../../../domain/entities/Customer';

describe('DeleteCustomerService', () => {
  let service: DeleteCustomerService;
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

    service = new DeleteCustomerService(mockRepository);
  });

  it('should delete a customer successfully', async () => {
    const customer = new Customer('123', 'John', 'Doe', 'john@example.com');

    vi.mocked(mockRepository.findById).mockResolvedValue(customer);
    vi.mocked(mockRepository.delete).mockResolvedValue(undefined);

    await service.execute('123');

    expect(mockRepository.findById).toHaveBeenCalledWith('123');
    expect(mockRepository.delete).toHaveBeenCalledWith('123');
  });

  it('should throw error if customer not found', async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(service.execute('123')).rejects.toThrow(CustomerNotFoundError);
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
