import DocRepository, { DocModel } from '@/repos/DocRepository';
import { ObjectId } from 'mongodb';

class DocService {
  static async createFile(
    name: string,
    companyId: string,
  ): Promise<DocModel | null> {
    const url = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${name}`;

    return DocRepository.createFile({
      url,
      companyId: new ObjectId(companyId),
      path: '/machines', // todo: use real path
      parentId: new ObjectId('000000000000000000000000'), // todo: use real parent id
      name,
      parentPath: '/', // todo: use real parent path
    });
  }

  static async createFolder({
    name,
    parentId,
    parentPath,
    companyId,
    path,
  }: {
    name: string;
    parentId: string;
    parentPath: string;
    companyId: string;
    path: string;
  }): Promise<DocModel | null> {
    return DocRepository.createFolder({
      name,
      parentId: new ObjectId(parentId),
      parentPath,
      companyId: new ObjectId(companyId),
      path,
      url: '',
    });
  }

  static async getAllByCompanyId(companyId: string): Promise<DocModel[]> {
    return DocRepository.getAllByCompanyId(companyId);
  }
}

export default DocService;
