import DocRepository, { DocModel } from '@/repos/DocRepository';
import { ObjectId } from 'mongodb';
import { FOLDER, FILE } from '@/lib/constants';
import { Doc } from '@/types';

// Define a type for the data structure holding the file system docs (i.e. files/folders)
type FileSystemData = {
  [key: string]: Doc;
};

class DocService {
  static async create({
    name,
    companyId,
    parentId,
    type,
    parentPath,
  }: {
    name: string;
    companyId: string;
    parentId: string;
    type: typeof FILE | typeof FOLDER;
    parentPath: string;
  }): Promise<DocModel | null> {
    const newDoc: Doc = {
      url:
        type === FILE
          ? `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${name}`
          : '',
      companyId: new ObjectId(companyId),
      path: '',
      parentId: new ObjectId(parentId),
      name,
      parentPath,
      type,
      childrenIds: [],
    };

    // todo: convert getNumDuplicates to use model
    const docs = await DocRepository.getAllByCompanyId(companyId);
    const fsDate = DocService.convertDocModelsToFileSystemData(docs);
    let numDuplicates = DocService.getNumDuplicates(fsDate, newDoc);

    // If duplicates are found, modify the name to avoid conflict
    if (numDuplicates > 0) {
      if (newDoc.type === FILE) {
        let temp = newDoc.name.split('.');

        if (temp.length > 1) {
          temp[temp.length - 2] = `${temp[temp.length - 2]}_${numDuplicates}`; // Adding count to filename
          newDoc.name = temp.join('.'); // Rejoining the name with modified part
        } else {
          newDoc.name = `${newDoc.name}_${numDuplicates}`; // Modifying name for files without extension
        }
      } else {
        newDoc.name = `${newDoc.name}_${numDuplicates}`; // Modifying name for folders
      }
    }

    // Setting the path for the new entry
    newDoc.path =
      newDoc.parentPath === '/'
        ? `${newDoc.parentPath}${newDoc.name}`
        : `${newDoc.parentPath}/${newDoc.name}`;

    const doc = await DocRepository.create(newDoc);
    if (!doc) return null;

    // Update parent childrenIds
    await DocRepository.updateParentChildrenIds(
      newDoc.parentId as ObjectId,
      doc._id,
    );

    return doc;
  }

  static async getAllByCompanyId(companyId: string): Promise<DocModel[]> {
    return DocRepository.getAllByCompanyId(companyId);
  }

  // Function to generate a tree structure from a list of entries
  static generateTreeFromList(docs: DocModel[]): Doc[] {
    const fsData = DocService.convertDocModelsToFileSystemData(docs);
    let fsDataCopy = DocService.cloneObj(fsData); // Creating a deep copy of the list

    // Initialize children array for each document
    Object.keys(fsDataCopy).forEach((key) => {
      fsDataCopy[key].children = [];
    });

    // Build the tree by populating the children arrays
    Object.keys(fsDataCopy).forEach((key) => {
      const doc = fsDataCopy[key];
      if (doc.parentId) {
        fsDataCopy[doc.parentId].children.push(doc);
      }
    });

    // Filter out the root nodes to return
    const root = Object.values(fsDataCopy).filter(
      (doc) => !(doc as Doc).parentId,
    );
    return root as Doc[];
  }

  private static convertDocModelsToFileSystemData(
    docModels: DocModel[],
  ): FileSystemData {
    const fileSystemData: FileSystemData = {};

    docModels.forEach((doc) => {
      const docId = doc._id.toString(); // Ensure this conversion is effective
      fileSystemData[docId] = {
        ...doc,
        _id: doc._id.toString(), // Explicitly convert _id to string
        companyId: doc.companyId.toString(), // Convert companyId to string
        parentId: doc.parentId?.toString(), // Already converting
        childrenIds: doc.childrenIds?.map((id) => id.toString()), // Already converting
      };
    });

    return fileSystemData;
  }

  // Function to search for entries with the same name and type under a specific parent
  private static getNumDuplicates(fsData: FileSystemData, doc: Doc): number {
    let numDuplicates = 0;
    if (
      !fsData[doc.parentId as string] ||
      fsData[doc.parentId as string].childrenIds?.length === 0
    ) {
      return numDuplicates;
    }

    // Iterate over childrenIds of the parent entry to find duplicates
    fsData[doc.parentId as string].childrenIds.forEach((elementId) => {
      if (
        fsData[elementId].name.includes(doc.name) &&
        fsData[elementId].type === doc.type
      ) {
        numDuplicates++;
      }
    });

    return numDuplicates;
  }

  // Function to delete an entry (file or folder)
  private static deleteDoc(
    fsData: FileSystemData,
    entryID: string,
  ): FileSystemData {
    const doc = fsData[entryID];

    // If the doc is a folder, recursively delete its childrenIds
    if (doc.type === FOLDER) {
      doc.childrenIds?.forEach((id) => {
        DocService.deleteDoc(fsData, id);
      });
    }

    // Removing the doc from its parent's childrenIds array
    let parentId = fsData[entryID].parentId;
    let index = fsData[parentId as string].childrenIds?.indexOf(entryID);

    if (index !== -1 && index !== undefined) {
      fsData[parentId as string].childrenIds?.splice(index, 1);
    }

    delete fsData[entryID];
    localStorage.setItem('fileSystem', JSON.stringify(fsData));

    return { ...fsData };
  }

  // Utility function for deep cloning objects or arrays
  private static cloneObj(obj: any): any {
    if (Object(obj) !== obj) {
      return obj;
    } else if (Array.isArray(obj)) {
      return obj.map(DocService.cloneObj); // Clone arrays
    }

    // Clone objects
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, DocService.cloneObj(v)]),
    );
  }

  // Function to display entries of a specific path
  private static showPathEntries(
    parentPath: string,
    fileSystem: FileSystemData,
  ): Doc[] | undefined {
    // Returning childrenIds of the entry identified by parentPath and FOLDER type
    // return fileSystem[md5(parentPath + FOLDER)]
    //   ? fileSystem[md5(parentPath + FOLDER)].childrenIds?.map(
    //       (childrenIdsID) => fileSystem[childrenIdsID],
    //     )
    //   : [];
    return [];
  }

  // Function to compare two entries for equality
  private static entriesAreSame(x: Doc, y: Doc): boolean {
    for (var p in x) {
      // Check property existence in both objects
      if (x.hasOwnProperty(p) !== y.hasOwnProperty(p)) {
        return false;
      }

      if (x[p] === null && y[p] !== null) {
        return false;
      }

      if (x[p] === null && y[p] !== null) {
        return false;
      }

      // Recursively compare objects
      if (typeof x[p] === 'object') {
        if (!DocService.entriesAreSame(x[p], y[p])) {
          return false;
        }
      } else if (x[p] != y[p]) {
        return false; // Direct comparison for non-objects
      }
    }

    return true;
  }
}

export default DocService;
