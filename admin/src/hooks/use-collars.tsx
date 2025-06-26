import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { db } from "@/lib/config";
import { collection, setDoc, doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

// Fetches all feeds and extracts unique collar IDs
const fetchUniqueCollarIds = async (): Promise<string[]> => {
  try {
    const res = await fetch(
      "https://api.thingspeak.com/channels/2989762/feeds.json?api_key=B0CPJXS5KOZBZOB2"
    );
    const data = await res.json();
    if (data.feeds && Array.isArray(data.feeds)) {
      const collarIdSet = new Set<string>();
      data.feeds.forEach((feed: any) => {
        if (feed.field2) {
          collarIdSet.add(feed.field2);
        }
      });
      return Array.from(collarIdSet);
    }
    return [];
  } catch (e) {
    console.error("Error fetching unique collar IDs:", e);
    return [];
  }
};

// Save a collarId to Firestore (if not exists)
export async function saveCollarIdToFirestore(collarId: string) {
  const ref = doc(db, "collars", collarId);
  const docSnap = await getDoc(ref);
  if (!docSnap.exists()) {
    await setDoc(ref, { collarId, assignedFarmId: null });
  }
}

// Assign a collar to a farm (one-to-one)
export async function assignCollarToFarm(collarId: string, farmId: string) {
  // 1. Get the collar document
  const collarRef = doc(db, "collars", collarId);
  const collarSnap = await getDoc(collarRef);
  const prevFarmId = collarSnap.exists() ? collarSnap.data().assignedFarmId : null;

  // 2. Remove from previous farm if needed
  if (prevFarmId && prevFarmId !== farmId) {
    const prevFarmRef = doc(db, "farms", prevFarmId);
    await updateDoc(prevFarmRef, {
      collarIds: arrayRemove(collarId),
    });
  }

  // 3. Assign to new farm
  await setDoc(collarRef, { collarId, assignedFarmId: farmId }, { merge: true });

  // 4. Add to new farm's collarIds array
  const newFarmRef = doc(db, "farms", farmId);
  await updateDoc(newFarmRef, {
    collarIds: arrayUnion(collarId),
  });
}

type CollarsContextType = {
  collarIds: string[];
  loading: boolean;
  refreshCollarIds: () => Promise<void>;
  saveCollarIdToFirestore: (collarId: string) => Promise<void>;
  assignCollarToFarm: (collarId: string, farmId: string) => Promise<void>;
};

const CollarsContext = createContext<CollarsContextType | undefined>(undefined);

export const CollarsProvider = ({ children }: { children: ReactNode }) => {
  const [collarIds, setCollarIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCollarIds = useCallback(async () => {
    setLoading(true);
    const ids = await fetchUniqueCollarIds();
    setCollarIds(ids);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshCollarIds();
  }, [refreshCollarIds]);

  return (
    <CollarsContext.Provider
      value={{
        collarIds,
        loading,
        refreshCollarIds,
        saveCollarIdToFirestore,
        assignCollarToFarm,
      }}
    >
      {children}
    </CollarsContext.Provider>
  );
};

export const useCollars = () => {
  const context = useContext(CollarsContext);
  if (!context) {
    throw new Error("useCollars must be used within a CollarsProvider");
  }
  return context;
};