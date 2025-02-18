import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// initialize Firebase (prevent multiple instances)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// fetch FAQ answer from Firestore
export const getFaqResponse = async (question: string): Promise<string | null> => {
  try {
    const trimmedQuestion = question.trim();
    console.log("Searching Firestore for:", trimmedQuestion);

    const q = query(collection(db, "faqs"), where("question", "==", trimmedQuestion));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching FAQ found.");
      return null;
    }

    // return the answer from the first document found
    return querySnapshot.docs[0].data().answer as string;
  } catch (error) {
    console.error("Error fetching FAQ response:", error);
    return null;
  }
};
