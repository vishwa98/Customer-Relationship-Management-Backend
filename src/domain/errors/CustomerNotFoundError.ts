export class CustomerNotFoundError extends Error {
  constructor(identifier?: string, type: 'id' | 'email' = 'id') {
    if (!identifier) {
      super('Customer not found');
    } else if (type === 'email') {
      super(`Customer with email ${identifier} not found`);
    } else {
      super(`Customer with id ${identifier} not found`);
    }
    this.name = 'CustomerNotFoundError';
  }
}
