import { prisma } from "@/config";
import { User } from "@prisma/client";

async function find({ id }) {
    return prisma.user.findUnique({
        where: {
            id
        },
    });
}

async function update({ id, name, image }): Promise<User>{
    return prisma.user.update({
        where: {
            id
        },
        data: {
            name,
            image,
        },
    });
}

const profileRepository = {
    find,
    update,
};

export default profileRepository;