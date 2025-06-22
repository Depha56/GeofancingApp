import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
    onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../lib/config";
import { doc, getDoc } from "firebase/firestore";

export type AdminUserType = {
        uid: string;
        email: string;
        fullName: string;
        phoneNumber: string;
        farmId?: string;
        address?: string;
        role?: string;
        status?: string;
        lastLogin?: string;
        permissions?: string[];
        notes?:string;
        photoURL?: string;
        createdAt: string;
} | null;

type AuthContextType = {
    user: AdminUserType;
    loading: boolean;
    login: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AdminUserType>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch user info from Firestore
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data() as AdminUserType);
                } else {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || "",
                        fullName: "",
                        phoneNumber: "",
                        createdAt: "",
                        role: "",
                        photoURL: "",
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Fetch user info from Firestore
            const { uid } = userCredential.user;
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const userData = userDoc.data() as AdminUserType;
                if (userData?.role !== "admin") {
                    await signOut(auth);
                    setUser(null);
                    throw new Error("Access denied: You need higher Permissions.");
                }
                setUser(userData);
            } else {
                setUser({
                    uid,
                    email,
                    fullName: "",
                    phoneNumber: "",
                    createdAt: "",
                    role: "",
                    photoURL: "",
                });
            }
            return userCredential;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
