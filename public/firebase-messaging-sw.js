// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyCkz0dwq9WuxY7fSBLHEHMfNn4c8CQZEig",
  authDomain: "topaz-fc73a.firebaseapp.com",
  databaseURL: "https://topaz-fc73a-default-rtdb.firebaseio.com",
  projectId: "topaz-fc73a",
  storageBucket: "topaz-fc73a.appspot.com",
  messagingSenderId: "837080339807",
  appId: "1:837080339807:web:e7cf7887c5ebb614a152ea",
  measurementId: "G-S6ZCTWE4V6"
};


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});