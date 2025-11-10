import { Customer } from '../../domain/entities/Customer';

export interface CustomerResponseDTO {
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dateCreated: Date;
}

export function toCustomerResponseDTO(customer: Customer): CustomerResponseDTO {
  return {
    accountId: customer.accountId,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    country: customer.country,
    dateCreated: customer.dateCreated ?? new Date(),
  };
}
