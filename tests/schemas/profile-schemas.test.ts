import { faker } from '@faker-js/faker';
import { updateProfileSchema } from '@/schemas';

describe('updateProfileSchema', () => {
    const generateValidInput = () => ({
      name: faker.person.fullName(),
    });
  
    describe('when name is not valid', () => {
      it('should return error if name is not present', () => {
        const input = generateValidInput();
        delete input.name;
  
        const { error } = updateProfileSchema.validate(input);
  
        expect(error).toBeDefined();
      });
  
      it('should return error if name does not follow valid email format', () => {
        const input = generateValidInput();
        input.name = "";
  
        const { error } = updateProfileSchema.validate(input);
  
        expect(error).toBeDefined();
      });
    });

  
    it('should return no error if input is valid', () => {
      const input = generateValidInput();
  
      const { error } = updateProfileSchema.validate(input);
  
      expect(error).toBeUndefined();
    });
  });