import { prisma } from "@/config";
import { TransactionType } from "@prisma/client";

async function existTransactionsByUserId(userId: number, typeTransaction: TransactionType ) {
    return prisma.transaction.findMany({
        where: {
            userId,
            typeTransaction,
            done: true,
        },
      });
}

async function findTransactionsByUserId(userId: number, typeTransaction: TransactionType ) {
    return prisma.transaction.groupBy({
        by: ['userId'],
        where: {
            userId,
            typeTransaction,
            done: true,
        },
        _sum: {
          value: true
        },
      });
}


const balanceRepository = {
    findTransactionsByUserId,
    existTransactionsByUserId,
};

export default balanceRepository;