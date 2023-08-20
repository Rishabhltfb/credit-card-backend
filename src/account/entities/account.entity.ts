import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('accounts')
@Unique(['customer_id'])
export class AccountEntity {
  @PrimaryGeneratedColumn()
  account_id: number;

  @OneToOne(() => UserEntity, { nullable: false })
  @JoinColumn()
  customer_id: UserEntity;

  @Column({ type: 'numeric', nullable: false })
  account_limit: number;

  @Column({ type: 'numeric', nullable: false })
  per_transaction_limit: number;

  @Column({ type: 'numeric', nullable: true })
  last_account_limit: number | null;

  @Column({ type: 'numeric', nullable: true })
  last_per_transaction_limit: number | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  account_limit_update_time: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  per_transaction_limit_update_time: Date;
}
