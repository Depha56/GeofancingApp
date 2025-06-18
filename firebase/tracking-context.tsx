import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";
import AsyncStorage from '@react-native-async-storage/async-storage';

type FarmCenterCoordinates = {
    latitude: number;
    longitude: number;
};

type AnimalLocation = {
    latitude: number;
    longitude: number;
} | null;

type TrackingContextType = {
    homeId: string | null;
    farmRadius: number | null;
    farmCenterCoordinates: FarmCenterCoordinates | null;
    setFarmData: (
        farmRadius: number,
        farmCenterCoordinates: FarmCenterCoordinates,
        collarId: string
    ) => Promise<void>;
    fetchFarmData: (homeId: string) => Promise<void>;
    animalLocation: AnimalLocation;
    fetchAnimalLocation: () => Promise<void>;
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
    const [animalLocation, setAnimalLocation] = useState<AnimalLocation>(null);

    // Save farm data to Firestore and AsyncStorage
    const setFarmData = async (
        farmRadius: number,
        farmCenterCoordinates: FarmCenterCoordinates,
        collarId: string
    ) => {
        // Generate homeId if not present
        const newHomeId = homeId || generateHomeId();
        await setDoc(doc(db, "farms", newHomeId), {
            homeId: newHomeId,
            farmRadius,
            farmCenterCoordinates,
            collarId,
        });
        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ homeId: newHomeId, farmRadius, farmCenterCoordinates, collarId })
        );
        setHomeId(newHomeId);
        setFarmRadius(farmRadius);
        setFarmCenterCoordinates(farmCenterCoordinates);
    };

    // Fetch farm data from Firestore
    const fetchFarmData = useCallback(async (homeId: string) => {
        const docSnap = await getDoc(doc(db, "farms", homeId));
        if (docSnap.exists()) {
            const data = docSnap.data();
            setHomeId(data.homeId);
            setFarmRadius(data.farmRadius);
            setFarmCenterCoordinates(data.farmCenterCoordinates);
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    homeId: data.homeId,
                    farmRadius: data.farmRadius,
                    farmCenterCoordinates: data.farmCenterCoordinates,
                    collarId: data.collarId,
                })
            );
        }
    }, []);

    // Fetch animal location from ThingSpeak API
    const fetchAnimalLocation = useCallback(async () => {
        try {
            const res = await fetch(
                "https://api.thingspeak.com/channels/2989762/feeds.json?api_key=B0CPJXS5KOZBZOB2&results=1"
            );
            const data = await res.json();
            if (data.feeds && data.feeds.length > 0) {
                const field1 = data.feeds[0].field1; // "-51.840084,-23.466249"
                if (field1) {
                    const [longitude, latitude] = field1.split(",").map(Number);
                    setAnimalLocation({ longitude, latitude });
                }
            }
        } catch (e) {
            // Optionally handle error
        }
    }, []);

    // On mount, load farm data from AsyncStorage
    useEffect(() => {
        const loadFarmDataFromStorage = async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const { homeId, farmRadius, farmCenterCoordinates } = JSON.parse(stored);
                    setHomeId(homeId);
                    setFarmRadius(farmRadius);
                    setFarmCenterCoordinates(farmCenterCoordinates);
                } catch (e) {
                    // Optionally handle error
                }
            }
        }
        loadFarmDataFromStorage();
    }, []);

    // Poll animal location every 30 seconds
    useEffect(() => {
        fetchAnimalLocation();
        const interval = setInterval(fetchAnimalLocation, 30000);
        return () => clearInterval(interval);
    }, [fetchAnimalLocation]);

    return (
        <TrackingContext.Provider
            value={{
                homeId,
                farmRadius,
                farmCenterCoordinates,
                setFarmData,
                fetchFarmData,
                animalLocation,
                fetchAnimalLocation,
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