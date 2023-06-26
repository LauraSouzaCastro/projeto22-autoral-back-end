import { Prisma } from '.prisma/client';
import { prisma } from '../../config';

async function create(data: Prisma.SessionUncheckedCreateInput) {
  return prisma.session.create({
    data,
  });
}

async function find(userId: number) {
  return prisma.session.findMany({
    where: {
      userId,
    },
  });
}

const sessionRepository = {
  create,
  find
};

export default sessionRepository;
