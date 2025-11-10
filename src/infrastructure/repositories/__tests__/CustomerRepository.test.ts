import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Repository, DeleteResult } from 'typeorm';
import { CustomerRepository } from '../CustomerRepository';
import { CustomerEntity } from '../../entities/Customer.entity';
import { Customer } from '../../../domain/entities/Customer';
import { AppDataSource } from '../../database/data-source';

// Mock the AppDataSource
vi.mock('../../database/data-source', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
  },
}));

describe('CustomerRepository', () => {
  let repository: CustomerRepository;
  let mockRepository: Repository<CustomerEntity>;

  beforeEach(() => {
    mockRepository = {
      find: vi.fn(),
      findOne: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    } as unknown as Repository<CustomerEntity>;

    vi.mocked(AppDataSource.getRepository).mockReturnValue(mockRepository);
    repository = new CustomerRepository();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const entities: CustomerEntity[] = [
        {
          accountId: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          dateCreated: new Date(),
        } as CustomerEntity,
        {
          accountId: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          dateCreated: new Date(),
        } as CustomerEntity,
      ];

      vi.mocked(mockRepository.find).mockResolvedValue(entities);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].accountId).toBe('1');
      expect(result[0].firstName).toBe('John');
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { dateCreated: 'DESC' },
      });
    });
  });

  describe('findById', () => {
    it('should return a customer by id', async () => {
      const entity: CustomerEntity = {
        accountId: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        dateCreated: new Date(),
      } as CustomerEntity;

      vi.mocked(mockRepository.findOne).mockResolvedValue(entity);

      const result = await repository.findById('123');

      expect(result).toBeInstanceOf(Customer);
      expect(result?.accountId).toBe('123');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { accountId: '123' },
      });
    });

    it('should return null if customer not found', async () => {
      vi.mocked(mockRepository.findOne).mockResolvedValue(null);

      const result = await repository.findById('123');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a customer by email', async () => {
      const entity: CustomerEntity = {
        accountId: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        dateCreated: new Date(),
      } as CustomerEntity;

      vi.mocked(mockRepository.findOne).mockResolvedValue(entity);

      const result = await repository.findByEmail('john@example.com');

      expect(result).toBeInstanceOf(Customer);
      expect(result?.email).toBe('john@example.com');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });

    it('should return null if customer not found by email', async () => {
      vi.mocked(mockRepository.findOne).mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });
  });

  describe('findByCountry', () => {
    it('should return customers by country', async () => {
      const entities: CustomerEntity[] = [
        {
          accountId: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          country: 'USA',
          dateCreated: new Date(),
        } as CustomerEntity,
        {
          accountId: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          country: 'USA',
          dateCreated: new Date(),
        } as CustomerEntity,
      ];

      vi.mocked(mockRepository.find).mockResolvedValue(entities);

      const result = await repository.findByCountry('USA');

      expect(result).toHaveLength(2);
      expect(result[0].country).toBe('USA');
      expect(result[1].country).toBe('USA');
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { country: 'USA' },
        order: { dateCreated: 'DESC' },
      });
    });

    it('should return empty array when no customers found for country', async () => {
      vi.mocked(mockRepository.find).mockResolvedValue([]);

      const result = await repository.findByCountry('Canada');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { country: 'Canada' },
        order: { dateCreated: 'DESC' },
      });
    });

    it('should return customers ordered by dateCreated DESC', async () => {
      const olderDate = new Date('2024-01-01');
      const newerDate = new Date('2024-01-02');
      const entities: CustomerEntity[] = [
        {
          accountId: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          country: 'USA',
          dateCreated: olderDate,
        } as CustomerEntity,
        {
          accountId: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          country: 'USA',
          dateCreated: newerDate,
        } as CustomerEntity,
      ];

      vi.mocked(mockRepository.find).mockResolvedValue(entities);

      const result = await repository.findByCountry('USA');

      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { country: 'USA' },
        order: { dateCreated: 'DESC' },
      });
    });
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const customer = new Customer('123', 'John', 'Doe', 'john@example.com', '1234567890');

      const savedEntity: CustomerEntity = {
        accountId: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        dateCreated: new Date(),
      } as CustomerEntity;

      vi.mocked(mockRepository.save).mockResolvedValue(savedEntity);

      const result = await repository.create(customer);

      expect(result).toBeInstanceOf(Customer);
      expect(result.accountId).toBe('123');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const existingEntity: CustomerEntity = {
        accountId: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        dateCreated: new Date(),
      } as CustomerEntity;

      const updatedEntity: CustomerEntity = {
        ...existingEntity,
        lastName: 'Updated',
      } as CustomerEntity;

      vi.mocked(mockRepository.findOne).mockResolvedValue(existingEntity);
      vi.mocked(mockRepository.save).mockResolvedValue(updatedEntity);

      const result = await repository.update('123', { lastName: 'Updated' });

      expect(result.lastName).toBe('Updated');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error if customer not found', async () => {
      vi.mocked(mockRepository.findOne).mockResolvedValue(null);

      await expect(repository.update('123', { lastName: 'Updated' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      vi.mocked(mockRepository.delete).mockResolvedValue(deleteResult);

      await repository.delete('123');

      expect(mockRepository.delete).toHaveBeenCalledWith('123');
    });

    it('should throw error if customer not found', async () => {
      const deleteResult: DeleteResult = { affected: 0, raw: [] };
      vi.mocked(mockRepository.delete).mockResolvedValue(deleteResult);

      await expect(repository.delete('123')).rejects.toThrow();
    });
  });
});
