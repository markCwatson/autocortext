import DocRepository, { DocModel } from '@/repos/DocRepository';
import { ObjectId } from 'mongodb';

class DocService {
  static async create(
    name: string,
    companyId: string,
  ): Promise<DocModel | null> {
    const url = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${name}`;

    return DocRepository.create({
      url,
      companyId: new ObjectId(companyId),
      path: '/machines', // todo: use real path
    });
  }

  static async getAllByCompanyId(companyId: string): Promise<DocModel[]> {
    return DocRepository.getAllByCompanyId(companyId);
  }
}

export default DocService;
