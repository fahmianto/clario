import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Creates a new notification for a specific user.
 * @param {string} userId - ID of the user receiving the notification.
 * @param {Object} data - { title, message, type, link, metadata }
 */
export const createNotification = async (userId, data) => {
  try {
    const notificationRef = collection(db, 'users', userId, 'notifications');
    await addDoc(notificationRef, {
      ...data,
      isRead: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

/**
 * Real-time listener for user notifications.
 */
export const subscribeToNotifications = (userId, onUpdate) => {
  const q = query(
    collection(db, 'users', userId, 'notifications'),
    orderBy('createdAt', 'desc'),
    where('createdAt', '!=', null) // Firestore index helper
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    onUpdate(notifications);
  });
};

/**
 * Marks a single notification as read.
 */
export const markAsRead = async (userId, notificationId) => {
  try {
    const notifRef = doc(db, 'users', userId, 'notifications', notificationId);
    await updateDoc(notifRef, { isRead: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

/**
 * Marks all notifications for a user as read.
 */
export const markAllAsRead = async (userId, currentNotifications) => {
  try {
    const unread = currentNotifications.filter(n => !n.isRead);
    const promises = unread.map(n => markAsRead(userId, n.id));
    await Promise.all(promises);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};
