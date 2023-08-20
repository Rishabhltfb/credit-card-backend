import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONSTANTS, STAGING_ENV } from './util/constant/app.contant';
import { STRING_CONSTANTS } from './util/constant/string.constant';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    OfferModule,
    AccountModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction =
          configService.get(STRING_CONSTANTS.STAGE) === STAGING_ENV.prod;
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: DB_CONSTANTS.DB_TYPE,
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get(DB_CONSTANTS.DB_HOST),
          port: configService.get(DB_CONSTANTS.DB_PORT),
          username: configService.get(DB_CONSTANTS.DB_USERNAME),
          password: configService.get(DB_CONSTANTS.DB_PASSWORD),
          database: configService.get(DB_CONSTANTS.DB_DATABASE),
        };
      },
    }),
  ], // imports is an array that can contain other modules that are required by the current module. These can be custom modules created by us or built-in modules provided by NestJS. For example, if we want to use NestJS' built-in HttpModule, we can import it into our module by adding it to the imports array.
  controllers: [], // controllers is an array of controllers that are part of the current module. Controllers are responsible for handling incoming requests and returning responses. When a request is made to a specific route, the corresponding controller method is executed.
  providers: [], // providers is an array of services that are part of the current module. Services are responsible for implementing business logic and performing operations such as data retrieval and manipulation. They can be used by controllers or other services in the module. When a controller or another service needs to use a service, it is injected into the constructor using dependency injection.
})
export class AppModule {}
