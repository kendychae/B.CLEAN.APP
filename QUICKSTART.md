# Quick Start Guide - B.CLEAN

## For New Developers

### 1. Prerequisites Check

Before starting, verify you have:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm or Yarn package manager
- [ ] Git installed and configured
- [ ] Code editor (VS Code recommended)
- [ ] Xcode (macOS only, for iOS development)
- [ ] Android Studio (for Android development)

### 2. Initial Setup (5 minutes)

```bash
# Clone the repository
git clone https://github.com/kendychae/B.CLEAN.APP.git
cd B.CLEAN.APP

# Install dependencies
npm install

# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI globally
npm install -g eas-cli
```

### 3. Environment Configuration (10 minutes)

```bash
# Copy environment template
cp .env.example .env
```

**Edit `.env` and add:**

```
FIREBASE_API_KEY=your_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
GOOGLE_MAPS_API_KEY_IOS=your_ios_key
GOOGLE_MAPS_API_KEY_ANDROID=your_android_key
```

### 4. Firebase Setup (15 minutes)

1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable these services:
   - Authentication (Email/Password provider)
   - Cloud Firestore
   - Cloud Storage
   - Cloud Messaging
4. Get configuration from Project Settings
5. Add configuration to `.env`

**Deploy security rules:**

```bash
firebase login
firebase init
firebase deploy --only firestore:rules,storage:rules
```

### 5. First Run (2 minutes)

```bash
# Start development server
npm start
```

**Scan QR code with:**

- iOS: Camera app (opens Expo Go)
- Android: Expo Go app

**Or run on emulator:**

```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
```

### 6. Testing the App

**Create first admin user:**

1. Temporarily modify Firestore rules to allow user creation
2. Sign up through the app
3. In Firebase Console → Firestore → users collection
4. Find your user document
5. Change `role` field to `'admin'`
6. Restart the app
7. Restore security rules

## Common Issues & Solutions

### Issue: "Cannot find module"

```bash
rm -rf node_modules
npm install
```

### Issue: "Expo Go can't connect"

- Ensure computer and phone are on same WiFi
- Try running with tunnel: `expo start --tunnel`
- Check firewall settings

### Issue: "Firebase configuration error"

- Double-check all environment variables
- Ensure no extra spaces in `.env` file
- Verify Firebase project is active

### Issue: "Google Maps not showing"

- Verify API keys are correct
- Check API key restrictions in Google Cloud
- Ensure Maps SDK is enabled

### Issue: iOS build fails

- Update CocoaPods: `sudo gem install cocoapods`
- Update Xcode to latest version
- Clear DerivedData folder

### Issue: Android build fails

- Update Android Studio and SDK
- Accept all SDK licenses
- Check Java version (should be JDK 11)

## Development Workflow

### Daily Workflow

1. Pull latest changes: `git pull`
2. Check for dependency updates: `npm outdated`
3. Start dev server: `npm start`
4. Make your changes
5. Test on both platforms
6. Run type check: `npm run type-check`
7. Run linter: `npm run lint`
8. Commit and push

### Making Changes

**File Structure:**

```
src/
├── components/      # Reusable UI components
├── contexts/        # React context providers
├── config/          # Configuration files
├── navigation/      # Navigation setup
├── screens/         # Screen components
├── services/        # API and service layer
├── types/           # TypeScript type definitions
└── utils/          # Helper functions
```

**Hot Reloading:**

- Changes auto-reload in Expo Go
- Shake device for developer menu
- Press 'r' in terminal to reload manually

### Testing Features

**Test Different Roles:**

1. Create users with different roles in Firestore
2. Sign in as each role
3. Verify permissions work correctly

**Test Offline:**

1. Enable airplane mode
2. Verify cached data displays
3. Test error handling

**Test on Real Devices:**

- Install Expo Go from app stores
- Scan QR code from `npm start`
- Test camera, location, notifications

## Next Steps

### For Frontend Developers

- Review component structure in `src/components/`
- Study navigation setup in `src/navigation/`
- Explore screen implementations in `src/screens/`

### For Backend Developers

- Review Firebase configuration in `src/config/`
- Study services in `src/services/`
- Review Cloud Functions in `functions/`
- Read `SCHEMA.md` for database structure

### For Full-Stack Developers

- Review entire codebase structure
- Study Firestore security rules
- Explore context providers
- Review TypeScript types

## Helpful Commands

```bash
# Development
npm start              # Start development server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run web           # Run in web browser

# Code Quality
npm run type-check    # Check TypeScript types
npm run lint          # Run ESLint
npm test             # Run tests (if configured)

# Building
npm run build:ios     # Build for iOS
npm run build:android # Build for Android
npm run build:all     # Build for both platforms

# Deployment
npm run submit:ios    # Submit to App Store
npm run submit:android # Submit to Play Store

# Firebase
firebase deploy       # Deploy all Firebase resources
firebase functions:log # View Cloud Functions logs
```

## Resources

**Documentation:**

- [README.md](./README.md) - Complete project documentation
- [SCHEMA.md](./SCHEMA.md) - Database schema and security rules
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

**External Resources:**

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

**Community:**

- React Native Discord
- Expo Discord
- Stack Overflow (tag: react-native, expo)

## Getting Help

**Development Issues:**

- Check console for error messages
- Search existing GitHub issues
- Ask in team Slack/Discord
- Contact: tech@bclean.app

**Access Issues:**

- Contact: admin@bclean.app

**Business Questions:**

- Contact: business@bclean.app

---

**Welcome to the B.CLEAN development team!**

Last Updated: February 2026
