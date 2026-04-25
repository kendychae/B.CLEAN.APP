// app.config.js — reads sensitive keys from .env (gitignored)
// Keys are never committed to git. For EAS production builds, add them with:
//   eas secret:create --name GOOGLE_MAPS_API_KEY_IOS --value <key>
//   eas secret:create --name GOOGLE_MAPS_API_KEY_ANDROID --value <key>
//   eas secret:create --name FIREBASE_API_KEY --value <key>
//   eas secret:create --name ADMOB_APP_ID_IOS --value <key>      (optional)
//   eas secret:create --name ADMOB_APP_ID_ANDROID --value <key>  (optional)
//   eas secret:create --name EAS_PROJECT_ID --value <uuid>
//   (repeat for each FIREBASE_* and STRIPE_PUBLISHABLE_KEY)

const ADMOB_IOS = process.env.ADMOB_APP_ID_IOS || '';
const ADMOB_ANDROID = process.env.ADMOB_APP_ID_ANDROID || '';
// Only register the AdMob plugin when BOTH real app IDs are provided.
// Shipping with placeholder IDs causes the app to crash at launch and
// will be rejected by Apple/Google review.
const ADMOB_ENABLED =
  /^ca-app-pub-\d+~\d+$/.test(ADMOB_IOS) &&
  /^ca-app-pub-\d+~\d+$/.test(ADMOB_ANDROID);

module.exports = ({ config }) => {
  const basePlugins = (config.plugins || []).filter(
    (p) => !(Array.isArray(p) && p[0] === 'react-native-google-mobile-ads')
  );

  const androidPermissions = [...((config.android && config.android.permissions) || [])];
  if (ADMOB_ENABLED && !androidPermissions.includes('com.google.android.gms.permission.AD_ID')) {
    androidPermissions.push('com.google.android.gms.permission.AD_ID');
  }

  // Only attach SKAdNetwork + ATT prompt strings when ads are actually enabled.
  const iosInfoPlist = { ...((config.ios && config.ios.infoPlist) || {}) };
  if (ADMOB_ENABLED) {
    iosInfoPlist.NSUserTrackingUsageDescription =
      'B.CLEAN uses this only to deliver more relevant, non-intrusive ads. You can decline at any time.';
    iosInfoPlist.SKAdNetworkItems = [
      { SKAdNetworkIdentifier: 'cstr6suwn9.skadnetwork' },
    ];
  }

  return {
    ...config,
    ios: {
      ...config.ios,
      infoPlist: iosInfoPlist,
      config: {
        ...((config.ios && config.ios.config) || {}),
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS || '',
      },
    },
    android: {
      ...config.android,
      permissions: androidPermissions,
      config: {
        ...((config.android && config.android.config) || {}),
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID || '',
        },
      },
    },
    plugins: ADMOB_ENABLED
      ? [
          ...basePlugins,
          [
            'react-native-google-mobile-ads',
            {
              androidAppId: ADMOB_ANDROID,
              iosAppId: ADMOB_IOS,
            },
          ],
        ]
      : basePlugins,
    extra: {
      ...config.extra,
      eas: {
        ...((config.extra && config.extra.eas) || {}),
        projectId:
          process.env.EAS_PROJECT_ID ||
          (config.extra && config.extra.eas && config.extra.eas.projectId) ||
          '',
      },
      // Feature flag consumed by AdBanner so the UI hides ads when no IDs configured
      adsEnabled: ADMOB_ENABLED,
      admobBannerIdIos: process.env.ADMOB_BANNER_ID_IOS || '',
      admobBannerIdAndroid: process.env.ADMOB_BANNER_ID_ANDROID || '',
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
  };
};
