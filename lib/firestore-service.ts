import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  getCountFromServer,
  query,
  getDocs,
  limit,
} from "firebase/firestore";

export interface PrayerData {
  prayer: string;
  accessDate: string;
  createdAt: string;
  color?: string;
}

/**
 * Save prayer data to Firestore (stored as plain text)
 * @param code - 10-digit access code (used as document ID)
 * @param prayerText - The prayer text
 * @returns Promise that resolves when save is complete
 */
export async function savePrayer(
  code: string,
  prayerText: string,
  color?: string
): Promise<void> {
  try {
    const prayersCollection = collection(db, "prayers");
    const prayerDoc = doc(prayersCollection, code);

    await setDoc(prayerDoc, {
      code,
      prayer: prayerText,
      accessDate: "2027-01-01T00:00:00.000Z",
      userCreatedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
      ...(color && { color }),
    });
  } catch (error) {
    console.error("Error saving prayer to Firestore:", error);
    throw new Error(
      "Failed to save your prayer. Please check your internet connection and try again."
    );
  }
}

/**
 * Retrieve prayer data from Firestore
 * @param code - 10-digit access code
 * @returns Prayer data or null if not found
 */
export async function getPrayer(code: string): Promise<PrayerData | null> {
  try {
    const prayersCollection = collection(db, "prayers");
    const prayerDoc = doc(prayersCollection, code);

    const docSnapshot = await getDoc(prayerDoc);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return {
        prayer: data.prayer || "",
        accessDate: data.accessDate || "2027-01-01T00:00:00.000Z",
        createdAt: data.userCreatedAt || data.createdAt,
        color: data.color,
      };
    }

    return null;
  } catch (error) {
    console.error("Error retrieving prayer from Firestore:", error);
    throw new Error(
      "Failed to retrieve your prayer. Please check your internet connection and try again."
    );
  }
}

/**
 * Get the total count of prayers in Firestore
 * @returns Promise that resolves to the prayer count
 */
export async function getPrayerCount(): Promise<number> {
  try {
    const prayersCollection = collection(db, "prayers");
    const snapshot = await getCountFromServer(prayersCollection);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting prayer count:", error);
    throw new Error("Failed to load prayer count.");
  }
}

/**
 * Get random prayers from Firestore
 * @param limitCount - Number of prayers to fetch
 * @returns Promise that resolves to an array of prayers
 */
export async function getRandomPrayers(
  limitCount: number = 50
): Promise<Array<{ prayer: string; color?: string }>> {
  try {
    const prayersCollection = collection(db, "prayers");
    const q = query(prayersCollection, limit(limitCount));
    const querySnapshot = await getDocs(q);

    const prayers: Array<{ prayer: string; color?: string }> = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      prayers.push({
        prayer: data.prayer || "",
        color: data.color,
      });
    });

    return prayers;
  } catch (error) {
    console.error("Error getting random prayers:", error);
    throw new Error("Failed to load prayers.");
  }
}
