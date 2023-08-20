import { Body, Controller, Post } from '@nestjs/common';
import { CustomError } from 'src/error/error.interface';
import { CreateAccountDto } from '../dtos/account.dto';
import { AccountService } from '../services/account.service';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<boolean | CustomError> {
    const res = await this.accountService.createAccount(createAccountDto);
    if (res instanceof CustomError) return res;
    return true;
  }
}
