export class CreateAccountDto {
  customerId: string;
  accountLimit: number;
  perTransactionLimit: number;
}

export class UpdateAccountDto {
  newAccountLimit: number;
  newPerTransactionLimit: number;
}
