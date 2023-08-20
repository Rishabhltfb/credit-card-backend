import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomError } from 'src/error/error.interface';
import { CreateAccountDto, UpdateAccountDto } from '../dtos/account.dto';
import { AccountService } from '../services/account.service';
import { AccountEntity } from '../entities/account.entity';
import { CustomErrorInterceptor } from 'src/util/decorator/custom-error.decorator';

@Controller('account')
export class AccountController {
  private logger = new Logger(AccountController.name);
  constructor(private accountService: AccountService) {}

  @Post()
  @CustomErrorInterceptor()
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountEntity | CustomError> {
    const account = await this.accountService.createAccount(createAccountDto);
    return account;
  }

  @Get('fetch/:accountId')
  @CustomErrorInterceptor()
  getAccountById(
    @Param('accountId') accountId: string,
  ): Promise<AccountEntity | CustomError> {
    this.logger.debug(accountId);
    return this.accountService.fetchAccountById(accountId);
  }

  @Patch('/:id')
  @CustomErrorInterceptor()
  updateAccountLimits(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountEntity | CustomError> {
    return this.accountService.updateAccountLimits(id, updateAccountDto);
  }
}
