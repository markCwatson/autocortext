import md5 from 'md5';
import { FOLDER, FILE } from '@/lib/constants';

// Define a type for entry which can be a file or a folder
interface Entry {
  parentID: string;
  name: string;
  type: typeof FILE | typeof FOLDER;
  path?: string;
  parentPath?: string;
  children?: string[];
  // Index signature
  [key: string]: any;
}

// Define a type for the data structure holding the file system entries
type FileSystemData = {
  [key: string]: Entry;
};

// Function to search for entries with the same name and type under a specific parent
const getNumDuplicates = (arr: FileSystemData, entry: Entry): number => {
  let numDuplicates = 0;

  // Iterate over children of the parent entry to find duplicates
  arr[entry.parentID].children?.forEach((elementId) => {
    if (
      arr[elementId].name.includes(entry.name) &&
      arr[elementId].type === entry.type
    ) {
      numDuplicates++;
    }
  });

  return numDuplicates;
};

// Function to add a new file or folder entry
export const addEntry = (
  data: FileSystemData,
  newEntry: Entry,
): FileSystemData => {
  let numDuplicates = getNumDuplicates(data, newEntry);

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
    newEntry.children = [];
  }

  // Generating a unique ID for the entry using md5 hash
  const id = md5(newEntry.path + newEntry.type);
  data[id] = newEntry; // Adding the entry to the data structure
  data[newEntry.parentID].children?.push(id); // Updating the parent's children array
  localStorage.setItem('fileSystem', JSON.stringify(data)); // Persisting the updated data to local storage

  return { ...data };
};

// Function to delete an entry (file or folder)
export const deleteEntry = (
  data: FileSystemData,
  entryID: string,
): FileSystemData => {
  const entry = data[entryID];

  // If the entry is a folder, recursively delete its children
  if (entry.type === FOLDER) {
    entry.children?.forEach((id) => {
      deleteEntry(data, id);
    });
  }

  // Removing the entry from its parent's children array
  let parentID = data[entryID].parentID;
  let index = data[parentID].children?.indexOf(entryID);

  if (index !== -1 && index !== undefined) {
    data[parentID].children?.splice(index, 1);
  }

  delete data[entryID];
  localStorage.setItem('fileSystem', JSON.stringify(data));

  return { ...data };
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
export const generateTreeFromList = (_list: FileSystemData): Entry[] => {
  const root: Entry[] = []; // Array to hold root entries
  let list = cloneObj(_list); // Creating a deep copy of the list

  Object.keys(list).forEach((nodeID) => {
    if (!list[nodeID].parentID) {
      return root.push(list[nodeID]); // Adding root entries
    }

    let parentID = list[nodeID].parentID;

    if (list[parentID]) {
      let index = list[parentID].children?.indexOf(nodeID);

      if (index !== -1) {
        list[parentID].children?.splice(index, 1);
      }

      if (list[nodeID].type === FOLDER) {
        list[parentID].children?.push(list[nodeID]); // Reordering children for folders
      }
    }
  });

  return root; // Returning the root array representing the tree structure
};

// Function to display entries of a specific path
export const showPathEntries = (
  parentPath: string,
  fileSystem: FileSystemData,
): Entry[] | undefined => {
  // Returning children of the entry identified by parentPath and FOLDER type
  return fileSystem[md5(parentPath + FOLDER)]
    ? fileSystem[md5(parentPath + FOLDER)].children?.map(
        (childrenID) => fileSystem[childrenID],
      )
    : [];
};

// Function to compare two entries for equality
export const entriesAreSame = (x: Entry, y: Entry): boolean => {
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
