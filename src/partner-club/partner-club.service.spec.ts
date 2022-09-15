import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { PartnerEntity } from '../partner/partner.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PartnerClubService } from './partner-club.service';
import { faker } from '@faker-js/faker';

describe('PartnerClubService', () => {
  let service: PartnerClubService;
  let clubRepository: Repository<ClubEntity>;
  let partnerRepository: Repository<PartnerEntity>;
  let club: ClubEntity;
  let partnersList: PartnerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PartnerClubService],
    }).compile();

    service = module.get<PartnerClubService>(PartnerClubService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    partnerRepository = module.get<Repository<PartnerEntity>>(getRepositoryToken(PartnerEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    partnerRepository.clear();
    clubRepository.clear();

    partnersList = [];
    for (let i = 0; i < 5; i++) {
      const partner: PartnerEntity = await partnerRepository.save({
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
      })
      partnersList.push(partner);
    }

    club = await clubRepository.save({
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      foundation_date: faker.date.past(),
      image: faker.image.business(),
      description: faker.random.alpha(100),
      partners: partnersList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPartnerToClub should add an partner to a club', async () => {
    const newPartner: PartnerEntity = await partnerRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
    });

    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundation_date: faker.date.past(),
      image: faker.image.business(),
      description: faker.random.alpha(100),
    })

    const result: ClubEntity = await service.addPartnerToClub(newClub.id, newPartner.id);
    expect(result.partners.length).toBe(1);
    expect(result.partners[0]).not.toBeNull();
    expect(result.partners[0].name).toBe(newPartner.name)
    expect(result.partners[0].email).toBe(newPartner.email)
   // expect(result.partners[0].birthday).toBe(newPartner.birthday)
  });

  it('addPartnerToClub should thrown exception for an invalid partner', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundation_date: faker.date.past(),
      image: faker.image.business(),
      description: faker.random.alpha(100),
    })

    await expect(() => service.addPartnerToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The partner with the given id was not found");
  });

  it('addPartnerToClub should throw an exception for an invalid club', async () => {
    const newPartner: PartnerEntity = await partnerRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
    });

    await expect(() => service.addPartnerToClub("0", newPartner.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findPartnerFromClub should return partner by club', async () => {
    const partner: PartnerEntity = partnersList[0];
    const storedPartner: PartnerEntity = await service.findPartnerFromClub(club.id, partner.id,)
    expect(storedPartner).not.toBeNull();
    expect(storedPartner.name).toBe(partner.name);
    expect(storedPartner.email).toBe(partner.email);
    // expect(storedPartner.birthday).toBe(partner.birthday);
  });

  it('findPartnerFromClub should throw an exception for an invalid partner', async () => {
    await expect(() => service.findPartnerFromClub(club.id, "0")).rejects.toHaveProperty("message", "The partner with the given id was not found");
  });

  it('findPartnerFromClub should throw an exception for an invalid club', async () => {
    const partner: PartnerEntity = partnersList[0];
    await expect(() => service.findPartnerFromClub("0", partner.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findPartnerFromClub should throw an exception for an partner not associated to the club', async () => {
    const newPartner: PartnerEntity = await partnerRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
    });
    await expect(() => service.findPartnerFromClub(club.id, newPartner.id)).rejects.toHaveProperty("message", "The partner with the given id is not associated to the club");
  });

  it('findPartnersFromClub should return partners by club', async () => {
    const partners: PartnerEntity[] = await service.findPartnersFromClub(club.id);
    expect(partners.length).toBe(5)
  });

  it('findPartnersFromClub should throw an exception for an invalid club', async () => {
    await expect(() => service.findPartnersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('updatePartnersFromClub should update partners list for a club', async () => {
    const newPartner: PartnerEntity = await partnerRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
    });
    const updatedClub: ClubEntity = await service.updatePartnersFromClub(club.id, [newPartner]);
    expect(updatedClub.partners.length).toBe(1);
    expect(updatedClub.partners[0].name).toBe(newPartner.name);
    expect(updatedClub.partners[0].email).toBe(newPartner.email);
    expect(updatedClub.partners[0].birthday).toBe(newPartner.birthday);
  });

  it('updatePartnersFromClub should throw an exception for an invalid club', async () => {
    const newPartner: PartnerEntity = await partnerRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
    });

    await expect(() => service.updatePartnersFromClub("0", [newPartner])).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('updatePartnersFromClub should throw an exception for an invalid partner', async () => {
    const newPartner: PartnerEntity = partnersList[0];
    newPartner.id = "0";

    await expect(() => service.updatePartnersFromClub(club.id, [newPartner])).rejects.toHaveProperty("message", "The partner with the given id was not found");
  });

  it('deletePartnerFromClub should remove an partner from a club', async () => {
    const partner: PartnerEntity = partnersList[0];

    await service.deletePartnerFromClub(club.id, partner.id);

    const storedClub: ClubEntity = await clubRepository.findOne({ where: { id: club.id }, relations: ["partners"] });
    const deletedPartner: PartnerEntity = storedClub.partners.find(a => a.id === partner.id);

    expect(deletedPartner).toBeUndefined();

  });

  it('deletePartnerFromClub should thrown an exception for an invalid partner', async () => {
    await expect(() => service.deletePartnerFromClub(club.id, "0")).rejects.toHaveProperty("message", "The partner with the given id was not found");
  });

  it('deletePartnerFromClub should thrown an exception for an invalid club', async () => {
    const partner: PartnerEntity = partnersList[0];
    await expect(() => service.deletePartnerFromClub("0", partner.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('deletePartnerFromClub should thrown an exception for an non asocciated partner', async () => {
    const newPartner: PartnerEntity = await partnerRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
    });

    await expect(() => service.deletePartnerFromClub(club.id, newPartner.id)).rejects.toHaveProperty("message", "The partner with the given id is not associated to the club");
  });

});
