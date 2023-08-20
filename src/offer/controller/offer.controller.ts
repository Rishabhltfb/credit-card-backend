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

@Controller('offer')
export class OfferController {
  private logger = new Logger(OfferController.name);
  constructor(private offerService: OfferService) {}

  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<OfferEntity | CustomError> {
    const account = await this.offerService.createOffer(createOfferDto);
    return account;
  }

  @Get('fetch')
  getOfferById(@Query('id') id: string): Promise<OfferEntity | CustomError> {
    this.logger.debug(id);
    return this.offerService.findOfferById(id);
  }

  @Patch('/:id')
  updateAccountLimits(
    @Param('id') id: string,
    @Body() updateOfferStatusDto: UpdateOfferStatusDto,
  ): Promise<boolean | CustomError> {
    return this.offerService.updateOfferStatus(updateOfferStatusDto.status, id);
  }
}
