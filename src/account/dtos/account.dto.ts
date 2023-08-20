import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNumber()
  @Min(1)
  accountLimit: number;

  @IsNumber()
  @Min(1)
  perTransactionLimit: number;
}

export class UpdateAccountDto {
  newAccountLimit?: number;

  newPerTransactionLimit?: number;
}
