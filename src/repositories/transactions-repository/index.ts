import { prisma } from "../../config";
import { Transaction } from ".prisma/client";
import balanceRepository from "../balance-repository";

export type TransactionParams = Pick<Transaction, 'value' | 'typeTransaction' | 'dateTransaction' | 'done' | 'userId' | 'categoryId'>;

async function create(data: TransactionParams) {
    const transaction = await prisma.transaction.create({
        data
    })
    if (data.done) {
        await balanceRepository.createBalanceByUserId(transaction);
    }
}

async function findTransactionsByUserId(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return prisma.transaction.findMany({
        where: {
            userId,
            done: true,
            dateTransaction: { gte: thirtyDaysAgo },
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

async function deleteTransaction(transaction: Transaction) {
    await prisma.transaction.delete({
        where: {
            id: transaction.id,
        },
    });
    await prisma.balance.updateMany({
        where: {
            userId: transaction.userId,
            dateTransaction: { gt: transaction.dateTransaction }
        },
        data: {
            value: { increment: transaction.typeTransaction === 'INPUT' ? -Number(transaction.value) : Number(transaction.value) }
        }
    })
}

async function findTransactionsByCategory(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return prisma.category.findMany({
        where: {
            userId,
        },
        select: {
            id: true,
            color: true,
            name: true,
            Transaction: {
                select: {
                    dateTransaction: true,
                    value: true,
                    typeTransaction: true,
                },
                where: {
                    done: true,
                    dateTransaction: { gte: thirtyDaysAgo },
                },
                orderBy: {
                    dateTransaction: 'desc',
                },
            },
        },
    });
}

async function findNotificationsByUserId(userId: number) {
    const today = new Date();
    today.setDate(today.getDate());

    return prisma.transaction.findMany({
        where: {
            userId,
            done: false,
            dateTransaction: { lte: today },
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
    });
}

async function updateTransaction(transaction: Transaction) {
    await prisma.transaction.update({
        where: {
            id: transaction.id,
        },
        data: {
            done: true,
        }
    });

    await balanceRepository.createBalanceByUserId(transaction);
    
}

const transactionsRepository = {
    create,
    findTransactionsByUserId,
    findTransaction,
    deleteTransaction,
    findTransactionsByCategory,
    findNotificationsByUserId,
    updateTransaction,
};

export default transactionsRepository;