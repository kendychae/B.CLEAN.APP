import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';

let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  // Loaded only when the native module is present (i.e. real device build).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ads = require('react-native-google-mobile-ads');
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
  TestIds = ads.TestIds;
} catch {
  // AdMob not available (Expo Go, web, or ads disabled at build time)
}

const extra: any = Constants.expoConfig?.extra ?? {};
const ADS_ENABLED = !!extra.adsEnabled;
const REAL_BANNER_IOS: string = extra.admobBannerIdIos || '';
const REAL_BANNER_ANDROID: string = extra.admobBannerIdAndroid || '';

interface AdBannerProps {
  style?: object;
}

export default function AdBanner({ style }: AdBannerProps) {
  // Hide ads entirely unless real AdMob IDs are wired up via env (EAS secrets).
  // This prevents Apple/Google review failures from placeholder IDs.
  if (!BannerAd || !ADS_ENABLED) {
    return null;
  }

  let adUnitId: string;
  if (__DEV__) {
    adUnitId = TestIds?.BANNER ?? (Platform.OS === 'ios'
      ? 'ca-app-pub-3940256099942544/2934735716'
      : 'ca-app-pub-3940256099942544/6300978111');
  } else {
    adUnitId = Platform.OS === 'ios' ? REAL_BANNER_IOS : REAL_BANNER_ANDROID;
    if (!/^ca-app-pub-\d+\/\d+$/.test(adUnitId)) {
      // No real unit configured — render nothing rather than ship a broken/test ad.
      return null;
    }
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          // Default to non-personalized ads so we don't need an ATT prompt
          // for tracking. Switch to false only after collecting consent.
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error: any) => {
          if (__DEV__) console.log('Ad failed to load:', error);
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
