import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from 'typeorm';

@Entity()
export class Punch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  punch_card_id!: string;

  @CreateDateColumn()
  created_at!: Date;
} 