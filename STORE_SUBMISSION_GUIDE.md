# B.CLEAN - App Store Submission Guide

This guide walks you through the complete process of submitting B.CLEAN to both the Apple App Store and Google Play Store.

---

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Apple Developer Account** ($99/year) - https://developer.apple.com/programs/
- [ ] **Google Play Console Account** ($25 one-time) - https://play.google.com/console
- [ ] **Stripe Account** (verified for production)
- [ ] **Firebase Project** (Blaze plan recommended for production)
- [ ] **Google Cloud Project** with billing enabled
- [ ] **EAS CLI installed**: `npm install -g eas-cli`
- [ ] **Expo account created**: https://expo.dev

---

## Phase 1: Service Setup (Allow 2-3 days)

### Step 1: Firebase Setup (30 minutes)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Name: `B.CLEAN Production` (or your choice)
   - Enable Google Analytics (recommended)
   - Select or create Analytics account

2. **Enable Required Services**

   Navigate to each section and enable:
   - **Authentication**
     - Go to Authentication → Sign-in method
     - Enable "Email/Password"
     - Configure email templates (optional but recommended)
   - **Firestore Database**
     - Go to Firestore Database
     - Click "Create database"
     - Start in **production mode**
     - Choose location (us-central1 recommended)
   - **Cloud Storage**
     - Go to Storage
     - Click "Get started"
     - Start in **production mode**
     - Use same location as Firestore
   - **Cloud Messaging**
     - Go to Cloud Messaging
     - Click "Get started"
   - **Cloud Functions**
     - Will be set up when deploying functions

3. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click "Add app" → Select Web icon (</>)
   - Register app: `B.CLEAN`
   - Copy the configuration values (you'll need these)

4. **Deploy Security Rules**

   ```bash
   # Install Firebase CLI if not already installed
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase in project (if not done)
   firebase init
   # Select: Firestore, Storage, Functions
   # Use existing project: select your B.CLEAN project

   # Deploy security rules
   firebase deploy --only firestore:rules,storage:rules
   ```

5. **Set Up Firestore Indexes**

   The app requires these composite indexes:
   - Collection: `jobs`
     - Fields: `assignedTo` (Ascending), `scheduledDate` (Ascending)
     - Fields: `customerId` (Ascending), `scheduledDate` (Descending)
     - Fields: `status` (Ascending), `scheduledDate` (Ascending)
   - Collection: `customers`
     - Fields: `zipCode` (Ascending), `createdAt` (Descending)
     - Fields: `assignedSalesperson` (Ascending), `createdAt` (Descending)

   **Auto-create indexes:**
   - Try using the app features that trigger queries
   - Firebase will generate index creation links in the console
   - Click the links to auto-create indexes

   **Manual creation:**
   - Go to Firestore → Indexes
   - Click "Create Index"
   - Enter collection and fields as above

### Step 2: Stripe Setup (1 hour + verification time)

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up for new account
   - Complete business verification (required for production)
     - Business details
     - Bank account information
     - Identity verification
     - _Verification can take 1-2 business days_

2. **Get API Keys**
   - Go to Developers → API keys
   - Copy both:
     - Publishable key (starts with `pk_live_`)
     - Secret key (starts with `sk_live_`)
   - **Keep secret key secure!**

3. **Configure Payment Methods**
   - Go to Settings → Payment methods
   - Enable desired methods:
     - Cards (Visa, Mastercard, Amex, Discover)
     - Digital wallets (Apple Pay, Google Pay) - recommended

4. **Set Up Webhooks (for Cloud Functions)**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/stripeWebhook`
   - Select events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - Copy webhook signing secret (starts with `whsec_`)

### Step 3: Google Cloud Platform Setup (20 minutes)

1. **Create/Select Project**
   - Go to https://console.cloud.google.com
   - Select your Firebase project (Firebase auto-creates GCP project)
   - Or create new project if necessary

2. **Enable Billing**
   - Go to Billing
   - Link billing account
   - Set up budget alerts (recommended: alert at $50, $100)

3. **Enable Required APIs**
   - Go to APIs & Services → Library
   - Search and enable:
     - Maps SDK for iOS
     - Maps SDK for Android
     - Places API (if using autocomplete)

4. **Create API Keys**

   **iOS Key:**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → API Key
   - Click on the key name to restrict it
   - Application restrictions: iOS apps
   - Add bundle identifier: `com.bclean.windowwashing`
   - API restrictions: Restrict key
     - Select: Maps SDK for iOS
   - Save

   **Android Key:**
   - Create Credentials → API Key
   - Restrict it:
   - Application restrictions: Android apps
   - Add package name: `com.bclean.windowwashing`
   - Add SHA-1 certificate fingerprint (get from EAS build)
   - API restrictions: Restrict key
     - Select: Maps SDK for Android
   - Save

### Step 4: Expo Account & EAS Setup (15 minutes)

1. **Create Expo Account**
   - Go to https://expo.dev
   - Sign up (free tier is fine)
   - Note your username

2. **Initialize EAS in Project**

   ```bash
   # Login to Expo
   eas login

   # Configure project
   eas init
   # This creates an EAS project ID
   ```

3. **Update app.json**
   - Copy the project ID shown
   - Add to `app.json`:
     ```json
     "extra": {
       "eas": {
         "projectId": "YOUR_EAS_PROJECT_ID_HERE"
       }
     }
     ```

---

## Phase 2: App Configuration

### Step 5: Configure Environment Variables

1. **Update .env file**

   Open `.env` and replace all placeholder values:

   ```env
   # Use values from Firebase Project Settings
   FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   FIREBASE_AUTH_DOMAIN=b-clean-app-xxxxx.firebaseapp.com
   FIREBASE_PROJECT_ID=b-clean-app-xxxxx
   FIREBASE_STORAGE_BUCKET=b-clean-app-xxxxx.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789012
   FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
   FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

   # Use LIVE keys from Stripe Dashboard
   STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
   STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE

   # Use restricted keys from Google Cloud Console
   GOOGLE_MAPS_API_KEY_IOS=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   GOOGLE_MAPS_API_KEY_ANDROID=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

   # Set to production
   APP_ENV=production
   API_URL=https://us-central1-YOUR_FIREBASE_PROJECT_ID.cloudfunctions.net
   ```

2. **Add .env to .gitignore** (verify it's there)
   ```bash
   # Check .gitignore includes .env
   cat .gitignore | grep "\.env"
   ```

### Step 6: Update app.json for Production

Open `app.json` and update:

```json
{
  "expo": {
    "name": "B.CLEAN",
    "slug": "b-clean-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.bclean.windowwashing",
      "buildNumber": "1",
      "config": {
        "googleMapsApiKey": "YOUR_IOS_KEY_FROM_GCP"
      }
    },
    "android": {
      "package": "com.bclean.windowwashing",
      "versionCode": 1,
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_KEY_FROM_GCP"
        }
      }
    },
    "extra": {
      "eas": {
        "projectId": "YOUR_EAS_PROJECT_ID"
      }
    }
  }
}
```

### Step 7: Create App Assets

You need to create the following image assets:

1. **App Icon** (`assets/icon.png`)
   - Size: 1024x1024 px
   - Format: PNG with transparency
   - Should work on light and dark backgrounds
   - No rounded corners (iOS/Android handle this)

2. **Splash Screen** (`assets/splash.png`)
   - Size: 1284x2778 px (iPhone 13 Pro Max)
   - Format: PNG
   - Should contain your logo/branding centered

3. **Adaptive Icon** (`assets/adaptive-icon.png`)
   - Size: 1024x1024 px
   - Format: PNG with transparency
   - Android only - center 66% will be visible

4. **Notification Icon** (`assets/notification-icon.png`)
   - Size: 96x96 px
   - Format: PNG
   - White icon on transparent background (Android notification tray)

5. **Favicon** (`assets/favicon.png`)
   - Size: 48x48 px
   - Format: PNG

**Quick Creation Options:**

- **Design in Figma/Canva** - Export as PNG
- **Use Expo's Asset Tool** - https://icons.expo.fyi/
- **Hire designer on Fiverr** - Search "App icon design" ($20-50)

---

## Phase 3: Build Configuration

### Step 8: Set Up iOS Build

1. **Configure iOS Credentials**

   ```bash
   eas credentials
   # Select iOS
   # Choose "Set up" for production
   # EAS can auto-generate certificates and provisioning profiles
   # OR you can provide your own from Apple Developer Portal
   ```

2. **Update eas.json** (if needed)

   ```json
   {
     "build": {
       "production": {
         "ios": {
           "resourceClass": "m-medium",
           "simulator": false,
           "buildConfiguration": "Release"
         }
       }
     },
     "submit": {
       "production": {
         "ios": {
           "appleId": "your.email@example.com",
           "ascAppId": "1234567890",
           "appleTeamId": "ABCDE12345"
         }
       }
     }
   }
   ```

3. **Get Apple IDs**
   - **Apple ID**: Your developer account email
   - **ASC App ID**:
     - Go to App Store Connect
     - Create new app
     - Copy the App ID (10-digit number from URL)
   - **Team ID**:
     - Go to developer.apple.com/account
     - Scroll to "Membership" section
     - Copy Team ID

### Step 9: Set Up Android Build

1. **Configure Android Signing**

   ```bash
   eas credentials
   # Select Android
   # Choose "Set up" for production
   # EAS can auto-generate keystore
   # OR upload your own
   ```

2. **Create Google Play Service Account**

   a. **In Google Play Console:**
   - Go to Setup → API access
   - Click "Create new service account"
   - Follow link to Google Cloud Console

   b. **In Google Cloud Console:**
   - Create service account
   - Name: `B.CLEAN EAS Deploy`
   - Grant role: Service Account User
   - Click "Create key" → JSON
   - Download JSON file

   c. **Back in Play Console:**
   - Grant access to the service account
   - Permissions: Release Manager, Release to production

   d. **Save JSON file:**
   - Save as `google-play-service-account.json` in project root
   - **Add to .gitignore!**

3. **Update eas.json**
   ```json
   {
     "submit": {
       "production": {
         "android": {
           "serviceAccountKeyPath": "./google-play-service-account.json",
           "track": "production"
         }
       }
     }
   }
   ```

---

## Phase 4: Pre-Launch Testing

### Step 10: Local Development Test

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Test on physical device (recommended)
# Scan QR code with Expo Go app

# Or test on simulator
npm run ios     # iOS
npm run android # Android
```

