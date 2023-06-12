import { prisma } from "@/config";
import { Transaction } from "@prisma/client";

type TransactionParams = Pick<Transaction, 'value' | 'typeTransaction' | 'dateTransaction' | 'done'| 'userId' | 'categoryId'>;

async function create(data: TransactionParams) {
    await prisma.transaction.create({
        data
    })
}

const transactionsRepository = {
    create,
};

export default transactionsRepository;