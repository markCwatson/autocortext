import { ObjectId } from 'mongodb';
import CompanyRepository, { CompanyModel } from '@/repos/CompanyRepository';
import UsersService, { User } from '@/services/UsersService';
import DocService from './DocService';
import { FOLDER } from '@/lib/constants';

interface CreateCompanyInput {
  name: string;
}

export type Company = CompanyModel;

class CompanyService {
  static async create(body: CreateCompanyInput): Promise<CompanyModel | null> {
    const { name } = body;

    // generate index for Pinecone
    let index = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    index = `${index}-${Math.floor(Math.random() * 100000)}`;
    let company = await CompanyRepository.selectByIndex(index);
    if (company) {
      return null;
    }

    company = await CompanyRepository.create({
      name,
      index,
      createdAt: `${new Date().toISOString().split('.')[0]}Z`,
      jobCount: 0,
    });
    if (!company) return null;

    await DocService.create({
      name: 'root',
      parentId: null,
      parentPath: null,
      companyId: company._id!.toString(),
      type: FOLDER,
    });

    return company;
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

  static async getIndexByCompanyId(companyId: string): Promise<string | null> {
    const company = await CompanyRepository.selectById(new ObjectId(companyId));
    return company?.index || null;
  }
}

export default CompanyService;
