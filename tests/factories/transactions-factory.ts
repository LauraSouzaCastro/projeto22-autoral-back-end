import { faker } from '../../node_modules/@faker-js/faker';
import { prisma } from '../../src/config';
import { TransactionType } from '.prisma/client';

export async function createTransaction(userId: number, typeTransaction: TransactionType) {
    const category = await prisma.category.create({
        data: {
            userId,
            color: faker.color.rgb(),
            name: faker.string.alphanumeric(),
        }
    })

    const transaction = await prisma.transaction.create({
        data: {
            typeTransaction,
            value: 1,
            dateTransaction: faker.date.recent(),
            done: true,
            categoryId: category.id,
            userId,
        },
    });

    await prisma.balance.create({
        data: {
            transactionId: transaction.id,
            dateTransaction: transaction.dateTransaction,
            value: transaction.value,
            userId: transaction.userId,
        }
    });

    return transaction;
}