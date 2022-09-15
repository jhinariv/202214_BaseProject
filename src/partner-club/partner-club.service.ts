import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { PartnerEntity } from '../partner/partner.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,

    @InjectRepository(PartnerEntity)
    private readonly partnerRepository: Repository<PartnerEntity>
  ) { }

  async addPartnerToClub(clubId: string, partnerId: string): Promise<ClubEntity> {
    const partner: PartnerEntity = await this.partnerRepository.findOne({ where: { id: partnerId }, relations: ["clubs"] });
    if (!partner)
      throw new BusinessLogicException("The partner with the given id was not found", BusinessError.NOT_FOUND);

    const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId }, relations: ["partners"] })
    if (!club)
      throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);

    club.partners = [...club.partners, partner]
    return await this.clubRepository.save(club);
  }

  async findPartnerFromClub(clubId: string, partnerId: string): Promise<PartnerEntity> {
    const partner: PartnerEntity = await this.partnerRepository.findOne({ where: { id: partnerId } });
    if (!partner)
      throw new BusinessLogicException("The partner with the given id was not found", BusinessError.NOT_FOUND)

    const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId }, relations: ["partners"] });
    if (!club)
      throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

    const clubPartner: PartnerEntity = club.partners.find(e => e.id === partner.id);

    if (!clubPartner)
      throw new BusinessLogicException("The partner with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)

    return clubPartner;
  }

  async findPartnersFromClub(clubId: string): Promise<PartnerEntity[]> {
    const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId }, relations: ["partners"] });
    if (!club)
      throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

    return club.partners;
  }

  async updatePartnersFromClub(clubId: string, partners: PartnerEntity[]): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId }, relations: ["partners"] });
    if (!club)
      throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

    for (let i = 0; i < partners.length; i++) {
      const partner: PartnerEntity = await this.partnerRepository.findOne({ where: { id: partners[i].id } });
      if (!partner)
        throw new BusinessLogicException("The partner with the given id was not found", BusinessError.NOT_FOUND)
    }

    club.partners = partners;
    return await this.clubRepository.save(club);
  }

  async deletePartnerFromClub(clubId: string, partnerId: string) {
    const partner: PartnerEntity = await this.partnerRepository.findOne({ where: { id: partnerId } });
    if (!partner)
      throw new BusinessLogicException("The partner with the given id was not found", BusinessError.NOT_FOUND)

    const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId }, relations: ["partners"] });
    if (!club)
      throw new BusinessLogicException ("The club with the given id was not found", BusinessError.NOT_FOUND)

    const clubPartner: PartnerEntity = club.partners.find(e => e.id === partner.id);
    if (!clubPartner)
      throw new BusinessLogicException("The partner with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)

    club.partners = club.partners.filter(e => e.id !== partnerId);
    await this.clubRepository.save(club);
  }
}
