# Pre-Submission Readiness Checklist

Use this checklist to ensure your app is ready for App Store and Play Store submission.

---

## 🔴 CRITICAL - Must Complete Before Building

### Environment & Configuration

- [ ] **Firebase Project Created**
  - [ ] Authentication enabled (Email/Password)
  - [ ] Firestore Database created (production mode)
  - [ ] Cloud Storage enabled
  - [ ] Cloud Messaging enabled
  - [ ] Security rules deployed
  - [ ] Firestore indexes created

- [ ] **Environment Variables Configured (.env)**
  - [ ] `FIREBASE_API_KEY` - Real value from Firebase console
  - [ ] `FIREBASE_AUTH_DOMAIN` - Your project domain
  - [ ] `FIREBASE_PROJECT_ID` - Your project ID
  - [ ] `FIREBASE_STORAGE_BUCKET` - Your storage bucket
  - [ ] `FIREBASE_MESSAGING_SENDER_ID` - Real sender ID
  - [ ] `FIREBASE_APP_ID` - Real app ID
  - [ ] `STRIPE_PUBLISHABLE_KEY` - LIVE key (not test)
  - [ ] `STRIPE_SECRET_KEY` - LIVE key (not test)
  - [ ] `GOOGLE_MAPS_API_KEY_IOS` - Restricted iOS key
  - [ ] `GOOGLE_MAPS_API_KEY_ANDROID` - Restricted Android key
  - [ ] `APP_ENV` - Set to "production"

- [ ] **Stripe Account**
  - [ ] Account created and verified
  - [ ] Bank account linked
  - [ ] Live API keys obtained
  - [ ] Payment methods enabled
  - [ ] Webhook endpoint configured (if using Cloud Functions)

- [ ] **Google Cloud Platform**
  - [ ] Maps SDK for iOS enabled
  - [ ] Maps SDK for Android enabled
  - [ ] API keys created and restricted
  - [ ] Billing enabled
  - [ ] Budget alerts configured

- [ ] **App Assets Created**
  - [ ] `icon.png` (1024x1024) - Main app icon
  - [ ] `adaptive-icon.png` (1024x1024) - Android adaptive
  - [ ] `splash.png` (1284x2778) - Splash screen
  - [ ] `notification-icon.png` (96x96) - Notification icon
  - [ ] `favicon.png` (48x48) - Web favicon
  - [ ] All assets tested and look good

### App Configuration Files

- [ ] **app.json Updated**
  - [ ] Version number set (1.0.0)
  - [ ] iOS bundle identifier correct
  - [ ] iOS build number set (1)
  - [ ] iOS Google Maps API key added
  - [ ] Android package name correct
  - [ ] Android version code set (1)
  - [ ] Android Google Maps API key added
  - [ ] EAS project ID added

- [ ] **eas.json Updated**
  - [ ] Apple ID configured (submit.production.ios.appleId)
  - [ ] ASC App ID configured (submit.production.ios.ascAppId)
  - [ ] Apple Team ID configured (submit.production.ios.appleTeamId)
  - [ ] Google Play service account path configured

---

## 🟡 IMPORTANT - Required for Store Approval

### Legal & Compliance

- [ ] **Privacy Policy Created**
  - [ ] Covers all data collection (location, photos, contacts, payment)
  - [ ] Lists third-party services (Firebase, Stripe, Google Maps)
  - [ ] Explains data usage and security
  - [ ] Includes contact information
  - [ ] Hosted and publicly accessible (URL ready)

- [ ] **Terms of Service** (Optional but recommended)
  - [ ] Created and hosted
  - [ ] URL ready

- [ ] **Business/Legal Entity**
  - [ ] Business registered (if applicable)
  - [ ] Tax information ready
  - [ ] Bank account for payouts

### Store Accounts

- [ ] **Apple Developer Account**
  - [ ] Account created and paid ($99/year)
  - [ ] Team ID obtained
  - [ ] Certificates configured (or using EAS auto-management)

- [ ] **Google Play Console Account**
  - [ ] Account created and paid ($25 one-time)
  - [ ] Service account created for automated deployment
  - [ ] Service account JSON downloaded