**Test All Features:**

- [ ] User registration and login
- [ ] Create customer profile
- [ ] Schedule a job
- [ ] View calendar
- [ ] Drop pin on map
- [ ] Take photo (camera permissions)
- [ ] Payment processing (use Stripe test cards)
- [ ] Push notifications

### Step 11: Create Preview Builds

Test the compiled app before production:

```bash
# iOS Preview (TestFlight)
eas build --platform ios --profile preview

# Android Preview (APK)
eas build --platform android --profile preview
```

**Install and test:**

- iOS: Upload to TestFlight, distribute to internal testers
- Android: Download APK, install on device

---

## Phase 5: Production Builds

### Step 12: Build for Production

```bash
# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production

# Or build both
eas build --platform all --profile production
```

**Build times:** 10-20 minutes each

**Download builds** when complete:

- iOS: .ipa file (for App Store submission)
- Android: .aab file (App Bundle for Play Store)

---

## Phase 6: App Store Submissions

### Step 13: Submit to Apple App Store

1. **Create App in App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Click "My Apps" → "+" → "New App"
   - Platform: iOS
   - Name: B.CLEAN
   - Primary Language: English
   - Bundle ID: com.bclean.windowwashing
   - SKU: bclean-001 (can be anything unique)

2. **Fill Out App Information**

   **App Information:**
   - Name: B.CLEAN
   - Subtitle: Window Washing Operations Suite
   - Category: Business, Productivity

   **Pricing:**
   - Price: Free (or your choice)
   - Availability: All countries (or select)

   **Prepare for Submission:**
   - App Preview video (optional but recommended)
   - Screenshots (required):
     - 6.7" iPhone: 1290x2796 px (iPhone 14 Pro Max)
     - 6.5" iPhone: 1284x2778 px (iPhone 11 Pro Max)
     - Need 4-5 screenshots showing key features
   - Description (SEE TEMPLATE BELOW)
   - Keywords: window washing, cleaning, field service, scheduling
   - Support URL: https://kendychae.github.io/B-CLEAN/
   - Marketing URL: (optional)
   - Privacy Policy URL: **REQUIRED** - create one

   **App Review Information:**
   - Contact info
   - Demo account credentials (create test user)
   - Notes: Explain the app, mention need for location/camera access

3. **Submit Build**

   ```bash
   # Auto-submit the build you just created
   eas submit --platform ios --profile production

   # Or manually upload via Transporter app
   ```

4. **Select Build in App Store Connect**
   - After upload processes (15-30 min)
   - Go to your app → TestFlight tab
   - Build will appear
   - Go to App Store tab
   - Scroll to "Build" section
   - Click "+" and select your build

5. **Submit for Review**
   - Click "Submit for Review"
   - Review time: Usually 24-48 hours
   - Watch for messages from App Review

### Step 14: Submit to Google Play Store

1. **Create App in Play Console**
   - Go to https://play.google.com/console
   - Click "Create app"
   - App name: B.CLEAN
   - Default language: English
   - App or game: App
   - Free or paid: Free
   - Accept policies

