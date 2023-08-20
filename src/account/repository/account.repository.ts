import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { AccountEntity } from '../entities/account.entity';
import { CreateAccountDto } from '../dtos/account.dto';

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  private logger = new Logger(AccountRepository.name);

  async createAccount(createAccountDto: CreateAccountDto): Promise<void> {
    const {
      accountLimit: account_limit,
      customerId: customer_id,
      perTransactionLimit: per_transaction_limit,
    } = createAccountDto;
    const accountObj: any = {
      account_limit,
      customer_id,
      per_transaction_limit,
    };
    const user = this.create(accountObj);
    try {
      await this.save(user);
    } catch (error) {
      this.logger.error(
        `Failed to create account: ${JSON.stringify(accountObj)} err: ${error}`,
        error.stack,
      );
      if (error.code === '23505') {
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
