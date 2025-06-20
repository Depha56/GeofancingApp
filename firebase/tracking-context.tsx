import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from "./auth-context";

export type FarmCenterCoordinates = {
    latitude: number;
    longitude: number;
};

type SensorFeed = {
    longitude: number;
    latitude: number;
    collarId: string;
};

type TrackingContextType = {
    farmId: string | null;
    farmRadius: number | null;
    farmCenterCoordinates: FarmCenterCoordinates | null;
    collarIds: string[];
    setFarmData: (
        farmRadius: number,
        farmCenterCoordinates: FarmCenterCoordinates,
        collarIds: string[],
        user: UserType,
        isUpdate?: boolean
    ) => Promise<void>;
    fetchFarmData: (farmId: string) => Promise<void>;
    sensorsFeeds: SensorFeed[];
    generateFarmId: () => string;
};

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const STORAGE_KEY = 'FARM_DATA'; 

// Generate a short unique farmId (6 alphanumeric characters)
const generateFarmId = () => {
    return Math.random().toString(36).substr(2, 6);
};

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
    const [farmId, setFarmId] = useState<string | null>(null);
    const [farmRadius, setFarmRadius] = useState<number | null>(null);
    const [farmCenterCoordinates, setFarmCenterCoordinates] = useState<FarmCenterCoordinates | null>(null);
    const [collarIds, setCollarIds] = useState<string[]>([]);
    const [sensorsFeeds, setSensorsFeeds] = useState<SensorFeed[]>([]);

    // Check if collarId exists, and add if unique
    const addUniqueCollarId = async (collarId: string) => {
        const collarRef = doc(db, "collars", collarId);
        const collarSnap = await getDoc(collarRef);
        if (collarSnap.exists()) {
            throw new Error("Collar ID Was Taken!");
        }
        await setDoc(collarRef, { collarId });
    };

    // Save farm data to Firestore and AsyncStorage
    const setFarmData = async (
        farmRadius: number,
        farmCenterCoordinates: FarmCenterCoordinates,
        collarIds: string[],
        user: UserType,
        isUpdate: boolean = false,
    ) => {

        if(!isUpdate)
            await addUniqueCollarId(collarIds[0]);

        const newFarmId = farmId || generateFarmId();
        await setDoc(doc(db, "farms", newFarmId), {
            farmId: newFarmId,
            farmRadius,
            farmCenterCoordinates,
            role: "Farm Owner",
            createdAt: new Date(),
            collarIds,
        });

        // Update logged-in user's Firestore document with farmId
        if (user?.uid) {
            await updateDoc(doc(db, "users", user.uid), {
                farmId: newFarmId,
            });
        }

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ farmId: newFarmId, farmRadius, farmCenterCoordinates, collarIds, role: "Farm Owner" })
        );

        setFarmId(newFarmId);
        setFarmRadius(farmRadius);
        setFarmCenterCoordinates(farmCenterCoordinates);
        setCollarIds(collarIds);
    };

    // Fetch farm data from Firestore
    const fetchFarmData = useCallback(async (farmId: string) => {
        const docSnap = await getDoc(doc(db, "farms", farmId));
        if (docSnap.exists()) {
            const data = docSnap.data();
            setFarmId(data.farmId);
            setFarmRadius(data.farmRadius);
            setFarmCenterCoordinates(data.farmCenterCoordinates);
            setCollarIds(data.collarIds || []);
            
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    farmId: data.farmId,
                    farmRadius: data.farmRadius,
                    farmCenterCoordinates: data.farmCenterCoordinates,
                    collarIds: data.collarIds || [],
                })
            );
        }
    }, []);

    // Fetch sensors feeds from ThingSpeak API
    const fetchSensorsFeeds = useCallback(async () => {
        try {
            const res = await fetch(
                "https://api.thingspeak.com/channels/2989762/feeds.json?api_key=B0CPJXS5KOZBZOB2"
            );
            const data = await res.json();
            if (data.feeds && Array.isArray(data.feeds)) {
                // Map to latest feed per collarId
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
                        };
                    })
                    .filter(feed => collarIds.includes(feed.collarId));
                setSensorsFeeds(feedsArr);
            }
        } catch (e) {
            console.error("Error fetching sensors feeds:", e);
            setSensorsFeeds([]);
        }
    }, [collarIds]);

    // On mount, load farm data from AsyncStorage
    useEffect(() => {
        const loadFarmDataFromStorage = async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const { farmId, farmRadius, farmCenterCoordinates, collarIds } = JSON.parse(stored);
                    setFarmId(farmId);
                    setFarmRadius(farmRadius);
                    setFarmCenterCoordinates(farmCenterCoordinates);
                    setCollarIds(collarIds || []);
                } catch (e) {
                    // Optionally handle error
                    console.error("Error parsing stored farm data:", e);
                    setFarmId(null);
                }
            }
        }
        loadFarmDataFromStorage();
    }, []);

    // Poll sensors feeds every 30 seconds
    useEffect(() => {
        fetchSensorsFeeds();
    }, [fetchSensorsFeeds]);

    return (
        <TrackingContext.Provider
            value={{
                farmId,
                farmRadius,
                farmCenterCoordinates,
                collarIds,
                setFarmData,
                fetchFarmData,
                sensorsFeeds,
                generateFarmId,
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