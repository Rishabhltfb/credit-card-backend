import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './services/account.service';
import { AccountRepository } from './repository/account.repository';
import { AccountController } from './controller/account.controller';
import { UserModule } from 'src/user/user.module';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([AccountEntity]),
    UserModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
})
export class AccountModule {}
