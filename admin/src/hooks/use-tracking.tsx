import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { db } from "@/lib/config";
import {
  collection,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export type FarmCenterCoordinates = {
  latitude: number;
  longitude: number;
};

export type VirtualBoundary = {
  farmId: string;
  farmRadius: number;
  farmCenterCoordinates: FarmCenterCoordinates;
  collarIds: string[];
};

export type SensorFeed = {
  longitude: number;
  latitude: number;
  collarId: string;
  createdAt?: string;
  animalBehaviour?: string;
  collarStatus?: string;
  [key: string]: any;
};

type TrackingContextType = {
  boundaries: VirtualBoundary[];
  feeds: SensorFeed[];
  fetchBoundaries: () => Promise<void>;
  fetchFeeds: () => Promise<void>;
  fetchAllFeeds: () => Promise<SensorFeed[]>;
  loading: boolean;
};

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const [boundaries, setBoundaries] = useState<VirtualBoundary[]>([]);
  const [feeds, setFeeds] = useState<SensorFeed[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all virtual boundaries (farms)
  const fetchBoundaries = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "farms"));
      const farms: VirtualBoundary[] = [];
      querySnapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
        const data = docSnap.data();
        if (data.farmId && data.farmCenterCoordinates && data.farmRadius) {
          farms.push({
            farmId: data.farmId,
            farmRadius: data.farmRadius,
            farmCenterCoordinates: data.farmCenterCoordinates,
            collarIds: data.collarIds || [],
          });
        }
      });
      setBoundaries(farms);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all sensor feeds (from ThingSpeak API, similar to mobile)
  const fetchFeeds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.thingspeak.com/channels/2989762/feeds.json?api_key=B0CPJXS5KOZBZOB2"
      );
      const data = await res.json();
      if (data.feeds && Array.isArray(data.feeds)) {
        const latestFeeds: Record<string, { feed: any; created_at: string }> = {};
        data.feeds.forEach((feed: any) => {
          const collarId = feed.field2;
          const createdAt = feed.created_at;
          if (!collarId || !feed.field1) return;
          if (!latestFeeds[collarId] || new Date(createdAt) > new Date(latestFeeds[collarId].created_at)) {
            latestFeeds[collarId] = { feed, created_at: createdAt };
          }
        });

        const feedsArr: SensorFeed[] = Object.values(latestFeeds)
          .map(({ feed }) => {
            const [longitude, latitude] = feed.field1.split(",").map(Number);
            return {
              longitude,
              latitude,
              collarId: feed.field2,
              createdAt: feed.created_at,
              animalBehaviour: feed.field4,   // Add animalBehaviour
              collarStatus: feed.field5,      // Add collarStatus
            };
          });

        setFeeds(feedsArr);
      }
    } catch (e) {
      console.error("Error fetching sensors feeds:", e);
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllFeeds = useCallback(async (): Promise<SensorFeed[]> => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.thingspeak.com/channels/2989762/feeds.json?api_key=B0CPJXS5KOZBZOB2"
      );
      const data = await res.json();
      if (data.feeds && Array.isArray(data.feeds)) {
        return data.feeds
          .filter((feed: any) => feed.field2 && feed.field1)
          .map((feed: any) => {
            const [longitude, latitude] = feed.field1.split(",").map(Number);
            return {
              longitude,
              latitude,
              collarId: feed.field2,
              createdAt: feed.created_at,
              animalBehaviour: feed.field4,
              collarStatus: feed.field5,
            };
          });
      }
      return [];
    } catch (e) {
      console.error("Error fetching all sensor feeds:", e);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoundaries();
    fetchFeeds();
    const interval = setInterval(fetchFeeds, 16000);
    return () => clearInterval(interval);
  }, [fetchBoundaries, fetchFeeds]);

  return (
    <TrackingContext.Provider
      value={{
        boundaries,
        feeds,
        fetchBoundaries,
        fetchFeeds,
        fetchAllFeeds,
        loading,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error("useTracking must be used within a TrackingProvider");
  }
  return context;
};