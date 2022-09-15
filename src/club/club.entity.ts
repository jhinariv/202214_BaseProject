import { PartnerEntity } from '../partner/partner.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  foundation_date: Date;

  @Column()
  image: string;

  @Column('varchar', {length: 100})
  description: string;

  @ManyToMany(() => PartnerEntity, partner => partner.clubs)
  @JoinTable()
  partners: PartnerEntity[];
}
