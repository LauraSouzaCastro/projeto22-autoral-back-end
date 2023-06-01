import { User } from '@prisma/client';
import profileRepository from '@/repositories/profile-repository';
import { notFoundError } from '@/errors';

export async function updateUserImage({ userId, image }): Promise<User> {
    const user = await profileRepository.find({ id: userId });
    if(!user) throw notFoundError();
    
    return profileRepository.updateImage({ id: userId, image });
}

export async function updateUserName({ userId, name }): Promise<User> {
    const user = await profileRepository.find({ id: userId });
    if(!user) throw notFoundError();
    
    return profileRepository.updateName({ id: userId, name });
}

const profileService = {
    updateUserImage,
    updateUserName,
};

export default profileService;
