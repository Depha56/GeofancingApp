import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    updateProfile,
    UserCredential,
    onAuthStateChanged
} from "firebase/auth";
import { useRouter } from "expo-router";
import { auth, db } from "../config";
import { doc, setDoc } from "firebase/firestore";

type AuthContextType = {
    register: (
        email: string,
        password: string,
        fullName?: string,
        phoneNumber?: string
    ) => Promise<UserCredential>;
    login: (email: string, password: string) => Promise<UserCredential>;
    forgotPassword: (email: string) => Promise<void>;
    loading: boolean;
    error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push("/(tabs)");
            }
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
                await setDoc(doc(db, "users", uid), {
                    uid,
                    email,
                    fullName: fullName || "",
                    phoneNumber: phoneNumber || "",
                    createdAt: new Date().toISOString(),
                });
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

    return (
        <AuthContext.Provider value={{ register, login, forgotPassword, loading, error }}>
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