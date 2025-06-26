import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { db } from "@/lib/config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

// Notification type based on how they're inserted in functions.ts
export type Notification = {
  acknowledged?: any;
  id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  animalId: string;
  read: boolean;
  timestamp: string;
};

type NotificationsContextType = {
  notifications: Notification[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const notifs: Notification[] = querySnapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          type: data.type,
          priority: data.priority,
          title: data.title,
          message: data.message,
          animalId: data.animalId,
          read: data.read ?? false,
          timestamp: data.timestamp,
        };
      });
      setNotifications(notifs);
    } catch (e) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};