import categoryRepository from '@/repositories/category-repository';

export async function findByUserId(userId: number) {
    const categories = await categoryRepository.findByUserId(userId);

    return categories;
}

const categoriesService = {
    findByUserId,
};

export default categoriesService;