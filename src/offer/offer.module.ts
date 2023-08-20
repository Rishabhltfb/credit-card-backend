import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferService } from './services/offer.service';
import { OfferRepository } from './repository/offer.repository';
import { OfferController } from './controller/offer.controller';
import { OfferEntity } from './entities/offer.entity';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/services/account.service';
import { AccountRepository } from 'src/account/repository/account.repository';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/repository/user.respository';
import { AccountEntity } from 'src/account/entities/account.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([OfferEntity, AccountEntity, UserEntity]),
    AccountModule,
    UserModule,
  ],
  controllers: [OfferController],
  providers: [
    OfferService,
    OfferRepository,
    AccountService,
    AccountRepository,
    UserRepository,
  ],
})
export class OfferModule {}
