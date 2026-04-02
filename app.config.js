// app.config.js — reads sensitive keys from .env (gitignored)
// Keys are never committed to git. For EAS production builds, add them with:
//   eas secret:create --name GOOGLE_MAPS_API_KEY_IOS --value <key>
//   eas secret:create --name GOOGLE_MAPS_API_KEY_ANDROID --value <key>
//   eas secret:create --name FIREBASE_API_KEY --value <key>
//   (repeat for each FIREBASE_* and STRIPE_PUBLISHABLE_KEY)

module.exports = ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS || '',
    },
  },
  android: {
    ...config.android,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID || '',
      },
    },
  },
  extra: {
    ...config.extra,
    // Firebase config — exposed to the app via expo-constants
    firebaseApiKey: process.env.FIREBASE_API_KEY || '',
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    firebaseAppId: process.env.FIREBASE_APP_ID || '',
    firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
    // API
    apiUrl: process.env.API_URL || '',
  },
});
