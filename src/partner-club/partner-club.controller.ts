import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PartnerDto } from 'src/partner/partner.dto';
import { PartnerEntity } from 'src/partner/partner.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PartnerClubService } from './partner-club.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class PartnerClubController {
  constructor(private readonly clubPartnerService: PartnerClubService) { }

  @Post(':clubId/partners/:partnerId')
  async addPartnerToClub(@Param('clubId') clubId: string, @Param('partnerId') partnerId: string) {
    return await this.clubPartnerService.addPartnerToClub(clubId, partnerId);
  }

  @Get(':clubId/partners/:partnerId')
  async findPartnerFromClub(@Param('clubId') clubId: string, @Param('partnerId') partnerId: string) {
    return await this.clubPartnerService.findPartnerFromClub(clubId, partnerId);
  }

  @Get(':clubId/partners')
  async findPartnersFromClub(@Param('clubId') clubId: string) {
    return await this.clubPartnerService.findPartnersFromClub(clubId);
  }

  @Put(':clubId/partners')
  async updatePartnersFromClub(@Body() partnersDto: PartnerDto[], @Param('clubId') clubId: string) {
    const partners = plainToInstance(PartnerEntity, partnersDto)
    return await this.clubPartnerService.updatePartnersFromClub(clubId, partners);
  }

  @Delete(':clubId/partners/:partnerId')
  @HttpCode(204)
  async deletePartnerFromClub(@Param('clubId') clubId: string, @Param('partnerId') partnerId: string) {
    return await this.clubPartnerService.deletePartnerFromClub(clubId, partnerId);
  }
}
