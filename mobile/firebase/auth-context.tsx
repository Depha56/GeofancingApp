import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    updateProfile,
    signOut,
    UserCredential,
    onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "expo-router";
import { auth, db } from "./config";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from './tracking-context';
import { useTracking } from './tracking-context';

export type UserType = {
    uid: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    farmId?: string;
    address?: string;
    role?: string;
    photoURL?: string;
    createdAt: string;
} | null;

type AuthContextType = {
    register: (
        email: string,
        password: string,
        fullName?: string,
        phoneNumber?: string
    ) => Promise<UserCredential>;
    login: (email: string, password: string) => Promise<UserCredential>;
    forgotPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<UserType>) => Promise<void>;
    loading: boolean;
    initialLoading: boolean;
    error: string | null;
    user: UserType;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserType>(null);
    const router = useRouter();
    const { fetchFarmData } = useTracking();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch user info from Firestore
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data() as UserType);
                } else {
                    setUser(null);
                }
                router.push("/(tabs)");
            } else {
                setUser(null);
            }
            setInitialLoading(false);
        });
        return unsubscribe;
    }, [router]);

    function errorHandler(error: any) {
        if (error?.code) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('Email is already in use.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak.');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid email or password.');
                    break;
                default:
                    setError(error.message || 'An unknown error occurred.');
            }
        } else {
            setError(error?.message || 'An unknown error occurred.');
        }
    }

    const register = async (
        email: string,
        password: string,
        fullName?: string,
        phoneNumber?: string
    ) => {
        setLoading(true);
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            if (auth.currentUser && fullName) {
                await updateProfile(auth.currentUser, {
                    displayName: fullName,
                });
            }

            if (userCredential.user) {
                const { uid } = userCredential.user;
                const userData = {
                    uid,
                    email,
                    fullName: fullName || "",
                    phoneNumber: phoneNumber || "",
                    createdAt: new Date().toISOString(),
                };
                await setDoc(doc(db, "users", uid), userData);
                setUser(userData);
            }

            return userCredential;
        } catch (err: any) {
            errorHandler(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Fetch user info from Firestore
            const { uid } = userCredential.user;
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                // Fetch farm data if farmId exists
                if (userDoc.data()?.farmId) fetchFarmData(userDoc.data().farmId);
                setUser(userDoc.data() as UserType);
            } else {
                setUser(null);
            }
            return userCredential;
        } catch (err: any) {
            errorHandler(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err: any) {
            errorHandler(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update user information in Firestore and state
    const updateUser = async (updates: Partial<UserType>) => {
        if (!user?.uid || !updates) return;
        setLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, updates as { [x: string]: any });
            // Fetch updated user info
            const updatedDoc = await getDoc(userRef);
            if (updatedDoc.exists()) {
                setUser(updatedDoc.data() as UserType);
            }
        } catch (err: any) {
            errorHandler(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout: clear AsyncStorage
    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            await AsyncStorage.removeItem(STORAGE_KEY); // Clear farm data
            setUser(null);
            router.push("/login");
        } catch (err: any) {
            setError(err.message || "Logout failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ register, login, forgotPassword, logout, updateUser, loading, initialLoading, error, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

/**
 * Fetch all users with a particular farmId from Firestore.
 * @param farmId The farmId to filter users by.
 * @returns Array of UserType
 */
export const fetchUsersByFarmId = async (farmId: string): Promise<UserType[]> => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("farmId", "==", farmId));
    const querySnapshot = await getDocs(q);
    const users: UserType[] = [];
    querySnapshot.forEach((docSnap) => {
        users.push(docSnap.data() as UserType);
    });
    return users;
};