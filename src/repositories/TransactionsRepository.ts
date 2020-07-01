import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();

    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    // eslint-disable-next-line
    transactions.map(transaction => {
      balance[transaction.type] += transaction.value;
    });

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