- [ ] **Expo/EAS Account**
  - [ ] Account created
  - [ ] EAS CLI installed (`npm install -g eas-cli`)
  - [ ] Logged in (`eas login`)
  - [ ] Project initialized (`eas init`)

### Store Listings

- [ ] **App Store Connect - iOS**
  - [ ] App created in App Store Connect
  - [ ] App name set: "B.CLEAN"
  - [ ] Bundle ID matches: com.bclean.windowwashing
  - [ ] Privacy policy URL added
  - [ ] Age rating completed
  - [ ] App category selected (Business)

- [ ] **Google Play Console - Android**
  - [ ] App created in Play Console
  - [ ] App name set: "B.CLEAN"
  - [ ] Package name matches: com.bclean.windowwashing
  - [ ] Privacy policy URL added
  - [ ] Content rating completed
  - [ ] Target audience selected
  - [ ] Data safety form completed
  - [ ] Store listing completed

---

## 🟢 RECOMMENDED - Improves Approval Chances

### Store Listing Content

- [ ] **App Description Written**
  - [ ] Clear value proposition
  - [ ] Feature list included
  - [ ] Keywords optimized
  - [ ] Under character limits (4000 chars)

- [ ] **Screenshots Created**
  - [ ] **iOS:** 6.7" display (1290x2796) - 4-5 screenshots
  - [ ] **iOS:** 6.5" display (1284x2778) - 4-5 screenshots
  - [ ] **Android:** Phone screenshots (1080x1920) - 2-8 screenshots
  - [ ] Show key features:
    - [ ] Dashboard/home screen
    - [ ] Customer management
    - [ ] Job calendar
    - [ ] Territory map
    - [ ] Photo documentation
    - [ ] Payments/invoicing

- [ ] **Feature Graphic** (Google Play only)
  - [ ] 1024x500 px banner created
  - [ ] Eye-catching marketing graphic

- [ ] **App Preview Video** (Optional but recommended)
  - [ ] 15-30 second video created
  - [ ] Shows key features
  - [ ] Uploaded to App Store Connect (iOS)

### Testing

- [ ] **Functionality Testing**
  - [ ] User registration works
  - [ ] Login works
  - [ ] Customer CRUD operations work
  - [ ] Job scheduling works
  - [ ] Calendar integration works
  - [ ] Map features work (pins, navigation)
  - [ ] Camera/photos work
  - [ ] Payment processing works (test then production)
  - [ ] Push notifications work
  - [ ] All permissions work (location, camera, calendar)

- [ ] **Device Testing**
  - [ ] Tested on iOS device/simulator
  - [ ] Tested on Android device/emulator
  - [ ] Tested on different screen sizes
  - [ ] Tested in light and dark mode

- [ ] **Code Quality**
  - [ ] TypeScript type checking passes: `npm run type-check`
  - [ ] Linting passes: `npm run lint`
  - [ ] No console.error messages in production
  - [ ] All features work without crashes

### Firebase Deployment

- [ ] **Security Rules Deployed**

  ```bash
  firebase deploy --only firestore:rules,storage:rules
  ```

- [ ] **Cloud Functions Deployed** (if using)

  ```bash
  cd functions
  npm install
  firebase functions:config:set stripe.secret_key="sk_live_..."
  firebase deploy --only functions
  ```

- [ ] **Firestore Indexes Created**
  - [ ] Test app triggers index creation links
  - [ ] All indexes created and ready

### Build Testing

- [ ] **Preview Builds Created**

  ```bash
  eas build --platform ios --profile preview
  eas build --platform android --profile preview
  ```

- [ ] **Preview Builds Tested**
  - [ ] iOS: Installed via TestFlight
  - [ ] Android: APK installed on device
  - [ ] All features work in compiled app
  - [ ] No crashes on startup
  - [ ] Firebase connection works
  - [ ] Stripe payments work

---

## Production Build & Submission

### Build Process

- [ ] **Production Builds Created**

  ```bash
  eas build --platform ios --profile production
  eas build --platform android --profile production
  ```

- [ ] **Builds Downloaded**
  - [ ] iOS .ipa file downloaded
  - [ ] Android .aab file downloaded

### iOS Submission

