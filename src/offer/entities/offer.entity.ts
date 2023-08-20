import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { AccountEntity } from '../../account/entities/account.entity';

export enum LimitTypeEnum {
  ACCOUNT_LIMIT = 'ACCOUNT_LIMIT',
  PER_TRANSACTION_LIMIT = 'PER_TRANSACTION_LIMIT',
}

@Entity()
export class OfferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => AccountEntity, { nullable: false })
  @JoinColumn()
  account_id: AccountEntity;

  @Column({
    type: 'enum',
    enum: LimitTypeEnum,
    nullable: false,
  })
  limit_type: LimitTypeEnum;

  @Column({ type: 'numeric', nullable: false })
  new_limit: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  offer_activation_time: Date;

  @Column({ type: 'timestamp', nullable: false })
  offer_expiry_time: Date;
}
