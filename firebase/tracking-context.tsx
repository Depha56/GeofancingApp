import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";
import AsyncStorage from '@react-native-async-storage/async-storage';

type FarmCenterCoordinates = {
    latitude: number;
    longitude: number;
};

type SensorFeed = {
    longitude: number;
    latitude: number;
    collarId: string;
};

type TrackingContextType = {
    homeId: string | null;
    farmRadius: number | null;
    farmCenterCoordinates: FarmCenterCoordinates | null;
    collarIds: string[];
    setFarmData: (
        farmRadius: number,
        farmCenterCoordinates: FarmCenterCoordinates,
        collarIds: string[]
    ) => Promise<void>;
    fetchFarmData: (homeId: string) => Promise<void>;
    sensorsFeeds: SensorFeed[];
    generateHomeId: () => string;
};

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

const STORAGE_KEY = 'FARM_DATA';

// Generate a short unique homeId (6 alphanumeric characters)
const generateHomeId = () => {
    return Math.random().toString(36).substr(2, 6);
};

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
    const [homeId, setHomeId] = useState<string | null>(null);
    const [farmRadius, setFarmRadius] = useState<number | null>(null);
    const [farmCenterCoordinates, setFarmCenterCoordinates] = useState<FarmCenterCoordinates | null>(null);
    const [collarIds, setCollarIds] = useState<string[]>([]);
    const [sensorsFeeds, setSensorsFeeds] = useState<SensorFeed[]>([]);

    // Save farm data to Firestore and AsyncStorage
    const setFarmData = async (
        farmRadius: number,
        farmCenterCoordinates: FarmCenterCoordinates,
        collarIds: string[]
    ) => {
        const newHomeId = homeId || generateHomeId();
        await setDoc(doc(db, "farms", newHomeId), {
            homeId: newHomeId,
            farmRadius,
            farmCenterCoordinates,
            role: "Farm Owner",
            createdAt: new Date(),
            collarIds,
        });

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ homeId: newHomeId, farmRadius, farmCenterCoordinates, collarIds, role: "Farm Owner" })
        );

        setHomeId(newHomeId);
        setFarmRadius(farmRadius);
        setFarmCenterCoordinates(farmCenterCoordinates);
        setCollarIds(collarIds);
    };

    // Fetch farm data from Firestore
    const fetchFarmData = useCallback(async (homeId: string) => {
        const docSnap = await getDoc(doc(db, "farms", homeId));
        if (docSnap.exists()) {
            const data = docSnap.data();
            setHomeId(data.homeId);
            setFarmRadius(data.farmRadius);
            setFarmCenterCoordinates(data.farmCenterCoordinates);
            setCollarIds(data.collarIds || []);
            
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    homeId: data.homeId,
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
                    const { homeId, farmRadius, farmCenterCoordinates, collarIds } = JSON.parse(stored);
                    setHomeId(homeId);
                    setFarmRadius(farmRadius);
                    setFarmCenterCoordinates(farmCenterCoordinates);
                    setCollarIds(collarIds || []);
                } catch (e) {
                    // Optionally handle error
                    console.error("Error parsing stored farm data:", e);
                    setHomeId(null);
                }
            }
        }
        loadFarmDataFromStorage();
    }, []);

    // Poll sensors feeds every 30 seconds
    useEffect(() => {
        fetchSensorsFeeds();
        const interval = setInterval(fetchSensorsFeeds, 30000);
        return () => clearInterval(interval);
    }, [fetchSensorsFeeds]);

    return (
        <TrackingContext.Provider
            value={{
                homeId,
                farmRadius,
                farmCenterCoordinates,
                collarIds,
                setFarmData,
                fetchFarmData,
                sensorsFeeds,
                generateHomeId,
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