2. **Complete Dashboard Setup**

   **App access:**
   - All functionality is available without restrictions
   - OR provide demo credentials if needed

   **Ads:**
   - Select "Yes, it contains ads" (app uses Google AdMob banner ads)

   **Content ratings:**
   - Complete questionnaire
   - Likely rating: Everyone

   **Target audience:**
   - Select: 18 and over (business app)

   **News app:**
   - No

   **COVID-19 contact tracing app:**
   - No

   **Data safety:**
   - Complete data collection disclosure
   - Types of data collected:
     - Location (precise)
     - Personal info (name, email, phone, address)
     - Photos (before/after job photos)
     - Financial info (payment information via Stripe)
   - All data encrypted in transit
   - Users can request data deletion

   **Government apps:**
   - No

   **Privacy policy:**
   - Enter URL: **REQUIRED** - create one

3. **Store Listing**
   - **App name:** B.CLEAN
   - **Short description:** (80 chars)
     > Window washing operations suite for scheduling, customer management, and field service
   - **Full description:** (SEE TEMPLATE BELOW)
   - **App icon:** 512x512 px PNG
   - **Feature graphic:** 1024x500 px JPEG/PNG (required)
   - **Screenshots:** (at least 2, max 8)
     - Phone: 16:9 or 9:16 ratio
     - Min dimension: 320px
     - Max dimension: 3840px
   - **App category:** Business
   - **Contact details:**
     - Email (required)
     - Phone (optional)
     - Website (optional)

4. **Create Release**

   a. Go to Production → Create new release

   b. Upload app bundle:

   ```bash
   # Auto-submit
   eas submit --platform android --profile production

   # Or manually upload the .aab file
   ```

   c. Release name: 1.0.0 (matches app version)

   d. Release notes:

   ```
   Initial release of B.CLEAN

   Features:
   - Customer management
   - Job scheduling
   - Live territory map
   - Payment processing
   - Before/after photo documentation
   - Calendar integration
   ```

   e. Save → Review release → Start rollout to Production

5. **Review Process**
   - Initial review: Can take several days to 1 week
   - May get requests for clarification
   - Must pass Google Play policies

---

## Phase 7: Post-Submission

### Step 15: Monitor Submissions

**Apple App Store:**

