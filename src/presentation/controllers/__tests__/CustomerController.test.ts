import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { CustomerController } from '../CustomerController';
import { CreateCustomerService } from '../../../application/services/CreateCustomerService';
import { GetAllCustomersService } from '../../../application/services/GetAllCustomersService';
import { GetCustomerByIdService } from '../../../application/services/GetCustomerByIdService';
import { GetCustomerByEmailService } from '../../../application/services/GetCustomerByEmailService';
import { GetCustomersByCountryService } from '../../../application/services/GetCustomersByCountryService';
import { UpdateCustomerService } from '../../../application/services/UpdateCustomerService';
import { DeleteCustomerService } from '../../../application/services/DeleteCustomerService';
import { Customer } from '../../../domain/entities/Customer';

describe('CustomerController', () => {
  let controller: CustomerController;
  let mockCreateService: CreateCustomerService;
  let mockGetAllService: GetAllCustomersService;
  let mockGetByIdService: GetCustomerByIdService;
  let mockGetByEmailService: GetCustomerByEmailService;
  let mockGetByCountryService: GetCustomersByCountryService;
  let mockUpdateService: UpdateCustomerService;
  let mockDeleteService: DeleteCustomerService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockCreateService = {
      execute: vi.fn(),
    } as unknown as CreateCustomerService;

    mockGetAllService = {
      execute: vi.fn(),
    } as unknown as GetAllCustomersService;

    mockGetByIdService = {
      execute: vi.fn(),
    } as unknown as GetCustomerByIdService;

    mockGetByEmailService = {
      execute: vi.fn(),
    } as unknown as GetCustomerByEmailService;

    mockGetByCountryService = {
      execute: vi.fn(),
    } as unknown as GetCustomersByCountryService;

    mockUpdateService = {
      execute: vi.fn(),
    } as unknown as UpdateCustomerService;

    mockDeleteService = {
      execute: vi.fn(),
    } as unknown as DeleteCustomerService;

    controller = new CustomerController(
      mockCreateService,
      mockGetAllService,
      mockGetByIdService,
      mockGetByEmailService,
      mockGetByCountryService,
      mockUpdateService,
      mockDeleteService
    );

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  describe('getAllCustomers', () => {
    it('should return all customers', async () => {
      const dateCreated1 = new Date('2024-01-01');
      const dateCreated2 = new Date('2024-01-02');
      const customers = [
        new Customer('1', 'John', 'Doe', 'john@example.com', undefined, undefined, undefined, undefined, undefined, dateCreated1),
        new Customer('2', 'Jane', 'Smith', 'jane@example.com', undefined, undefined, undefined, undefined, undefined, dateCreated2),
      ];

      vi.mocked(mockGetAllService.execute).mockResolvedValue(customers);

      await controller.getAllCustomers(mockRequest as Request, mockResponse as Response);

      expect(mockGetAllService.execute).toHaveBeenCalledOnce();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          accountId: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phoneNumber: undefined,
          address: undefined,
          city: undefined,
          state: undefined,
          country: undefined,
          dateCreated: dateCreated1,
        },
        {
          accountId: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phoneNumber: undefined,
          address: undefined,
          city: undefined,
          state: undefined,
          country: undefined,
          dateCreated: dateCreated2,
        },
      ]);
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by id', async () => {
      const customer = new Customer('123', 'John', 'Doe', 'john@example.com');
      mockRequest.params = { id: '123' };

      vi.mocked(mockGetByIdService.execute).mockResolvedValue(customer);

      await controller.getCustomerById(mockRequest as Request, mockResponse as Response);

      expect(mockGetByIdService.execute).toHaveBeenCalledWith('123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('getCustomerByEmail', () => {
    it('should return a customer by email', async () => {
      const customer = new Customer('123', 'John', 'Doe', 'john@example.com');
      mockRequest.params = { email: 'john@example.com' };

      vi.mocked(mockGetByEmailService.execute).mockResolvedValue(customer);

      await controller.getCustomerByEmail(mockRequest as Request, mockResponse as Response);

      expect(mockGetByEmailService.execute).toHaveBeenCalledWith('john@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('getCustomersByCountry', () => {
    it('should return customers by country', async () => {
      const dateCreated1 = new Date('2024-01-01');
      const dateCreated2 = new Date('2024-01-02');
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
          'USA',
          dateCreated1
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
          'USA',
          dateCreated2
        ),
      ];
      mockRequest.params = { country: 'USA' };

      vi.mocked(mockGetByCountryService.execute).mockResolvedValue(customers);

      await controller.getCustomersByCountry(mockRequest as Request, mockResponse as Response);

      expect(mockGetByCountryService.execute).toHaveBeenCalledWith('USA');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          accountId: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phoneNumber: undefined,
          address: undefined,
          city: undefined,
          state: undefined,
          country: 'USA',
          dateCreated: dateCreated1,
        },
        {
          accountId: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phoneNumber: undefined,
          address: undefined,
          city: undefined,
          state: undefined,
          country: 'USA',
          dateCreated: dateCreated2,
        },
      ]);
    });

    it('should return empty array when no customers found for country', async () => {
      mockRequest.params = { country: 'Canada' };

      vi.mocked(mockGetByCountryService.execute).mockResolvedValue([]);

      await controller.getCustomersByCountry(mockRequest as Request, mockResponse as Response);

      expect(mockGetByCountryService.execute).toHaveBeenCalledWith('Canada');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      const createdCustomer = new Customer('123', 'John', 'Doe', 'john@example.com');

      mockRequest.body = customerData;
      vi.mocked(mockCreateService.execute).mockResolvedValue(createdCustomer);

      await controller.createCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockCreateService.execute).toHaveBeenCalledWith(customerData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      const updateData = { lastName: 'Updated' };
      const updatedCustomer = new Customer('123', 'John', 'Updated', 'john@example.com');

      mockRequest.params = { id: '123' };
      mockRequest.body = updateData;
      vi.mocked(mockUpdateService.execute).mockResolvedValue(updatedCustomer);

      await controller.updateCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateService.execute).toHaveBeenCalledWith('123', updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer successfully', async () => {
      mockRequest.params = { id: '123' };
      vi.mocked(mockDeleteService.execute).mockResolvedValue(undefined);

      await controller.deleteCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockDeleteService.execute).toHaveBeenCalledWith('123');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
