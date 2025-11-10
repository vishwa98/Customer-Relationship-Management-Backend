export class Customer {
  constructor(
    public accountId: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phoneNumber?: string,
    public address?: string,
    public city?: string,
    public state?: string,
    public country?: string,
    public dateCreated?: Date
  ) {}
}
