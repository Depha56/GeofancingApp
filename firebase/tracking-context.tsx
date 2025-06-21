import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from "./auth-context";
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

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

    const addUniqueCollarId = async (collarId: string) => {
        const collarRef = doc(db, "collars", collarId);
        const collarSnap = await getDoc(collarRef);
        if (collarSnap.exists()) {
            throw new Error("Collar ID Was Taken!");
        }
        await setDoc(collarRef, { collarId });
    };

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

    const isOutsideGeofence = (sensor: SensorFeed, center: FarmCenterCoordinates, radius: number) => {
        const toRad = (deg: number) => deg * (Math.PI / 180);
        const R = 6371e3;
        const φ1 = toRad(center.latitude);
        const φ2 = toRad(sensor.latitude);
        const Δφ = toRad(sensor.latitude - center.latitude);
        const Δλ = toRad(sensor.longitude - center.longitude);

        const a = Math.sin(Δφ / 2) ** 2 +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance > radius;
    };

    const sendNotification = async (title: string, body: string) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: null,
        });
    };

    const fetchSensorsFeeds = useCallback(async () => {
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
                        };
                    })
                    .filter(feed => collarIds.includes(feed.collarId));

                setSensorsFeeds(feedsArr);

                if (farmCenterCoordinates && farmRadius) {
                    feedsArr.forEach(async (sensor) => {
                        const outside = isOutsideGeofence(sensor, farmCenterCoordinates, farmRadius);
                        if (outside) {
                            await sendNotification(
                                'Animal Out of Bounds',
                                `Collar ${sensor.collarId} is outside the farm geofence.`
                            );
                        }
                    });
                }
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
