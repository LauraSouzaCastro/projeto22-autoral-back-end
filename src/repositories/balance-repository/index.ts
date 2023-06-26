import { prisma } from "../../config";
import { Transaction } from ".prisma/client";

async function findBalanceByUserId(userId: number) {
    return prisma.balance.findFirst({
        where: {
            userId,
        },
        orderBy: {
            dateTransaction: 'desc'
        }
    });
}

async function findBalancesByUserId(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return prisma.balance.findMany({
        where: {
            userId,
            dateTransaction: { gte: thirtyDaysAgo },
        },
        select: {
            dateTransaction: true,
            value: true,
        },
        orderBy: {
            dateTransaction: 'asc'
        },
    });
}

async function createBalanceByUserId(transaction: Transaction) {
    const balance = await prisma.balance.findFirst({
        where: {
            userId: transaction.userId,
            dateTransaction: { lte: transaction.dateTransaction }
        },
        orderBy: {
            dateTransaction: 'desc'
        }
    });

    let value = balance ? Number(balance.value) : 0
    if (transaction.typeTransaction === 'INPUT') value += Number(transaction.value)
    if (transaction.typeTransaction === 'OUTPUT') value -= Number(transaction.value)

    await prisma.balance.create({
        data: {
            userId: transaction.userId,
            dateTransaction: transaction.dateTransaction,
            value,
            transactionId: transaction.id,
        },
    });

    await prisma.balance.updateMany({
        where: {
            userId: transaction.userId,
            dateTransaction: { gt: transaction.dateTransaction }
        },
        data: {
            value: { increment: transaction.typeTransaction === 'INPUT' ? Number(transaction.value) : -Number(transaction.value) }
        }
    })
}

const balanceRepository = {
    findBalanceByUserId,
    createBalanceByUserId,
    findBalancesByUserId,
};

export default balanceRepository;