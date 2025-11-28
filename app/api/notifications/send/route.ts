import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { serverConfig } from "../../../../lib/server-config";
import { createServerLogger } from "../../../../lib/logger";

const logger = createServerLogger("notifications-send");

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
const messaging = getMessaging(getFirebaseAdmin());

/**
 * Send a notification to a specific user
 * This endpoint can be called by a scheduled job (e.g., cron) to send daily reminders
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, body: messageBody, data } = body as {
      userId?: string;
      title?: string;
      body?: string;
      data?: Record<string, string>;
    };

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get all FCM tokens for this user
    const tokensRef = db
      .collection("users")
      .doc(userId)
      .collection("fcmTokens");

    const tokensSnap = await tokensRef.get();
    const tokens: string[] = [];

    tokensSnap.forEach((doc) => {
      const tokenData = doc.data();
      if (tokenData.token) {
        tokens.push(tokenData.token);
      }
    });

    if (tokens.length === 0) {
      logger.warn("No FCM tokens found for user", undefined, { userId });
      return NextResponse.json({
        success: false,
        message: "No tokens found for user",
      });
    }

    // Send notification to all tokens
    const message = {
      notification: {
        title: title || "Daily Sutra",
        body: messageBody || "Time for your daily practice",
      },
      data: data || {},
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);

    logger.log("Notification sent", {
      userId,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });

    // Clean up invalid tokens
    if (response.failureCount > 0) {
      const tokensToDelete: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error) {
          const errorCode = resp.error.code;
          if (
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/registration-token-not-registered"
          ) {
            tokensToDelete.push(tokens[idx]);
          }
        }
      });

      // Delete invalid tokens
      for (const token of tokensToDelete) {
        await tokensRef.doc(token).delete();
      }
    }

    return NextResponse.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    logger.error("Failed to send notification", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

