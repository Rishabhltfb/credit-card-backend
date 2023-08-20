import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { AccountEntity } from '../entities/account.entity';
import { CreateAccountDto } from '../dtos/account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CustomError } from 'src/error/error.interface';

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  private logger = new Logger(AccountRepository.name);
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountModel: Repository<AccountEntity>,
  ) {
    super();
  }

  async findAccountById(
    accountId: string,
  ): Promise<AccountEntity | CustomError> {
    try {
      return await this.accountModel.findOne({ account_id: accountId });
    } catch (error) {
      this.logger.error(
        `Failed to find account: ${JSON.stringify(accountId)} err: ${error}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async updateAccount(
    newAccountDetails: AccountEntity,
  ): Promise<AccountEntity> {
    return this.accountModel.save(newAccountDetails);
  }

  async createAccount(
    createAccountDto: CreateAccountDto,
    customer: UserEntity,
  ): Promise<AccountEntity> {
    const {
      accountLimit: account_limit,
      perTransactionLimit: per_transaction_limit,
    } = createAccountDto;

    const accountObj = {
      account_limit,
      customer_id: customer,
      per_transaction_limit,
      last_per_transaction_limit: null,
      last_account_limit: null,
    };
    const account = this.accountModel.create(accountObj);
    try {
      return await this.accountModel.save(account);
    } catch (error) {
      this.logger.error(
        `Failed to create account: ${JSON.stringify(accountObj)} err: ${error}`,
        error.stack,
      );
      if (error.code === '23505') {
        throw new ConflictException('Account already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
