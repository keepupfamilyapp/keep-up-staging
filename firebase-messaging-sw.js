// firebase-messaging-sw.js
// Place this file at the ROOT of your Netlify site (same level as index.html)

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBLUsaETkcXh_1f2KOayMAkhM9jPb1XE9Y",
  authDomain: "keep-up-f9d1c.firebaseapp.com",
  projectId: "keep-up-f9d1c",
  storageBucket: "keep-up-f9d1c.firebasestorage.app",
  messagingSenderId: "216417089419",
  appId: "1:216417089419:web:0f736931c79dbe4ed8618e"
});

const messaging = firebase.messaging();

// Handle background messages (app is closed or in background)
messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || "Keep Up";
  const body  = payload.notification?.body  || "New activity in your family";

  self.registration.showNotification(title, {
    body,
    icon:  "/Keepup/icon.svg",
    badge: "/Keepup/icon.svg",
    data:  { url: "https://keepupfamilyapp.github.io/Keepup" },
    vibrate: [200, 100, 200],
  });
});

// Tap notification → open the app
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const url = event.notification.data?.url || "https://keepupfamilyapp.github.io/Keepup";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list) {
      for (const client of list) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
