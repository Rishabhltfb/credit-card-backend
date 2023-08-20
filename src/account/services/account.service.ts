import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomError } from 'src/error/error.interface';
import { CreateAccountDto, UpdateAccountDto } from '../dtos/account.dto';
import { AccountRepository } from '../repository/account.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.respository';
import { AccountEntity } from '../entities/account.entity';
import {
  ERROR_MSG_CONSTANTS,
  ERROR_STATUS_CONSTANTS,
} from 'src/util/constant/error.constant';

@Injectable()
export class AccountService {
  private logger = new Logger(AccountService.name);
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  public async fetchAccountById(
    accountId: string,
  ): Promise<AccountEntity | CustomError> {
    const account = await this.accountRepository.findAccountById(accountId);
    return account;
  }

  public async updateAccountLimits(
    accountId: string,
    updateAccountDto: UpdateAccountDto,
  ) {
    try {
      const { newAccountLimit, newPerTransactionLimit } = updateAccountDto;
      const currentAccountDetails = await this.fetchAccountById(accountId);
      if (currentAccountDetails instanceof CustomError)
        return currentAccountDetails;
      if (newAccountLimit != null && newAccountLimit !== undefined) {
        if (
          !this.checkGreater(
            currentAccountDetails.account_limit,
            newAccountLimit,
          )
        ) {
          return new CustomError(
            '1234',
            ERROR_STATUS_CONSTANTS.LESS_ACCOUNT_LIMIT,
            ERROR_MSG_CONSTANTS.LESS_ACCOUNT_LIMIT_MSG,
          );
        }
        currentAccountDetails.last_account_limit =
          currentAccountDetails.account_limit;
        currentAccountDetails.account_limit = newAccountLimit;
        currentAccountDetails.account_limit_update_time = new Date();
      }
      if (
        newPerTransactionLimit != null &&
        newPerTransactionLimit !== undefined
      ) {
        if (
          !this.checkGreater(
            currentAccountDetails.per_transaction_limit,
            newPerTransactionLimit,
          )
        ) {
          return new CustomError(
            '2399',
            ERROR_STATUS_CONSTANTS.LESS_PER_TRANSACTION_LIMIT,
            ERROR_MSG_CONSTANTS.LESS_PER_TRANSACTION_LIMIT_MSG,
          );
        }
        currentAccountDetails.last_per_transaction_limit =
          currentAccountDetails.per_transaction_limit;
        currentAccountDetails.per_transaction_limit = newPerTransactionLimit;
        currentAccountDetails.per_transaction_limit_update_time = new Date();
      }

      const newAccountDetails = await this.accountRepository.updateAccount(
        currentAccountDetails,
      );
      return newAccountDetails;
    } catch (err) {
      this.logger.error(err);
      return new CustomError(
        '8272',
        ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
        ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
      );
    }
  }

  private checkGreater(oldLimit: number, newLimit: number): boolean {
    return newLimit > oldLimit;
  }

  public async createAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<AccountEntity | CustomError> {
    const isValidData: boolean = this.accountCreationChecks(createAccountDto);
    if (!isValidData)
      return new CustomError(
        '2736',
        ERROR_STATUS_CONSTANTS.VALIDATION_FAILED,
        ERROR_MSG_CONSTANTS.ACCOUNT_CREATION_FAILED,
      );
    const { customerId: customer_id } = createAccountDto;
    const customer = await this.userRepository.findUserById(customer_id);
    if (customer instanceof CustomError) return customer;
    if (!customer) {
      return new CustomError(
        '2737',
        ERROR_STATUS_CONSTANTS.CUSTOMER_NOT_FOUND,
        ERROR_MSG_CONSTANTS.CUSTOMER_NOT_FOUND,
      );
    }
    return this.accountRepository.createAccount(createAccountDto, customer);
  }

  private accountCreationChecks(createAccountDto: CreateAccountDto): boolean {
    const { accountLimit, customerId, perTransactionLimit } = createAccountDto;
    return (
      accountLimit > 0 && perTransactionLimit > 0 && customerId.length != 0
    );
  }
}
