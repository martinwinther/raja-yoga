import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "./client";
import type { GlossaryTerm } from "../../types/glossary";
import { createLogger } from "../logger";

const logger = createLogger("FirebaseGlossary");

export async function getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
  try {
    const glossaryRef = collection(db, "glossary");
    const q = query(glossaryRef, orderBy("sortKey", "asc"));

    const querySnapshot = await getDocs(q);
    const terms: GlossaryTerm[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      terms.push({
        id: doc.id,
        term: data.term,
        definition: data.definition,
        sortKey: data.sortKey,
      });
    });

    return terms;
  } catch (error) {
    logger.error("Error fetching glossary terms", error, { action: "getAllGlossaryTerms" });
    throw error;
  }
}






