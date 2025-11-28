/**
 * Firebase Cloud Messaging Service Worker
 * 
 * Handles background push notifications when the app is not in focus.
 * This file is auto-generated - do not edit manually.
 */

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
  "apiKey": "AIzaSyC8q0HEuErmHpO_4tIVTni2_ZA86KfMozo",
  "authDomain": "raja-yoga-journey.firebaseapp.com",
  "projectId": "raja-yoga-journey",
  "appId": "1:729974618674:web:7eb4fc7487ce0f30459a2b",
  "messagingSenderId": "729974618674"
};

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
