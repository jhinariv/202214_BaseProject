import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PartnerEntity } from './partner.entity';
import { PartnerService } from './partner.service';
import { faker } from '@faker-js/faker';
import { ClubEntity } from '../club/club.entity';

describe('PartnerService', () => {
  let service: PartnerService;
  let repository: Repository<PartnerEntity>;
  let dummyClubsList: ClubEntity[];
  let partnersList: PartnerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PartnerService],
    }).compile();

    service = module.get<PartnerService>(PartnerService);
    repository = module.get<Repository<PartnerEntity>>(
      getRepositoryToken(PartnerEntity)
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    await repository.clear();
    partnersList = [];
    for (let i = 0; i < 5; i++) {
      const partner: PartnerEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
        clubs: dummyClubsList
      });
      partnersList.push(partner);
    }
  };

  it('findAll should return all partners', async () => {
    const partners: PartnerEntity[] = await service.findAll();
    expect(partners).not.toBeNull();
    expect(partners).toHaveLength(partnersList.length);
  });

  it('findOne should return a partner by id', async () => {
    const storedPartner: PartnerEntity = partnersList[0];
    const partner: PartnerEntity = await service.findOne(storedPartner.id);
    expect(partner).not.toBeNull();
    expect(partner.name).toEqual(storedPartner.name)
    expect(partner.email).toEqual(storedPartner.email)
    expect(partner.birthday).toEqual(storedPartner.birthday)
  });

  it('findOne should throw an exception for an invalid partner', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The partner with the given id was not found")
  });

  it('create should return a new partner', async () => {
    const partner: PartnerEntity = {
      id: "",
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
      clubs: []
    }
    const newPartner: PartnerEntity = await service.create(partner);
    expect(newPartner).not.toBeNull();
    const storedPartner: PartnerEntity = await repository.findOne({ where: { id: newPartner.id } })
    expect(storedPartner).not.toBeNull();
    expect(storedPartner.name).toEqual(newPartner.name)
    expect(storedPartner.email).toEqual(newPartner.email)
    expect(storedPartner.birthday).toEqual(newPartner.birthday)
  });

  it('create partner should throw an exception for an invalid email', async () => {
    const partner: PartnerEntity = {
      id: "",
      name: faker.name.fullName(),
      email: faker.lorem.sentence(1),
      birthday: faker.date.birthdate({ min: 1922, max: 2004, mode: 'year' }),
      clubs: []
    }
    await expect(() => service.create(partner)).rejects.toHaveProperty("message", "The email is invalid")
  });

  it('update should modify a partner', async () => {
    const partner: PartnerEntity = partnersList[0];
    partner.name = "New name";
    partner.email = "email@email.com";
    partner.birthday = new Date(2012, 0, 1);
    const updatedPartner: PartnerEntity = await service.update(partner.id, partner);
    expect(updatedPartner).not.toBeNull();
    const storedPartner: PartnerEntity = await repository.findOne({ where: { id: partner.id } })
    expect(storedPartner).not.toBeNull();
    expect(storedPartner.name).toEqual(partner.name)
    expect(storedPartner.email).toEqual(partner.email)
    expect(storedPartner.birthday).toEqual(partner.birthday)
  });

  it('update should throw an exception for an invalid partner', async () => {
    let partner: PartnerEntity = partnersList[0];
    partner = {
      ...partner,
      name: "New name",
      email: "email@email.com",
      birthday: new Date(2012, 0, 1),
    }
    await expect(() => service.update("0", partner)).rejects.toHaveProperty("message", "The partner with the given id was not found")
  });

  it('update partner should throw an exception for an invalid email', async () => {
    let partner: PartnerEntity = partnersList[0];
    partner = {
      ...partner,
      name: "New name",
      email: "New email",
      birthday: new Date(2012, 0, 1),
    }
    await expect(() => service.update("0", partner)).rejects.toHaveProperty("message", "The email is invalid")
  });

  it('delete should remove a partner', async () => {
    const partner: PartnerEntity = partnersList[0];
    await service.delete(partner.id);
    const deletedPartner: PartnerEntity = await repository.findOne({ where: { id: partner.id } })
    expect(deletedPartner).toBeNull();
  });

  it('delete should throw an exception for an invalid partner', async () => {
    const partner: PartnerEntity = partnersList[0];
    await service.delete(partner.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The partner with the given id was not found")
  });

});
