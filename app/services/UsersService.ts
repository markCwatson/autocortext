import { ObjectId } from 'mongodb';
import AuthService from '@/services/AuthService';
import UsersRepository, { UserModel } from '@/repos/UsersRepository';
import NotificationService from './NotificationService';

interface CreateUserInput {
  password: string;
  email: string;
  name: string;
  companyId?: string;
  companyName: string;
}

export type User = UserModel;

class UsersService {
  static async create(body: CreateUserInput): Promise<any> {
    const { password, email, name, companyId, companyName } = body;
    const user = await UsersRepository.selectByEmail(email);
    if (user) {
      return null;
    }

    const hashedPassword = await AuthService.geHashedPassword(password);
    return UsersRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      companyId: new ObjectId(companyId),
      companyName,
    });
  }

  static async getUsers(): Promise<User[]> {
    return UsersRepository.getUsers();
  }

  static async getUserById(id: ObjectId): Promise<User | null> {
    return UsersRepository.selectById(id);
  }

  static async getUsersByCompanyId(companyId: string): Promise<User[] | null> {
    return UsersRepository.selectByCompanyId(new ObjectId(companyId));
  }

  static async delete(id: string): Promise<Boolean> {
    const user = await UsersRepository.selectById(new ObjectId(id));
    if (!user) return false;
    await UsersRepository.delete(new ObjectId(id));
    await NotificationService.deleteByUserId(id);
    return true;
  }

  static async deleteByCompanyId(companyId: string): Promise<Boolean> {
    return UsersRepository.deleteByCompanyId(new ObjectId(companyId));
  }

  static async selectByEmail(email: string): Promise<User | null> {
    return UsersRepository.selectByEmail(email);
  }

  static async selectById(id: ObjectId): Promise<User | null> {
    return UsersRepository.selectById(id);
  }
}

export default UsersService;
