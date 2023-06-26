import categoryRepository from '../../repositories/category-repository';
import transactionsRepository from '../../repositories/transactions-repository';
import { notFoundError } from '../../errors';
import { badRequestError } from '../../errors/bad-request-error';
import balanceRepository from '../../repositories/balance-repository';

async function postTransactions({ userId, typeTransaction, value, categoryName, color, dateTransaction, done, categoryId }) {
    const category = await categoryRepository.createOrUpdate(categoryId, userId, categoryName, color);

    await transactionsRepository.create({ value, typeTransaction, dateTransaction: new Date(dateTransaction), done, userId, categoryId: category.id });

}

async function historicByUserId(userId: number) {
    const transactions = await transactionsRepository.findTransactionsByUserId(userId);
    if (!transactions.length) return [];

    return transactions;
}

async function deleteTransactionById(userId: number, transactionId: number) {
    if (!transactionId) throw badRequestError();

    const transaction = await transactionsRepository.findTransaction(userId, transactionId);
    if (!transaction) throw notFoundError();

    await transactionsRepository.deleteTransaction(transaction);
}

async function dataGraficByUserId(userId: number) {
    const transactionsByCategories = await transactionsRepository.findTransactionsByCategory(userId);
    if (!transactionsByCategories.length) return [];

    const array = transactionsByCategories.map((transactionsByCategory => {
        if (transactionsByCategory.Transaction.length) {
            return {
                name: transactionsByCategory.name,
                type: 'column',
                color: transactionsByCategory.color,
                data: transactionsByCategory.Transaction.map(transaction => {
                    return {
                        x: transaction.dateTransaction,
                        y: transaction.value
                    }
                })
            }
        }
    }));

    const balance = await balanceRepository.findBalancesByUserId(userId)
    array.push({
            name: 'Saldo',
            type: 'line',
            color: '#000',
            data: balance.map(b => {
                return {
                    x: b.dateTransaction,
                    y: b.value
                }
            })
    });

    return array.filter(a => a);
}

const transactionsService = {
    postTransactions,
    deleteTransactionById,
    historicByUserId,
    dataGraficByUserId,
};

export default transactionsService;
