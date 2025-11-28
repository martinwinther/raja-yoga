import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { serverConfig } from "../../../lib/server-config";
import { createServerLogger } from "../../../lib/logger";

const logger = createServerLogger("delete-account");

function getFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    const serviceAccountJson = JSON.parse(serverConfig.firebase.serviceAccount);
    return initializeApp({
      credential: cert(serviceAccountJson),
    });
  } catch (error) {
    throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON");
  }
}

const db = getFirestore(getFirebaseAdmin());
const adminAuth = getAuth(getFirebaseAdmin());

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, idToken } = body as { uid?: string; idToken?: string };

    if (!uid || !idToken) {
      return NextResponse.json(
        { error: "Missing uid or idToken" },
        { status: 400 }
      );
    }

    // Verify the ID token to ensure the user is authenticated
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
      if (decodedToken.uid !== uid) {
        return NextResponse.json(
          { error: "Token uid does not match request uid" },
          { status: 403 }
        );
      }
    } catch (error) {
      logger.error("Token verification failed", error, { uid });
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Delete all user data from Firestore
    try {
      const userRef = db.collection("users").doc(uid);
      
      // Delete subcollections
      const journeysRef = userRef.collection("journeys");
      const journeysSnapshot = await journeysRef.get();
      const journeyDeletes = journeysSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(journeyDeletes);

      const fcmTokensRef = userRef.collection("fcmTokens");
      const fcmTokensSnapshot = await fcmTokensRef.get();
      const fcmTokenDeletes = fcmTokensSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(fcmTokenDeletes);

      const preferencesRef = userRef.collection("preferences");
      const preferencesSnapshot = await preferencesRef.get();
      const preferenceDeletes = preferencesSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(preferenceDeletes);

      // Delete the user document itself
      await userRef.delete();

      logger.log("Deleted Firestore data", { uid });
    } catch (error) {
      logger.error("Failed to delete Firestore data", error, { uid });
      // Continue to try deleting auth account even if Firestore deletion fails
    }

    // Delete Firebase Auth account
    try {
      await adminAuth.deleteUser(uid);
      logger.log("Deleted Firebase Auth account", { uid });
    } catch (error) {
      logger.error("Failed to delete Firebase Auth account", error, { uid });
      return NextResponse.json(
        { error: "Failed to delete account. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    logger.error("Account deletion error", error);
    return NextResponse.json(
      { error: "An error occurred while deleting your account" },
      { status: 500 }
    );
  }
}

