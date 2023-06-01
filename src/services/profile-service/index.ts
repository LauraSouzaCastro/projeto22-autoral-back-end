import { User } from '@prisma/client';
import profileRepository from '@/repositories/profile-repository';
import { notFoundError } from '@/errors';

export async function updateUser({ userId, name, image }): Promise<User> {
    const user = await profileRepository.find({ id: userId });
    if(!user) throw notFoundError();
    
    return profileRepository.update({ id: userId, name, image });
}

const profileService = {
    updateUser,
};

export default profileService;
