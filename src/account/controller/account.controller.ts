import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { CustomError } from 'src/error/error.interface';
import { CreateAccountDto } from '../dtos/account.dto';
import { AccountService } from '../services/account.service';
import { AccountEntity } from '../entities/account.entity';

@Controller('account')
export class AccountController {
  private logger = new Logger(AccountController.name);
  constructor(private accountService: AccountService) {}

  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountEntity | CustomError> {
    const account = await this.accountService.createAccount(createAccountDto);
    return account;
  }

  @Get('fetch/:accountId')
  getAccountById(
    @Param('accountId') accountId: string,
  ): Promise<AccountEntity | CustomError> {
    this.logger.debug(accountId);
    return this.accountService.fetchAccountById(accountId);
  }
}
