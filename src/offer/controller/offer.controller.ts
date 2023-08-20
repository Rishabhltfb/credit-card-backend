import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomError } from 'src/error/error.interface';
import { OfferService } from '../services/offer.service';
import { CreateOfferDto, UpdateOfferStatusDto } from '../dtos/offer.dto';
import { OfferEntity } from '../entities/offer.entity';
import { CustomErrorInterceptor } from 'src/util/decorator/custom-error.decorator';
import {
  ERROR_MSG_CONSTANTS,
  ERROR_STATUS_CONSTANTS,
} from 'src/util/constant/error.constant';

@Controller('offer')
export class OfferController {
  private logger = new Logger(OfferController.name);
  constructor(private offerService: OfferService) {}

  @Post()
  @CustomErrorInterceptor()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<OfferEntity | CustomError> {
    const account = await this.offerService.createOffer(createOfferDto);
    return account;
  }

  @Get('fetch')
  @CustomErrorInterceptor()
  getOfferById(@Query('id') id: string): Promise<OfferEntity | CustomError> {
    this.logger.debug(id);
    return this.offerService.findOfferById(id);
  }

  @Get('active')
  @CustomErrorInterceptor()
  getActiveOffersForAccount(
    @Query('accountId') accountId: string,
    @Query('activeDate') activeDateStr: string,
  ): Promise<OfferEntity[] | CustomError> {
    try {
      const activeDate: Date =
        activeDateStr != null ? new Date(activeDateStr) : new Date();
      // Check if the parsing was successful
      if (isNaN(activeDate.getTime())) {
        return Promise.resolve(
          new CustomError(
            '2398',
            ERROR_STATUS_CONSTANTS.INVALID_DATE_FORMAT,
            ERROR_MSG_CONSTANTS.INVALID_DATE_FORMAT,
          ),
        );
      }

      return this.offerService.fetchActiveOffersforAccount(
        accountId,
        activeDate,
      );
    } catch (error) {
      return Promise.resolve(
        new CustomError(
          '8262',
          ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
          ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
        ),
      );
    }
  }

  @Patch('/:id')
  @CustomErrorInterceptor()
  updateOfferStatus(
    @Param('id') id: string,
    @Body() updateOfferStatusDto: UpdateOfferStatusDto,
  ): Promise<string | CustomError> {
    return this.offerService.updateOfferStatus(updateOfferStatusDto.status, id);
  }
}
