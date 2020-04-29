import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  username: string;

  @Column('varchar', { length: 255, nullable: true })
  email: string | null;

  @Column('text', { nullable: true })
  password: string | null;

  @Column('boolean', { default: false })
  confirmed: boolean;

  @Column('boolean', { default: false })
  locked: boolean;

  @Column('text', { nullable: true })
  twitterId: string | null;
}
