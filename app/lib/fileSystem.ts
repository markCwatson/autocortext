// import md5 from 'md5';
import { FOLDER, FILE } from '@/lib/constants';

// Define a type for doc which can be a file or a folder
interface Doc {
  companyId: string;
  parentId: string;
  name: string;
  type: typeof FILE | typeof FOLDER;
  path?: string;
  url?: string;
  parentPath?: string;
  childrenIds?: string[];
  // Index signature
  [key: string]: any;
}

// Define a type for the data structure holding the file system docs (i.e. files/folders)
type FileSystemData = {
  [key: string]: Doc;
};

// Function to search for entries with the same name and type under a specific parent
const getNumDuplicates = (fsData: FileSystemData, doc: Doc): number => {
  let numDuplicates = 0;

  // Iterate over childrenIds of the parent entry to find duplicates
  fsData[doc.parentId].childrenIds?.forEach((elementId) => {
    if (
      fsData[elementId].name.includes(doc.name) &&
      fsData[elementId].type === doc.type
    ) {
      numDuplicates++;
    }
  });

  return numDuplicates;
};

// Function to add a new file or folder entry
export const addDoc = (
  fsData: FileSystemData,
  newEntry: Doc,
): FileSystemData => {
  let numDuplicates = getNumDuplicates(fsData, newEntry);

  // If duplicates are found, modify the name to avoid conflict
  if (numDuplicates > 0) {
    if (newEntry.type === FILE) {
      let temp = newEntry.name.split('.');

      if (temp.length > 1) {
        temp[temp.length - 2] = `${temp[temp.length - 2]}_${numDuplicates}`; // Adding count to filename
        newEntry.name = temp.join('.'); // Rejoining the name with modified part
      } else {
        newEntry.name = `${newEntry.name}_${numDuplicates}`; // Modifying name for files without extension
      }
    } else {
      newEntry.name = `${newEntry.name}_${numDuplicates}`; // Modifying name for folders
    }
  }

  // Setting the path for the new entry
  newEntry.path =
    newEntry.parentPath === '/'
      ? `${newEntry.parentPath}${newEntry.name}`
      : `${newEntry.parentPath}/${newEntry.name}`;

  if (newEntry.type === FOLDER) {
    newEntry.childrenIds = [];
  }

  // Generating a unique ID for the entry using md5 hash
  // const id = md5(newEntry.path + newEntry.type);
  // fsData[id] = newEntry; // Adding the entry to the data structure
  // fsData[newEntry.parentId].childrenIds?.push(id); // Updating the parent's childrenIds array
  // localStorage.setItem('fileSystem', JSON.stringify(fsData)); // Persisting the updated data to local storage

  return { ...fsData };
};

// Function to delete an entry (file or folder)
export const deleteDoc = (
  fsData: FileSystemData,
  entryID: string,
): FileSystemData => {
  const doc = fsData[entryID];

  // If the doc is a folder, recursively delete its childrenIds
  if (doc.type === FOLDER) {
    doc.childrenIds?.forEach((id) => {
      deleteDoc(fsData, id);
    });
  }

  // Removing the doc from its parent's childrenIds array
  let parentId = fsData[entryID].parentId;
  let index = fsData[parentId].childrenIds?.indexOf(entryID);

  if (index !== -1 && index !== undefined) {
    fsData[parentId].childrenIds?.splice(index, 1);
  }

  delete fsData[entryID];
  localStorage.setItem('fileSystem', JSON.stringify(fsData));

  return { ...fsData };
};

// Utility function for deep cloning objects or arrays
const cloneObj = (obj: any): any => {
  if (Object(obj) !== obj) {
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(cloneObj); // Clone arrays
  }

  // Clone objects
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, cloneObj(v)]),
  );
};

// Function to generate a tree structure from a list of entries
export const generateTreeFromList = (_list: FileSystemData): Doc[] => {
  const root: Doc[] = []; // Array to hold root entries
  let list = cloneObj(_list); // Creating a deep copy of the list

  Object.keys(list).forEach((nodeID) => {
    if (!list[nodeID].parentId) {
      return root.push(list[nodeID]); // Adding root entries
    }

    let parentId = list[nodeID].parentId;

    if (list[parentId]) {
      let index = list[parentId].childrenIds?.indexOf(nodeID);

      if (index !== -1) {
        list[parentId].childrenIds?.splice(index, 1);
      }

      if (list[nodeID].type === FOLDER) {
        list[parentId].childrenIds?.push(list[nodeID]); // Reordering childrenIds for folders
      }
    }
  });

  return root; // Returning the root array representing the tree structure
};

// Function to display entries of a specific path
export const showPathEntries = (
  parentPath: string,
  fileSystem: FileSystemData,
): Doc[] | undefined => {
  // Returning childrenIds of the entry identified by parentPath and FOLDER type
  // return fileSystem[md5(parentPath + FOLDER)]
  //   ? fileSystem[md5(parentPath + FOLDER)].childrenIds?.map(
  //       (childrenIdsID) => fileSystem[childrenIdsID],
  //     )
  //   : [];
  return [];
};

// Function to compare two entries for equality
export const entriesAreSame = (x: Doc, y: Doc): boolean => {
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
      if (!entriesAreSame(x[p], y[p])) {
        return false;
      }
    } else if (x[p] != y[p]) {
      return false; // Direct comparison for non-objects
    }
  }

  return true;
};
