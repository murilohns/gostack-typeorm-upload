import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
  title: string;

  value: number;

  type: 'income' | 'outcome';

  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!title) {
      throw new AppError('title is required');
    }

    if (!value) {
      throw new AppError('value is required');
    }

    if (!type) {
      throw new AppError('type is required');
    }

    if (!category) {
      throw new AppError('category is required');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total - value < 0) {
      throw new AppError('Cannot create transaction without balance');
    }

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const findCategory = await categoriesRepository.findOrCreate(category);

    const transaction = await transactionsRepository.create({
      title,
      value,
      type,
      category: findCategory,
    });

    await transactionsRepository.save(transaction);

    transaction.category = findCategory;

    return transaction;
  }
}

export default CreateTransactionService;
