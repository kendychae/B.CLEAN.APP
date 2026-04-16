const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable react-native condition so @firebase/auth (and similar packages)
// resolve to their React Native entry points via the "exports" field
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'import',
  'default',
];

module.exports = config;
