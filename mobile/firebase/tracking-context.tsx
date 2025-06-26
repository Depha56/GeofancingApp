import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { doc, setDoc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "./config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from "./auth-context";
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import {
  parseLatestFeeds,
  feedsToSensorFeeds,
  checkLostConnections,
  checkGeofenceViolations,
} from "../hooks/functions";

export type FarmCenterCoordinates = {
    latitude: number;
    longitude: number;
};

export type SensorFeed = {
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
        isUpdate?: boolean,
        updateCollarId?: string
    ) => Promise<void>;
    fetchFarmData: (farmId: string) => Promise<void>;
    sensorsFeeds: SensorFeed[];
    generateFarmId: () => string;
};

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const STORAGE_KEY = 'FARM_DATA';

// Notification handler setup
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const generateFarmId = () => {
    return Math.random().toString(36).substr(2, 6);
};

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
    const [farmId, setFarmId] = useState<string | null>(null);
    const [farmRadius, setFarmRadius] = useState<number | null>(null);
    const [farmCenterCoordinates, setFarmCenterCoordinates] = useState<FarmCenterCoordinates | null>(null);
    const [collarIds, setCollarIds] = useState<string[]>([]);
    const [sensorsFeeds, setSensorsFeeds] = useState<SensorFeed[]>([]);

    useEffect(() => {
        const requestNotificationPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please enable notifications.');
            }
        };

        requestNotificationPermissions();
    }, []);

    const addUniqueCollarId = async (collarId: string, farmId: string) => {
        const collarRef = doc(db, "collars", collarId);
        const collarSnap = await getDoc(collarRef);
        if (collarSnap.exists()) {
            const prevFarmId = collarSnap.data().assignedFarmId;
            if (prevFarmId && prevFarmId !== farmId) {
                // Remove collar from previous farm's collarIds array
                const prevFarmRef = doc(db, "farms", prevFarmId);
                await updateDoc(prevFarmRef, {
                    collarIds: arrayRemove(collarId),
                });
            }
            // Update assignedFarmId to new farm
            await setDoc(collarRef, { collarId, assignedFarmId: farmId }, { merge: true });
        } else {
            throw new Error("Communicate the Admin to get Valid Collar ID");
        }
    };

    const setFarmData = async (
        farmRadius: number,
        farmCenterCoordinates: FarmCenterCoordinates,
        collarIds: string[],
        user: UserType,
        isUpdate: boolean = false,
        updateCollarId?: string,
    ) => {
        const newFarmId = farmId || generateFarmId();

        // Assign each collar to this farm and update Firestore accordingly
        for (const collarId of collarIds) {
            await addUniqueCollarId(collarId, newFarmId);
        }

        // If updating and a new collar is added
        if (isUpdate && updateCollarId && !collarIds.includes(updateCollarId)) {
            await addUniqueCollarId(updateCollarId, newFarmId);
            collarIds.push(updateCollarId);
        }

        // Update farm document with new collarIds
        await setDoc(doc(db, "farms", newFarmId), {
            farmId: newFarmId,
            farmRadius,
            farmCenterCoordinates,
            role: "Farm Owner",
            createdAt: new Date(),
            collarIds,
        });

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

    const fetchSensorsFeeds = useCallback(async () => {
        try {
            const res = await fetch(
                "https://api.thingspeak.com/channels/2989762/feeds.json?api_key=B0CPJXS5KOZBZOB2&results=20"
            );
            const data = await res.json();

            if (data.feeds && Array.isArray(data.feeds)) {
                const latestFeeds = parseLatestFeeds(data.feeds);              // get all latest feeds
                const feedsArr = feedsToSensorFeeds(latestFeeds, collarIds);   // get feeds for loggeg in collars 
                setSensorsFeeds(feedsArr);

                // Check for lost connections and geofence violations
                await checkLostConnections(collarIds, latestFeeds, setSensorsFeeds);

                await checkGeofenceViolations(farmCenterCoordinates,farmRadius, feedsArr);
              }
        } catch (e) {
            console.error("Error fetching sensors feeds:", e);
            setSensorsFeeds([]);
        }
    }, [collarIds, farmCenterCoordinates, farmRadius]);

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
                    console.error("Error parsing stored farm data:", e);
                    setFarmId(null);
                }
            }
        }
        loadFarmDataFromStorage();
    }, []);

    useEffect(() => {
        fetchSensorsFeeds();
        const interval = setInterval(fetchSensorsFeeds, 16000);
        return () => clearInterval(interval);
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
