import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (typeof id !== 'string') {
      throw new AppError('id must be a string', 404);
    }
    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
