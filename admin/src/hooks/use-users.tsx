import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "../lib/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { AdminUserType } from "./use-auth";

type UserNoNull = Exclude<AdminUserType, null>;

type UsersContextType = {
  users: UserNoNull[];
  loading: boolean;
  addUser: (user: Omit<UserNoNull, "uid"> & { password: string }) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  updateUser: (uid: string, updates: Partial<UserNoNull>) => Promise<void>;
  fetchUsers: () => Promise<void>;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserNoNull[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to convert Firestore doc to AdminUserType (non-null)
  const docToUser = (docSnap: QueryDocumentSnapshot<DocumentData>): UserNoNull => ({
    ...(docSnap.data() as Omit<UserNoNull, "uid">),
    uid: docSnap.id,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList: UserNoNull[] = [];
      querySnapshot.forEach((docSnap) => {
        usersList.push(docToUser(docSnap));
      });
      setUsers(usersList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (user: Omit<UserNoNull, "uid"> & { password: string }) => {
    // You may want to use Firebase Auth for real user creation, this only adds to Firestore
    setLoading(true);
    try {
      const { password, ...userData } = user;
      await addDoc(collection(db, "users"), userData);
      await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (uid: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", uid));
      setUsers((prev) => prev.filter((u) => u && u.uid !== uid));
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (uid: string, updates: Partial<UserNoNull>) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", uid), updates);
      await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  return (
    <UsersContext.Provider value={{ users, loading, addUser, deleteUser, updateUser, fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) throw new Error("useUsers must be used within a UsersProvider");
  return context;
};