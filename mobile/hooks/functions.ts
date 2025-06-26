import type { FarmCenterCoordinates } from "../firebase/tracking-context";
import type { SensorFeed } from "../firebase/tracking-context";
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // adjust path as needed

// Parse ThingSpeak feeds to latest feed per collarId
export function parseLatestFeeds(feeds: any[]): Record<string, { feed: any; created_at: string }> {
  const latestFeeds: Record<string, { feed: any; created_at: string }> = {};
  feeds.forEach((feed: any) => {
    const collarId = feed.field2;
    const createdAt = feed.created_at;
    if (!collarId || !feed.field1) return;
    if (!latestFeeds[collarId] || new Date(createdAt) > new Date(latestFeeds[collarId].created_at)) {
      latestFeeds[collarId] = { feed, created_at: createdAt };
    }
  });
  return latestFeeds;
}

// Convert feeds to SensorFeed array
export function feedsToSensorFeeds(
  latestFeeds: Record<string, { feed: any; created_at: string }>,
  collarIds: string[]
): SensorFeed[] {
  return Object.values(latestFeeds)
    .map(({ feed }) => {
      const [longitude, latitude] = feed.field1.split(",").map(Number);
      return {
        longitude,
        latitude,
        collarId: feed.field2,
      };
    })
    .filter(feed => collarIds.includes(feed.collarId));
}

// Check for lost connection and send notifications
export async function checkLostConnections(
  collarIds: string[],
  latestFeeds: Record<string, { feed: any; created_at: string }>,
  setLatestFeeds: Dispatch<React.SetStateAction<SensorFeed[]>>
) {
    const now = new Date();
    let notificationsMessage = {
        message: "",
        title: "Lost Connection",
        messageId: 0
    };
    for (const collarId of collarIds) {
        const lastStatus = await getLastStatus(collarId);

        const latest = latestFeeds[collarId];
        if (!latest) {
            notificationsMessage = {
                message: `Collar ${collarId} has no data.`,
                title: "Lost Connection",
                messageId: 1
            }
        }
        const lastTime = new Date(latest.created_at);
        if ((now.getTime() - lastTime.getTime()) > 60 * 1000) {
            notificationsMessage = {
                message: `No data received from collar ${collarId} for over 1 minute.`,
                title: "Lost Connection",
                messageId: 2
            }
            setLatestFeeds(prev => prev.filter(feed => feed.collarId !== collarId));
        }

        if(lastStatus && lastStatus.status === "lost" && lastStatus.statusId === notificationsMessage.messageId) {
            // If the last status was already lost, skip sending another notification
            continue;
        }
        if (notificationsMessage.message) {
            await sendNotification(notificationsMessage.title, notificationsMessage.message);
            await setLastStatus(collarId, "lost", notificationsMessage.messageId);

            // Save to Firestore
            await saveNotificationToFirestore({
              type: "connection_lost",
              priority: "critical",
              title: notificationsMessage.title,
              message: notificationsMessage.message,
              animalId: collarId,
            });
        }
    }
}

export async function checkGeofenceViolations(
        farmCenterCoordinates: FarmCenterCoordinates | null,
        farmRadius: number | null,
        feedsArr: SensorFeed[]
 ) {
   if (farmCenterCoordinates && farmRadius) {
        for (const sensor of feedsArr) {
            const outside = isOutsideGeofence(sensor, farmCenterCoordinates, farmRadius);
            const currentGeofenceStatus = outside ? "outside" : "inside";
            const lastGeofenceStatus = await getLastGeofenceStatus(sensor.collarId);

            if (lastGeofenceStatus !== currentGeofenceStatus) {
                if (currentGeofenceStatus === "outside") {
                    const title = 'Geofence Breach Alert';
                    const message = `Collar ${sensor.collarId} has left the designated safe zone`;
                    await sendNotification(title, message);

                    // Save to Firestore
                    await saveNotificationToFirestore({
                      type: "geofence_breach",
                      priority: "critical",
                      title,
                      message,
                      animalId: sensor.collarId,
                    });
                } else if (currentGeofenceStatus === "inside" && lastGeofenceStatus === "outside") {
                    const title = 'Geofence Return Alert';
                    const message = `Collar ${sensor.collarId} is back inside the safe zone`;
                    await sendNotification(title, message);

                    // Save to Firestore
                    await saveNotificationToFirestore({
                      type: "geofence_return",
                      priority: "normal",
                      title,
                      message,
                      animalId: sensor.collarId,
                    });
                }
                await setLastGeofenceStatus(sensor.collarId, currentGeofenceStatus);
            }
        }
    } 
}

// Check if a sensor is outside the geofence
export function isOutsideGeofence(
  sensor: SensorFeed,
  center: FarmCenterCoordinates,
  radius: number
) {
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
}

// Send a local notification
export async function sendNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null,
  });
}

// Get last known status from AsyncStorage
export async function getLastStatus(collarId: string): Promise<{status: string, statusId: number} | null> {
  try {
    const value = await AsyncStorage.getItem(`collarStatus:${collarId}`);
    if (value) {
      const parsed = JSON.parse(value);
      return {status:parsed.status as string, statusId: parseInt(parsed.statusId)}
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Set new status in AsyncStorage
export async function setLastStatus(collarId: string, status: string, statusId: number) {
  try {
    await AsyncStorage.setItem(
      `collarStatus:${collarId}`,
      JSON.stringify({ status, statusId })
    );
  } catch (e) {
    // handle error if needed
  }
}

// Get last known geofence status
export async function getLastGeofenceStatus(collarId: string): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(`collarStatus:geofence:${collarId}`);
    if (value) {
      const parsed = JSON.parse(value);
      return parsed.status as string;
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Set new geofence status
export async function setLastGeofenceStatus(collarId: string, status: string) {
  try {
    await AsyncStorage.setItem(
      `collarStatus:geofence:${collarId}`,
      JSON.stringify({ status, updatedAt: new Date().toISOString() })
    );
  } catch (e) {}
}

// Helper to save notification to Firestore
async function saveNotificationToFirestore({
  type,
  priority,
  title,
  message,
  animalId,
}: {
  type: string;
  priority: string;
  title: string;
  message: string;
  animalId: string;
}) {
  await addDoc(collection(db, "notifications"), {
    type,
    priority,
    title,
    message,
    animalId,
    read: false,
    timestamp: new Date().toISOString(),
  });
}
