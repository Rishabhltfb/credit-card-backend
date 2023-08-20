import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomError } from 'src/error/error.interface';
import { CreateAccountDto } from '../dtos/account.dto';
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
    const customer: UserEntity = await this.userRepository.findUserById(
      customer_id,
    );
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
