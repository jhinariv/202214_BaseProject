import { ClubEntity } from 'src/club/club.entity';
import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PartnerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  birthday: Date;

  @ManyToMany(() => ClubEntity, club => club.partner)
  @JoinTable()
  club: ClubEntity;
}
