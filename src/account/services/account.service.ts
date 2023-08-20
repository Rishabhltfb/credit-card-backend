import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomError } from 'src/error/error.interface';
import { CreateAccountDto } from '../dtos/account.dto';
import { AccountRepository } from '../repository/account.repository';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository,
  ) {}

  //   getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
  //     return this.AccountRepository.getTasks(filterDto, user);
  //   }

  //   async getAccountById(accountId: string, user: User): Promise<Task> {
  //     const found = await this.AccountRepository.findOne({ where: { id, user } });
  //     if (!found) {
  //       throw new NotFoundException(`Task with ID "${id}" not found.`);
  //     }
  //     return found;
  //   }

  //   async deleteTask(id: string, user: User): Promise<void> {
  //     const result = await this.AccountRepository.delete({ id, user });
  //     console.log(result);
  //     if (result.affected === 0) {
  //       throw new NotFoundException(`Task with ID "${id}" not found`);
  //     }
  //   }

  //   async updateTaskStatus(
  //     id: string,
  //     status: TaskStatus,
  //     user: User,
  //   ): Promise<Task> {
  //     const task: Task = await this.getTaskById(id, user);
  //     task.status = status;
  //     this.AccountRepository.save(task);
  //     return task;
  //   }

  public async createAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<void | CustomError> {
    const isValidData: boolean = this.accountCreationChecks(createAccountDto);
    if (!isValidData)
      return new CustomError(
        '2736',
        'VALIDATION_FAILED',
        'Account creation checks failed!',
      );
    return this.accountRepository.createAccount(createAccountDto);
  }

  private accountCreationChecks(createAccountDto: CreateAccountDto): boolean {
    const { accountLimit, customerId, perTransactionLimit } = createAccountDto;
    return (
      accountLimit > 0 && perTransactionLimit > 0 && customerId.length != 0
    );
  }
}
