// app.config.js — reads sensitive keys from .env (gitignored)
// Keys are never committed to git. For EAS production builds, add them with:
//   eas secret:create --name GOOGLE_MAPS_API_KEY_IOS --value <key>
//   eas secret:create --name GOOGLE_MAPS_API_KEY_ANDROID --value <key>

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
});
