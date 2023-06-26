import { prisma } from "../../config";
import { User } from ".prisma/client";

async function find({ id }) {
    return prisma.user.findUnique({
        where: {
            id
        },
    });
}

async function updateImage({ id, image }): Promise<User>{
    return prisma.user.update({
        where: {
            id
        },
        data: {
            image,
        },
    });
}

async function updateName({ id, name }): Promise<User>{
    return prisma.user.update({
        where: {
            id
        },
        data: {
            name,
        },
    });
}

const profileRepository = {
    find,
    updateImage,
    updateName,
};

export default profileRepository;