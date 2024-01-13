import { ObjectId } from 'mongodb';

import AuthService from '@/services/AuthService';
import UsersRepository, { UserModel } from '@/repos/UsersRepository';

interface CreateUserInput {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export type User = UserModel;

class UsersService {
  static async create(body: CreateUserInput): Promise<any> {
    const { password, email, firstName, lastName } = body;
    const hashedPassword = await AuthService.geHashedPassword(password);
    return UsersRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  }

  static async getUsers(): Promise<User[]> {
    return UsersRepository.getUsers();
  }

  static async getUserById(id: ObjectId): Promise<User | null> {
    return UsersRepository.selectById(id);
  }

  static async delete(id: ObjectId): Promise<Boolean> {
    const user = await UsersRepository.selectById(id);
    if (!user) return false;
    return UsersRepository.delete(id);
  }

  static async selectByEmail(email: string): Promise<User | null> {
    return UsersRepository.selectByEmail(email);
  }

  static async selectById(id: ObjectId): Promise<User | null> {
    return UsersRepository.selectById(id);
  }
}

export default UsersService;
