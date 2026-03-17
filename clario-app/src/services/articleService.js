import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from './firebase';

/**
 * Uploads a manuscript file to Firebase Storage and saves its metadata to Firestore.
 * @param {File} file - The PDF/DOCX file object.
 * @param {Object} metadata - { title, authorId, authorName, authorEmail, targetJournal, researchField }
 * @param {Function} onProgress - Callback for upload progress.
 */
export const uploadArticleWithFile = async (file, metadata, onProgress) => {
  if (!file) throw new Error("No file provided");

  // 1. Create unique storage path
  const fileExtension = file.name.split('.').pop();
  const storagePath = `manuscripts/${metadata.authorId}/${Date.now()}_${metadata.title.replace(/\s+/g, '_').toLowerCase()}.${fileExtension}`;
  const storageRef = ref(storage, storagePath);

  // 2. Start Upload
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      async () => {
        // 3. Upload Complete - Get URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // 4. Save to Firestore
        try {
          const docRef = await addDoc(collection(db, 'articles'), {
            ...metadata,
            fileUrl: downloadURL,
            storagePath: storagePath,
            status: 'pending', // pending, screening, assigned, reviewed, qa-review, published, rejected
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            // Initial AI Screening placeholders
            aiScreeningStatus: 'waiting', 
            aiScore: null,
            assignments: [] // List of reviewer IDs
          });
          resolve({ id: docRef.id, ...metadata, fileUrl: downloadURL });
        } catch (dbError) {
          console.error("Error saving metadata:", dbError);
          reject(dbError);
        }
      }
    );
  });
};

/**
 * Fetches all articles submitted by a specific author.
 */
export const getArticlesByAuthor = async (authorId) => {
  const q = query(collection(db, 'articles'), where('authorId', '==', authorId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetches a single article by ID.
 */
export const getArticleById = async (articleId) => {
  const docRef = doc(db, 'articles', articleId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Article not found");
  }
};

/**
 * Fetches all articles assigned to a specific reviewer.
 */
export const getAssignedArticles = async (reviewerId) => {
  const q = query(collection(db, 'articles'), where('assignments', 'array-contains', reviewerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Submits a review for an article.
 * @param {string} articleId - The ID of the article.
 * @param {string} reviewerId - The ID of the reviewer.
 * @param {Object} reviewData - { scores, comments, overallRecommendation }
 */
export const submitReview = async (articleId, reviewerId, reviewData) => {
  const articleRef = doc(db, 'articles', articleId);
  const reviewRef = collection(articleRef, 'reviews');
  
  // 1. Add review document
  await addDoc(reviewRef, {
    reviewerId,
    ...reviewData,
    createdAt: serverTimestamp()
  });

  // 2. Update article status if needed (e.g., mark as reviewed)
  await updateDoc(articleRef, {
    status: 'reviewed', 
    updatedAt: serverTimestamp(),
    reviewProgress: 100 // Mark as fully reviewed
  });
};

/**
 * Fetches articles that have been reviewed and are ready for QA.
 */
export const getArticlesForQA = async () => {
  const q = query(collection(db, 'articles'), where('status', '==', 'reviewed'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Simulates AI screening process.
 */
export const simulateAiScreening = async (articleId) => {
  const articleRef = doc(db, 'articles', articleId);
  
  // 1. Start Screening
  await updateDoc(articleRef, {
    aiScreeningStatus: 'processing',
    aiProgress: 10,
    status: 'screening',
    updatedAt: serverTimestamp()
  });

  // 2. Simulate incremental progress
  const progressSteps = [30, 60, 90];
  for (const step of progressSteps) {
    await new Promise(resolve => setTimeout(resolve, 800));
    await updateDoc(articleRef, { aiProgress: step });
  }

  // 3. Update with final results
  const randomScore = Math.floor(Math.random() * 41) + 55; // 55-96
  await updateDoc(articleRef, {
    aiScreeningStatus: 'completed',
    aiScore: randomScore,
    aiProgress: 100,
    status: 'pending', // Back to pending (to be assigned)
    updatedAt: serverTimestamp()
  });

  return randomScore;
};

/**
 * Submits a revised version of an article.
 */
export const submitRevision = async (articleId, file, metadata, onProgress) => {
  if (!file) throw new Error("No file provided for revision");

  // 1. Create unique storage path for version
  const fileExtension = file.name.split('.').pop();
  const versionId = Date.now();
  const storagePath = `manuscripts/${metadata.authorId}/v_${versionId}_${metadata.title.replace(/\s+/g, '_').toLowerCase()}.${fileExtension}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const articleRef = doc(db, 'articles', articleId);
        const articleSnap = await getDoc(articleRef);
        
        if (!articleSnap.exists()) {
          reject(new Error("Article not found"));
          return;
        }

        const currentData = articleSnap.data();
        const nextVersion = (currentData.version || 1) + 1;

        try {
          // 2. Add to revisions sub-collection
          const revisionsRef = collection(articleRef, 'revisions');
          await addDoc(revisionsRef, {
            version: nextVersion,
            fileUrl: downloadURL,
            storagePath: storagePath,
            submittedAt: serverTimestamp(),
            revisionNotes: metadata.revisionNotes || ''
          });

          // 3. Update main article document
          await updateDoc(articleRef, {
            fileUrl: downloadURL,
            storagePath: storagePath,
            version: nextVersion,
            status: 'pending', // Reset to pending for re-screening or re-assignment
            updatedAt: serverTimestamp(),
            aiScreeningStatus: 'waiting' // Trigger new AI screening
          });

          resolve({ id: articleId, version: nextVersion, fileUrl: downloadURL });
        } catch (dbError) {
          reject(dbError);
        }
      }
    );
  });
};

/**
 * Fetches all versions/revisions of an article.
 */
export const getArticleRevisions = async (articleId) => {
  const revisionsRef = collection(db, 'articles', articleId, 'revisions');
  const querySnapshot = await getDocs(revisionsRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetches all articles from Firestore (Admin only).
 */
export const getAllArticles = async () => {
  const querySnapshot = await getDocs(collection(db, 'articles'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