- Check App Store Connect daily
- Respond to review team within 24 hours
- Common issues:
  - Crashes on launch (Firebase not configured)
  - Missing demo account
  - Privacy policy issues
  - In-app purchase issues (even if you don't have IAP)

**Google Play Store:**

- Check Play Console
- Review status updates via email
- Common issues:
  - Privacy policy required
  - Data safety form incomplete
  - Content rating incomplete
  - Missing screenshots/graphics

### Step 16: Prepare for Launch

While waiting for approval:

1. **Create Privacy Policy**
   - **Already included** in the app:
     - In-app: Profile → Legal → Privacy Policy, Terms of Service, EULA
     - Files: `PRIVACY_POLICY.md` and `TERMS_OF_SERVICE.md` in repo root
   - Host the web version on GitHub Pages or your website at https://bclean.app/privacy
   - Required URL for both app stores
   - Must cover:
     - Data collection (location, photos, contacts, etc.)
     - How data is used
     - Third-party services (Firebase, Stripe, Google Maps)
     - Data security
     - User rights (access, deletion)
     - Contact information

2. **Create Marketing Materials**
   - Landing page
   - Social media posts
   - Demo video
   - App preview video (1-3 minutes)

3. **Set Up Analytics**
   - Firebase Analytics (already included)
   - Google Analytics (optional)

4. **Prepare Support System**
   - Support email
   - FAQ page
   - Knowledge base

5. **Set Up Cloud Functions for Production**

   ```bash
   cd functions

   # Install dependencies
   npm install

   # Set Stripe secret key
   firebase functions:config:set stripe.secret_key="sk_live_YOUR_KEY"

   # Deploy functions
   firebase deploy --only functions
   ```

---

## App Store Listing Templates

### App Description Template

```
B.CLEAN - Window Washing Operations & Sales Suite

Transform your window washing business with our comprehensive operations management platform.

DESIGNED FOR PROFESSIONALS
Built specifically for window washing and exterior cleaning businesses, B.CLEAN streamlines every aspect of your operations from sales to service delivery.

KEY FEATURES

Sales & Territory Management
• Live territory map with real-time team updates
• Drop pins for prospects, customers, and exclusions
• Prevent duplicate contacts across your team
• Convert leads to customers instantly

Smart Scheduling
• Visual calendar with drag-and-drop scheduling
• Conflict prevention and availability checking
• Automatic customer notifications
• Sync with Google Calendar and iCal

Customer Management
• Complete customer profiles with service history
• Advanced search and filtering
• Track lifetime value and revenue
• Maintain detailed service notes

Field Service Tools
• GPS navigation to job sites
• Before/after photo documentation
• Digital customer signatures
• One-tap job completion

Payment Processing
• Integrated Stripe payment processing
• Digital invoicing via SMS or email
• Payment tracking and history
• Accept cards and digital wallets

Team Collaboration
• Role-based permissions (Admin, Sales, Technician)
• Real-time updates across team
• Group messaging to customers
• Centralized communication

SECURITY & RELIABILITY
• Bank-level encryption
• Secure cloud backup
• Role-based access control
• SOC 2 compliant infrastructure

WHO IT'S FOR
• Window washing companies
• Pressure washing services
• Exterior cleaning businesses
• Mobile service operations

REQUIREMENTS
• Internet connection for sync
• Location services for mapping
• Camera for job documentation
• iOS 13.0 or later / Android 8.0 or later

SUPPORT
Visit https://kendychae.github.io/B-CLEAN/ for tutorials, documentation, and support.

Download B.CLEAN today and take your window washing business to the next level.
```

### Keywords

**iOS:**
window washing, cleaning business, field service, job scheduling, customer management, service business, route planning, invoice, payment processing, business management

**Android:**
Same as above (separated by commas, max 50 chars per keyword)

---

## Troubleshooting Common Issues

### Build Failures

**"Invalid Bundle Identifier"**

- Ensure bundle ID matches exactly in app.json and Apple Developer Portal
- No spaces, must be reverse domain notation

**"Missing Push Notification Entitlement"**

- EAS handles this automatically
- If manual: Add to Xcode capabilities

**"Gradle build failed" (Android)**

- Clear build cache: `eas build:clear-cache`
- Check `android/build.gradle` for syntax errors

### Review Rejections

**Apple: "Crashed on Launch"**

- Firebase not initialized
- Check .env file has correct values
- Test on real device before submission

**Apple: "Missing Login Credentials"**

- Provide demo account in Review Notes
- Make sure account actually works

**Google: "Privacy Policy Required"**

- Must have a valid, accessible privacy policy URL
- Must cover all data types your app collects

**Google: "Data Safety Form Incomplete"**

- Review each data type checkbox
- Ensure encryption and security practices are disclosed

### Post-Launch Issues

**Push Notifications Not Working**

- Check Firebase Cloud Messaging configuration
- Verify APNs certificates (iOS)
- Test with Firebase console "Cloud Messaging" → "Send notification"

**Payments Failing**

- Verify Stripe keys are LIVE keys, not test
- Check Stripe dashboard for errors
- Ensure webhook endpoint is accessible

**Maps Not Showing**

- Verify API keys in app.json match Google Cloud Console
- Check API restrictions on keys
- Ensure billing is enabled on GCP project

---

## Cost Breakdown

**One-Time Costs:**

- Apple Developer Account: $99/year
- Google Play Account: $25 (lifetime)
- App icon design (optional): $20-100
- Total: ~$150 first year, $99/year after

**Monthly Costs (estimated):**

- Firebase (Blaze plan): $0-50 (usage-based)
- Stripe fees: 2.9% + $0.30 per transaction
- Google Cloud (Maps): $0-50 (free tier generous)
- EAS Builds: $0 (free tier) or $29/month (Expo subscription)
- Total: $0-130/month depending on usage

---

## Timeline Estimate

- Firebase/Stripe/GCP Setup: 1-2 days
- App configuration & testing: 1-2 days
- Asset creation: 1-3 days (if hiring designer)
- Build and preview testing: 1 day
- Store listing preparation: 1 day
- **Submission to approval: 2-7 days** (Apple faster, Google slower)

**Total: 7-16 days from start to live in stores**

---

## Support & Resources

- **Expo Documentation:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **Firebase:** https://firebase.google.com/docs
- **Stripe:** https://stripe.com/docs
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policy:** https://play.google.com/about/developer-content-policy/

---

## Next Steps

1. **Work through Phase 1** - Set up all services (can be done in parallel)
2. **Configure Phase 2** - Update all config files with real credentials
3. **Test Phase 3** - Build preview versions and test thoroughly
4. **Build Phase 4** - Create production builds
5. **Submit Phase 5** - Upload to both stores
6. **Monitor Phase 6** - Respond to review feedback promptly

**Questions?** Review the troubleshooting section or check service-specific documentation.

Good luck with your launch! 🚀
