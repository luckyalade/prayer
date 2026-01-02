import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Save encrypted prayer data to Firestore
 * @param code - 10-digit access code (used as document ID)
 * @param encryptedData - Encrypted prayer data
 * @returns Promise that resolves when save is complete
 */
export async function savePrayer(
  code: string,
  encryptedData: string
): Promise<void> {
  try {
    const prayersCollection = collection(db, "prayers");
    const prayerDoc = doc(prayersCollection, code);

    await setDoc(prayerDoc, {
      code,
      encrypted: encryptedData,
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
 * Retrieve encrypted prayer data from Firestore
 * @param code - 10-digit access code
 * @returns Encrypted prayer data or null if not found
 */
export async function getPrayer(code: string): Promise<string | null> {
  try {
    const prayersCollection = collection(db, "prayers");
    const prayerDoc = doc(prayersCollection, code);

    const docSnapshot = await getDoc(prayerDoc);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data.encrypted || null;
    }

    return null;
  } catch (error) {
    console.error("Error retrieving prayer from Firestore:", error);
    throw new Error(
      "Failed to retrieve your prayer. Please check your internet connection and try again."
    );
  }
}
