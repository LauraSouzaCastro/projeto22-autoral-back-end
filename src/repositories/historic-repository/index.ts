import { prisma } from "@/config";

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
const historicRepository = {
    findTransactionsByUserId,
    findTransaction,
    deleteTransaction,
};

export default historicRepository;