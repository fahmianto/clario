import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Fetches all registered users from Firestore.
 */
export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Updates a user's role.
 */
export const updateUserRole = async (userId, newRole) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    role: newRole,
    updatedAt: serverTimestamp()
  });
};

/**
 * Updates user account status (active/suspended).
 */
export const updateUserStatus = async (userId, isActive) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    isActive,
    updatedAt: serverTimestamp()
  });
};
