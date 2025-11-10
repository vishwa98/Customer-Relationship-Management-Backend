import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { CustomerEntity } from '../entities/Customer.entity';
import { Customer } from '../../domain/entities/Customer';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { CustomerNotFoundError } from '../../domain/errors/CustomerNotFoundError';

@injectable()
export class CustomerRepository implements ICustomerRepository {
  private getRepository(): Repository<CustomerEntity> {
    return AppDataSource.getRepository(CustomerEntity);
  }

  private toDomain(entity: CustomerEntity): Customer {
    return new Customer(
      entity.accountId,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.phoneNumber,
      entity.address,
      entity.city,
      entity.state,
      entity.country,
      entity.dateCreated
    );
  }

  private toEntity(customer: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.accountId = customer.accountId;
    entity.firstName = customer.firstName;
    entity.lastName = customer.lastName;
    entity.email = customer.email;
    entity.phoneNumber = customer.phoneNumber;
    entity.address = customer.address;
    entity.city = customer.city;
    entity.state = customer.state;
    entity.country = customer.country;
    if (customer.dateCreated) {
      entity.dateCreated = customer.dateCreated;
    }
    return entity;
  }

  async findAll(): Promise<Customer[]> {
    const repository = this.getRepository();
    const entities = await repository.find({
      order: { dateCreated: 'DESC' },
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findById(id: string): Promise<Customer | null> {
    const repository = this.getRepository();
    const entity = await repository.findOne({ where: { accountId: id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const repository = this.getRepository();
    const entity = await repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByCountry(country: string): Promise<Customer[]> {
    const repository = this.getRepository();
    const entities = await repository.find({
      where: { country },
      order: { dateCreated: 'DESC' },
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async create(customer: Customer): Promise<Customer> {
    const repository = this.getRepository();
    const entity = this.toEntity(customer);
    const savedEntity = await repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    const repository = this.getRepository();
    const entity = await repository.findOne({ where: { accountId: id } });
    if (!entity) {
      throw new CustomerNotFoundError(id);
    }

    if (customer.firstName !== undefined) entity.firstName = customer.firstName;
    if (customer.lastName !== undefined) entity.lastName = customer.lastName;
    if (customer.email !== undefined) entity.email = customer.email;
    if (customer.phoneNumber !== undefined) entity.phoneNumber = customer.phoneNumber;
    if (customer.address !== undefined) entity.address = customer.address;
    if (customer.city !== undefined) entity.city = customer.city;
    if (customer.state !== undefined) entity.state = customer.state;
    if (customer.country !== undefined) entity.country = customer.country;

    const updatedEntity = await repository.save(entity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const repository = this.getRepository();
    const result = await repository.delete(id);
    if (result.affected === 0) {
      throw new CustomerNotFoundError(id);
    }
  }
}
