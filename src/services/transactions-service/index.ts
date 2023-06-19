import categoryRepository from '@/repositories/category-repository';
import transactionsRepository from '@/repositories/transactions-repository';
import { notFoundError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';

async function postTransactions({ userId, typeTransaction, value, categoryName, color, dateTransaction, done, categoryId }) {
    const category = await categoryRepository.createOrUpdate(categoryId, userId, categoryName, color);
    
    await transactionsRepository.create({value, typeTransaction, dateTransaction: new Date(dateTransaction), done, userId, categoryId: category.id});
    
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

    await transactionsRepository.deleteTransaction(transactionId);
}

const transactionsService = {
    postTransactions,
    deleteTransactionById,
    historicByUserId,
};

export default transactionsService;
