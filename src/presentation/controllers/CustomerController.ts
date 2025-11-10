import { Request, Response } from 'express';
import { CreateCustomerService } from '../../application/services/CreateCustomerService';
import { GetAllCustomersService } from '../../application/services/GetAllCustomersService';
import { GetCustomerByIdService } from '../../application/services/GetCustomerByIdService';
import { GetCustomerByEmailService } from '../../application/services/GetCustomerByEmailService';
import { GetCustomersByCountryService } from '../../application/services/GetCustomersByCountryService';
import { UpdateCustomerService } from '../../application/services/UpdateCustomerService';
import { DeleteCustomerService } from '../../application/services/DeleteCustomerService';
import { CreateCustomerDTO } from '../dto/create-customer.dto';
import { UpdateCustomerDTO } from '../dto/update-customer.dto';
import { toCustomerResponseDTO } from '../dto/customer-response.dto';

export class CustomerController {
  constructor(
    private createCustomerService: CreateCustomerService,
    private getAllCustomersService: GetAllCustomersService,
    private getCustomerByIdService: GetCustomerByIdService,
    private getCustomerByEmailService: GetCustomerByEmailService,
    private getCustomersByCountryService: GetCustomersByCountryService,
    private updateCustomerService: UpdateCustomerService,
    private deleteCustomerService: DeleteCustomerService
  ) {}

  async getAllCustomers(req: Request, res: Response): Promise<void> {
    const customers = await this.getAllCustomersService.execute();
    const customersDTO = customers.map(toCustomerResponseDTO);
    res.status(200).json(customersDTO);
  }

  async getCustomerById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const customer = await this.getCustomerByIdService.execute(id);
    res.status(200).json(toCustomerResponseDTO(customer));
  }

  async getCustomerByEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const customer = await this.getCustomerByEmailService.execute(email);
    res.status(200).json(toCustomerResponseDTO(customer));
  }

  async getCustomersByCountry(req: Request, res: Response): Promise<void> {
    const { country } = req.params;
    const customers = await this.getCustomersByCountryService.execute(country);
    const customersDTO = customers.map(toCustomerResponseDTO);
    res.status(200).json(customersDTO);
  }

  async createCustomer(req: Request, res: Response): Promise<void> {
    const data: CreateCustomerDTO = req.body;
    const customer = await this.createCustomerService.execute(data);
    res.status(201).json(toCustomerResponseDTO(customer));
  }

  async updateCustomer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UpdateCustomerDTO = req.body;
    const customer = await this.updateCustomerService.execute(id, data);
    res.status(200).json(toCustomerResponseDTO(customer));
  }

  async deleteCustomer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.deleteCustomerService.execute(id);
    res.status(204).send();
  }
}
