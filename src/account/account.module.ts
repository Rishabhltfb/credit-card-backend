import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './services/account.service';
import { AccountRepository } from './repository/account.repository';
import { AccountController } from './controller/account.controller';
import { UserModule } from 'src/user/user.module';
import { AccountEntity } from './entities/account.entity';
import { UserRepository } from 'src/user/repository/user.respository';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([AccountEntity, UserEntity]),
    UserModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, UserRepository],
})
export class AccountModule {}
