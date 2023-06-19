import { prisma } from "@/config";
import { Category } from "@prisma/client";

async function find(id: number): Promise<Category> {
    return prisma.category.findUnique({
        where: {
            id
        }
    });
}

async function findByUserId(userId: number): Promise<Category[]> {
    return prisma.category.findMany({
        where: {
            userId
        }
    });
}

async function createOrUpdate(id: number, userId: number, name: string, color: string): Promise<Category> {
    return prisma.category.upsert({
        where: {
            id,
        },
        create: { userId, name, color },
        update: { color },
    });
}

const categoryRepository = {
    find,
    findByUserId,
    createOrUpdate,
};

export default categoryRepository;