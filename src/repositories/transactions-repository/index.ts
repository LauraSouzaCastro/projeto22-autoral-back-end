import { prisma } from "@/config";
import { Transaction } from "@prisma/client";

type TransactionParams = Pick<Transaction, 'value' | 'typeTransaction' | 'dateTransaction' | 'done' | 'userId' | 'categoryId'>;

async function create(data: TransactionParams) {
    await prisma.transaction.create({
        data
    })
}

async function findTransactionsByUserId(userId: number) {
    return prisma.transaction.findMany({
        where: {
            userId,
            done: true,
        },
        select: {
            id: true,
            dateTransaction: true,
            value: true,
            Category: {
                select: {
                    name: true,
                }
            },
        },
        orderBy: {
            dateTransaction: 'desc',
        },
        take: 30,
    });
}

async function findTransaction(userId: number, id: number) {
    return prisma.transaction.findFirst({
        where: {
            id,
            userId,
        },
    });
}

async function deleteTransaction(id: number) {
    await prisma.transaction.delete({
        where: {
            id,
        },
    });
}
const transactionsRepository = {
    create,
    findTransactionsByUserId,
    findTransaction,
    deleteTransaction,
};

export default transactionsRepository;