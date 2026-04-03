import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, signOut as secondarySignOut } from 'firebase/auth';
import { auth, db, firebaseConfig } from '@config/firebase';
import { User, UserRole } from '@appTypes/index';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  createEmployee: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
          } else {
            // No Firestore doc exists (e.g. rules blocked the write during signup).
            // Create a default admin doc so the owner can access the app.
            const fallback: Omit<User, 'id'> = {
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              role: UserRole.ADMIN,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            try { await setDoc(userDocRef, fallback); } catch { /* rules not yet deployed */ }
            setUser({ id: firebaseUser.uid, ...fallback });
          }
        } catch (error) {
          // Firestore read failed (rules not deployed yet). Fall back to Firebase auth data.
          console.error('Error fetching user data:', error);
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: UserRole.ADMIN,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email,
        displayName,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Admin-only: create an employee account using a secondary Firebase app instance.
  // This avoids signing the admin out (no Cloud Functions needed).
  const createEmployee = async (email: string, password: string, displayName: string, role: UserRole) => {
    const secondaryApp = initializeApp(firebaseConfig, `employee-create-${Date.now()}`);
    const secondaryAuth = getAuth(secondaryApp);
    try {
      const { createUserWithEmailAndPassword: createUser } = await import('firebase/auth');
      const userCredential = await createUser(secondaryAuth, email, password);
      const newUid = userCredential.user.uid;

      const { setDoc: setDocFn, doc: docFn } = await import('firebase/firestore');
      await setDocFn(docFn(db, 'users', newUid), {
        email,
        displayName,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await secondarySignOut(secondaryAuth);
    } catch (error: any) {
      console.error('Create employee error:', error);
      const rethrown: any = new Error(error.message || 'Failed to create employee');
      rethrown.code = error.code || '';
      throw rethrown;
    } finally {
      await deleteApp(secondaryApp);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const permissions: Record<UserRole, string[]> = {
      [UserRole.ADMIN]: [
        'view_all_customers',
        'edit_all_customers',
        'delete_customers',
        'view_all_jobs',
        'edit_all_jobs',
        'view_employees',
        'edit_employees',
        'view_analytics',
        'send_group_sms',
        'manage_availability',
        'schedule_any_user',
      ],
      [UserRole.SALESPERSON]: [
        'view_customers',
        'add_customers',
        'edit_own_customers',
        'add_map_pins',
        'mark_dnc',
        'schedule_self',
        'schedule_admin',
        'schedule_technicians',
      ],
      [UserRole.TECHNICIAN]: [
        'view_own_jobs',
        'complete_jobs',
        'upload_photos',
        'add_customers',
        'schedule_follow_up',
      ],
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    createEmployee,
    signOut,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
