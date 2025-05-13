import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class LoyaltyProgram {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  merchant_id!: string;

  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column()
  required_punches!: number;

  @Column()
  reward_description!: string;

  @CreateDateColumn()
  created_at!: Date;
} 