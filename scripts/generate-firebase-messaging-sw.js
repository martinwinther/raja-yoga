/**
 * Script to generate firebase-messaging-sw.js with actual Firebase config
 * 
 * Run this script after setting up Firebase to inject the correct config values.
 * 
 * Usage: node scripts/generate-firebase-messaging-sw.js
 */

const fs = require("fs");
const path = require("path");

// Try to load environment variables from .env.local if it exists
try {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (error) {
  console.warn("Could not load .env.local, using process.env directly");
}

// Ensure environment variables are loaded
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID && fs.existsSync(path.join(__dirname, "../.env.local"))) {
  try {
    const envPath = path.join(__dirname, "../.env.local");
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^NEXT_PUBLIC_FIREBASE_APP_ID=(.*)$/);
      if (match) {
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID = match[1].trim().replace(/^["']|["']$/g, "");
      }
    });
  } catch (error) {
    // Ignore
  }
}

// Extract messagingSenderId from appId if not provided
// AppId format: 1:SENDER_ID:platform:app_id
function getMessagingSenderId() {
  if (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
    return process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  }
  
  // Try to extract from appId format: 1:SENDER_ID:platform:app_id
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  if (appId) {
    const parts = appId.split(":");
    if (parts.length >= 2) {
      return parts[1];
    }
  }
  
  return "";
}

const senderId = getMessagingSenderId();
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
  ...(senderId ? { messagingSenderId: senderId } : {}),
};

const serviceWorkerContent = `/**
 * Firebase Cloud Messaging Service Worker
 * 
 * Handles background push notifications when the app is not in focus.
 * This file is auto-generated - do not edit manually.
 */

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);

  const notificationTitle = payload.notification?.title || "Daily Sutra";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/icons/android-chrome-192x192.png",
    badge: "/icons/android-chrome-192x192.png",
    tag: payload.notification?.tag || "daily-reminder",
    data: payload.data || {},
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received", event);

  event.notification.close();

  // Open the app when notification is clicked
  const urlToOpen = event.notification.data?.url || "/";
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
`;

const outputPath = path.join(__dirname, "../public/firebase-messaging-sw.js");
fs.writeFileSync(outputPath, serviceWorkerContent, "utf8");

console.log("✅ Generated firebase-messaging-sw.js with Firebase config");
console.log(`   Output: ${outputPath}`);

