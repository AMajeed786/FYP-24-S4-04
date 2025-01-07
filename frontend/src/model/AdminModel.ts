import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';


export interface User {
  id: string;
  username: string;
  email: string;
  contact: string;
  password: string;
}

// Function to fetch users from Firestore
export const fetchUsers = async (): Promise<User[]> => {
  const db = getFirestore(getApp()); // Get Firestore instance
  const usersCollection = collection(db, 'users');
  const userSnapshot = await getDocs(usersCollection);
  const userList: User[] = userSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<User, 'id'>, // Exclude 'id' as Firestore uses it as doc ID
  }));
  return userList;
};

// Function to update a user's details in Firestore
export const updateUser = async (id: string, updatedUser: User) => {
  const db = getFirestore(getApp());
  const userRef = doc(db, 'users', id);
  const { id: userId, ...userData } = updatedUser; // Exclude 'id' as Firestore already uses it as the document ID
  await updateDoc(userRef, userData);
};

export const deleteUser = async (id: string): Promise<void> => {
  const db = getFirestore(getApp());
  const userRef = doc(db, 'users', id);
  await deleteDoc(userRef);
};
