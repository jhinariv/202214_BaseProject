import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { PartnerEntity } from '../partner/partner.entity';
import { PartnerClubService } from './partner-club.service';
import { PartnerClubController } from './partner-club.controller';

@Module({
  providers: [PartnerClubService],
  imports: [TypeOrmModule.forFeature([PartnerEntity, ClubEntity])],
  controllers: [PartnerClubController],
})
export class PartnerClubModule {}
