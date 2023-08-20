import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { AccountEntity } from '../../account/entities/account.entity';
import { LimitTypeEnum, OfferStatusEnum } from '../enum/offer.enum';

@Entity('offers')
export class OfferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccountEntity, { nullable: false })
  @JoinColumn({ name: 'account_id' })
  account_id: AccountEntity;

  @Column({
    type: 'enum',
    enum: LimitTypeEnum,
    nullable: false,
  })
  limit_type: LimitTypeEnum;

  @Column({
    type: 'enum',
    enum: OfferStatusEnum,
    default: OfferStatusEnum.PENDING,
  })
  status: OfferStatusEnum;

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
