import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  limit, 
  orderBy 
} from 'firebase/firestore';

/**
 * Search for articles by title (prefix search)
 */
export const searchArticles = async (searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  try {
    const articlesRef = collection(db, 'articles');
    // Prefix search trick for Firestore
    const q = query(
      articlesRef,
      where('title', '>=', searchTerm),
      where('title', '<=', searchTerm + '\uf8ff'),
      limit(5)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'article'
    }));
  } catch (error) {
    console.error("Error searching articles:", error);
    return [];
  }
};

/**
 * Search for users by full name (prefix search)
 */
export const searchUsers = async (searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return [];

  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('fullName', '>=', searchTerm),
      where('fullName', '<=', searchTerm + '\uf8ff'),
      limit(5)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'user'
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};
