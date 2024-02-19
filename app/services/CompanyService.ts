import { ObjectId } from 'mongodb';
import CompanyRepository, { CompanyModel } from '@/repos/CompanyRepository';
import UsersService, { User } from '@/services/UsersService';

interface CreateCompanyInput {
  name: string;
}

export type Company = CompanyModel;

class CompanyService {
  static async create(body: CreateCompanyInput): Promise<CompanyModel | null> {
    const { name } = body;

    // generate index for Pinecone
    let index = name.toLowerCase().replace(' ', '-');
    index = `${index}-${Math.floor(Math.random() * 100000)}`;
    const company = await CompanyRepository.selectByIndex(index);
    if (company) {
      return null;
    }

    return CompanyRepository.create({
      name,
      index,
      createdAt: `${new Date().toISOString().split('.')[0]}Z`,
      jobCount: 0,
    });
  }

  static async delete(id: ObjectId): Promise<Boolean> {
    const company = await CompanyRepository.selectById(id);
    if (!company) return false;
    return CompanyRepository.delete(id);
  }

  static async getUsers(companyId: string): Promise<User[] | null> {
    return UsersService.getUsersByCompanyId(companyId);
  }

  static async selectById(id: ObjectId): Promise<Company | null> {
    return CompanyRepository.selectById(id);
  }

  static async getAllCompanies(): Promise<Company[]> {
    return CompanyRepository.getAllCompanies();
  }

  static async incrementJobCountByCompanyId(
    companyId: string,
  ): Promise<CompanyModel | null> {
    return CompanyRepository.incrementJobCountByCompanyId(companyId);
  }
}

export default CompanyService;
