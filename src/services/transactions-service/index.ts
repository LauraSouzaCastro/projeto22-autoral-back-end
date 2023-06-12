import categoryRepository from '@/repositories/category-repository';
import transactionsRepository from '@/repositories/transactions-repository';

export async function postTransactions({ userId, typeTransaction, value, categoryName, color, dateTransaction, done, categoryId }) {
    const category = await categoryRepository.createOrUpdate(categoryId, userId, categoryName, color);
    
    await transactionsRepository.create({value, typeTransaction, dateTransaction: new Date(dateTransaction), done, userId, categoryId: category.id});
    
}

const transactionsService = {
    postTransactions,
};

export default transactionsService;
