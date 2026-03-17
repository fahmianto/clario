import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); // To store role and extra info
  const [loading, setLoading] = useState(true);

  // Sign up and create user document in Firestore
  const signup = async (email, password, fullName, role, institution) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save additional data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      fullName,
      email,
      role, // 'author', 'reviewer', 'qa', 'admin'
      institution,
      status: 'Active',
      createdAt: new Date()
    });
    
    return userCredential;
  };

  // Log in
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch user data right after login to know where to redirect them
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data); // update state proactively
        return { user, role: data.role };
      }
    } catch (error) {
      console.error("Error fetching user role during login:", error);
    }
    
    return { user, role: 'author' }; // fallback
  };

  // Log out
  const logout = () => {
    return signOut(auth);
  };

  // Listen to Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user data from Firestore to get their role
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <Loader2 size={40} className="animate-spin text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800">Initializing Clario</h2>
          <p className="text-slate-500 mt-2">Connecting to secure services...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};
