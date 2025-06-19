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
import { doc, setDoc, getDoc } from "firebase/firestore";

export type UserType = {
    uid: string;
    email: string;
    fullName: string;
    phoneNumber: string;
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

    const logout = async () => {
        setLoading(true);
        setError(null);

        await signOut(auth);
        setUser(null);
        setLoading(false);

        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ register, login, forgotPassword, logout, loading, initialLoading, error, user }}>
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