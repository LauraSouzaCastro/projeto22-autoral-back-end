import { notFoundError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';
import historicRepository from '@/repositories/historic-repository';

export async function historicByUserId(userId: number){
    const transactions = await historicRepository.findTransactionsByUserId(userId);
    if(!transactions.length) return [];
    
    return transactions; 
}

async function deleteTransactionById(userId: number, transactionId: number) {
    if (!transactionId) throw badRequestError();
  
    const transaction = await historicRepository.findTransaction(userId, transactionId);
    if (!transaction) throw notFoundError();
  
    await historicRepository.deleteTransaction(transactionId);
  }

const historicService = {
    historicByUserId,
    deleteTransactionById,
};

export default historicService;