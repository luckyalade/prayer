import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface PrayerData {
  prayer: string;
  accessDate: string;
  createdAt: string;
}

/**
 * Save prayer data to Firestore (stored as plain text)
 * @param code - 10-digit access code (used as document ID)
 * @param prayerText - The prayer text
 * @returns Promise that resolves when save is complete
 */
export async function savePrayer(
  code: string,
  prayerText: string
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
