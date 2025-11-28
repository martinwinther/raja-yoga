import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { serverConfig } from "../../../../lib/server-config";
import { createServerLogger } from "../../../../lib/logger";

const logger = createServerLogger("notifications-register");

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, userId } = body as { token?: string; userId?: string };

    if (!token || !userId) {
      return NextResponse.json(
        { error: "Missing token or userId" },
        { status: 400 }
      );
    }

    // Save FCM token to Firestore
    const tokenRef = db
      .collection("users")
      .doc(userId)
      .collection("fcmTokens")
      .doc(token);

    await tokenRef.set(
      {
        token,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true }
    );

    logger.log("FCM token registered", { userId, token: token.substring(0, 20) + "..." });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to register FCM token", error);
    return NextResponse.json(
      { error: "Failed to register token" },
      { status: 500 }
    );
  }
}

