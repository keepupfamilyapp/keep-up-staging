// firebase-messaging-sw.js
// Same file deployed to both prod and staging - auto-detects which
// environment it's running in from its own URL, same approach as index.html.

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

var IS_STAGING = self.location.hostname.indexOf("keepup-staging") !== -1;

var FIREBASE_CONFIG_PROD = {
  apiKey: "AIzaSyBLUsaETkcXh_1f2KOayMAkhM9jPb1XE9Y",
  authDomain: "keep-up-f9d1c.firebaseapp.com",
  projectId: "keep-up-f9d1c",
  storageBucket: "keep-up-f9d1c.firebasestorage.app",
  messagingSenderId: "216417089419",
  appId: "1:216417089419:web:0f736931c79dbe4ed8618e"
};

// Same staging config as index.html
var FIREBASE_CONFIG_STAGING = {
  apiKey: "AIzaSyDm29MTp6VJ6REZUti1P_EX1i2S-u_GWKM",
  authDomain: "keep-up-staging.firebaseapp.com",
  projectId: "keep-up-staging",
  storageBucket: "keep-up-staging.firebasestorage.app",
  messagingSenderId: "100434668086",
  appId: "1:100434668086:web:d6d300f9bc639efd64c697"
};

firebase.initializeApp(IS_STAGING ? FIREBASE_CONFIG_STAGING : FIREBASE_CONFIG_PROD);

const messaging = firebase.messaging();

// The app's base URL, derived from where this service worker file itself
// is hosted - works correctly under any subpath (/Keepup/, /keepup-staging/, etc)
// without needing to hardcode it.
var APP_BASE_URL = self.location.href.replace(/firebase-messaging-sw\.js$/, "");

// Handle background messages (app is closed or in background)
messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || "Keep Up";
  const body  = payload.notification?.body  || "New activity in your family";

  self.registration.showNotification(title, {
    body,
    icon:  "icon.svg",
    badge: "icon.svg",
    data:  { url: APP_BASE_URL },
    vibrate: [200, 100, 200],
  });
});

// Tap notification -> open the app
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const url = event.notification.data?.url || APP_BASE_URL;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list) {
      for (const client of list) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
