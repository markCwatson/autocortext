import { ObjectId } from 'mongodb';
import CompanyRepository, { CompanyModel } from '@/repos/CompanyRepository';
import UsersService, { User } from '@/services/UsersService';
import { FOLDER } from '@/lib/constants';
import DocService from '@/services/DocService';
import NotificationService from '@/services/NotificationService';
import ActivitiesService from '@/services/ActivitiesService';
import HistoryService from '@/services/HistoryService';
import JobsService from '@/services/JobsService';
import { deletePineconeIndex } from '@/lib/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

  static async delete(id: string): Promise<Boolean> {
    const company = await CompanyRepository.selectById(new ObjectId(id));
    if (!company) return false;

    await CompanyRepository.delete(new ObjectId(id));

    // delete files from s3
    const client = new S3Client({
      region: process.env.NEXT_AWS_S3_REGION!,
      credentials: {
        accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
      },
    });

    const docs = await DocService.getAllByCompanyId(id);
    for (const doc of docs) {
      if (doc.type === 'file') {
        await client.send(
          new DeleteObjectCommand({
            Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
            Key: doc.name,
          }),
        );
      }
    }

    await ActivitiesService.deleteByCompanyId(id);
    await DocService.deleteByCompanyId(id);
    await HistoryService.deleteByCompanyId(id);
    await JobsService.deleteByCompanyId(id);
    await NotificationService.deleteByCompanyId(id);
    await UsersService.deleteByCompanyId(id);

    // send request to delete index on pinecone
    await deletePineconeIndex(
      new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      }),
      company.index,
    );

    return true;
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
  ): Promise<number | null> {
    const company = await CompanyRepository.incrementJobCountByCompanyId(
      companyId,
    );
    return company?.jobCount || null;
  }

  static async decrementJobCountByCompanyId(
    companyId: string,
  ): Promise<CompanyModel | null> {
    return CompanyRepository.decrementJobCountByCompanyId(companyId);
  }

  static async getIndexByCompanyId(companyId: string): Promise<string | null> {
    const company = await CompanyRepository.selectById(new ObjectId(companyId));
    return company?.index || null;
  }
}

export default CompanyService;
