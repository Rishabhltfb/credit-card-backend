export class CreateAccountDto {
  customerId: string;
  accountLimit: number;
  perTransactionLimit: number;
}

export class UpdateAccountDto {
  customerId: string;
  accountLimit: number;
  perTransactionLimit: number;
  lastAccountLimit?: number;
  lastperTransactionLimit?: number;
  accountLimitUpdateTime?: Date;
  perTransactionLimitUpdateTime?: Date;
}