- [ ] **App Store Connect Preparation**
  - [ ] Build uploaded (via `eas submit` or Transporter)
  - [ ] Build selected for version
  - [ ] Screenshots uploaded
  - [ ] Description filled
  - [ ] Keywords added
  - [ ] Support URL added
  - [ ] Privacy policy URL added
  - [ ] Age rating completed
  - [ ] Pricing set

- [ ] **Demo Account Created**
  - [ ] Test user created in Firebase
  - [ ] Credentials provided in App Review Notes
  - [ ] Account has sample data

- [ ] **Submitted for Review**
  - [ ] All sections complete (green checkmarks)
  - [ ] "Submit for Review" clicked
  - [ ] Confirmation email received

### Android Submission

- [ ] **Google Play Console Preparation**
  - [ ] All dashboard items completed (green checkmarks)
  - [ ] App access configured
  - [ ] Ads declaration completed
  - [ ] Content rating completed
  - [ ] Target audience set
  - [ ] Data safety form completed
  - [ ] Privacy policy URL added
  - [ ] Store listing completed
  - [ ] Screenshots uploaded
  - [ ] Feature graphic uploaded

- [ ] **Production Release Created**
  - [ ] Build uploaded (via `eas submit` or manual upload)
  - [ ] Release name set (1.0.0)
  - [ ] Release notes added
  - [ ] Countries selected
  - [ ] Rollout started

---

## Post-Submission Monitoring

- [ ] **Monitor Review Status**
  - [ ] Check App Store Connect daily (iOS)
  - [ ] Check Play Console daily (Android)
  - [ ] Email notifications enabled

- [ ] **Respond Promptly**
  - [ ] Reply to review team within 24 hours
  - [ ] Address any issues immediately

- [ ] **Prepare for Launch**
  - [ ] Marketing materials ready
  - [ ] Social media posts prepared
  - [ ] User onboarding documentation
  - [ ] Support system ready (email, help docs)

---

## Common Rejection Reasons (Avoid These)

### iOS App Review

- ❌ **App crashes on launch** → Test thoroughly on real device
- ❌ **Missing demo credentials** → Provide working test account
- ❌ **Privacy policy missing/incorrect** → Must cover all data types
- ❌ **In-app purchases not working** → Test payment flow thoroughly
- ❌ **Missing necessary permissions descriptions** → Check Info.plist
- ❌ **Low quality UI/UX** → Ensure professional design
- ❌ **Incomplete app** → All features must work

### Google Play Review

- ❌ **Privacy policy missing** → Must be publicly accessible
- ❌ **Data safety form incomplete** → Cover all data collected
- ❌ **Content rating not completed** → Fill out questionnaire
- ❌ **Missing/low quality screenshots** → Provide clear screenshots
- ❌ **Misleading store listing** → Accurate description
- ❌ **Permissions not justified** → Explain in description why needed

---

## Estimated Timeline

| Phase                                 | Duration      | Notes                                             |
| ------------------------------------- | ------------- | ------------------------------------------------- |
| Service setup (Firebase, Stripe, GCP) | 1-2 days      | Stripe verification can take 1-2 business days    |
| App configuration & asset creation    | 1-3 days      | Faster if using icon generator or hiring designer |
| Testing & preview builds              | 1-2 days      | Test thoroughly to avoid rejections               |
| Store listing preparation             | 1 day         | Screenshots, description, etc.                    |
| Production builds                     | 2-4 hours     | EAS build time                                    |
| **iOS review**                        | **1-3 days**  | Usually 24-48 hours                               |
| **Android review**                    | **3-7 days**  | Can be longer for first submission                |
| **Total**                             | **7-16 days** | From start to live in stores                      |

---

## Support Resources

- **Expo Docs:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/
- **Firebase Docs:** https://firebase.google.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policies:** https://play.google.com/about/developer-content-policy/

---

## Ready to Submit?

✅ All critical items complete  
✅ All important items complete  
✅ App tested thoroughly  
✅ Store listings prepared  
✅ Production builds created

**Next command:**

```bash
# Submit to both stores
eas submit --platform all --profile production
```

---

**Questions or issues?** Review the [STORE_SUBMISSION_GUIDE.md](./STORE_SUBMISSION_GUIDE.md) for detailed step-by-step instructions.
