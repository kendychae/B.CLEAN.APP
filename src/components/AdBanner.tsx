import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  const ads = require('react-native-google-mobile-ads');
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
  TestIds = ads.TestIds;
} catch {
  // AdMob not available (e.g. running in Expo Go)
}

// Replace these with your real AdMob unit IDs before production release
const AD_UNIT_IDS = {
  ios: __DEV__ ? TestIds?.BANNER ?? 'ca-app-pub-3940256099942544/2934735716' : 'ca-app-pub-XXXXX/XXXXX',
  android: __DEV__ ? TestIds?.BANNER ?? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-XXXXX/XXXXX',
};

interface AdBannerProps {
  style?: object;
}

export default function AdBanner({ style }: AdBannerProps) {
  if (!BannerAd) {
    // Graceful fallback when ads module is not available
    return null;
  }

  const adUnitId = Platform.OS === 'ios' ? AD_UNIT_IDS.ios : AD_UNIT_IDS.android;

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('Ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
