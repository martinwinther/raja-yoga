import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "./client";
import type { Sutra } from "../../types/sutra";
import { createLogger } from "../logger";

const logger = createLogger("FirebaseSutras");

export async function getSutrasByBook(book: string): Promise<Sutra[]> {
  try {
    const sutrasRef = collection(db, "sutras");
    const q = query(
      sutrasRef,
      where("book", "==", book),
      orderBy("sutraNumber", "asc")
    );

    const querySnapshot = await getDocs(q);
    const sutras: Sutra[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sutras.push({
        id: doc.id,
        book: data.book,
        sutraNumber: data.sutraNumber,
        title: data.title,
        sutraText: data.sutraText,
        commentary: data.commentary,
      });
    });

    return sutras;
  } catch (error) {
    logger.error("Error fetching sutras", error, { action: "getSutrasByBook", book });
    throw error;
  }
}






