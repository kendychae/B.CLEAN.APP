# B.CLEAN Deployment Guide

## Production Deployment Checklist

### 1. Environment Configuration

#### Firebase Setup

1. Create production Firebase project
2. Enable required services:
   - Authentication (Email/Password)
   - Cloud Firestore
   - Cloud Storage
   - Cloud Messaging
   - Cloud Functions
3. Configure authentication providers
4. Set up Firestore indexes (see SCHEMA.md)
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

#### Stripe Configuration

1. Create Stripe production account
2. Complete business verification
3. Enable payment methods
4. Get production API keys
5. Configure webhook endpoints

#### Google Cloud Platform

1. Enable Maps SDK for iOS
2. Enable Maps SDK for Android
3. Create and restrict API keys
4. Set up billing alerts

### 2. App Configuration

#### Update app.json

```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.bclean.windowwashing",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.bclean.windowwashing",
      "versionCode": 1
    }
  }
}
```

#### Configure Environment Variables

Create production `.env` file with:

- Production Firebase credentials
- Production Stripe keys
- Production API URLs
- Google Maps API keys

### 3. Code Quality Checks

Run the following before building:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Tests (if implemented)
npm test
```

### 4. Build Process

#### iOS Build

1. **Prepare certificates:**

   ```bash
   eas credentials
   ```

2. **Configure build profile in eas.json:**

   ```json
   {
     "build": {
       "production": {
         "ios": {
           "resourceClass": "m-medium"
         }
       }
     }
   }
   ```

3. **Start build:**

   ```bash
   eas build --platform ios --profile production
   ```

4. **Download IPA when complete**

#### Android Build

1. **Configure signing:**

   ```bash
   eas credentials
   ```

2. **Start build:**

   ```bash
   eas build --platform android --profile production
   ```

3. **Download AAB when complete**

### 5. Cloud Functions Deployment

1. **Install dependencies:**

   ```bash
   cd functions
   npm install
   ```

2. **Configure Stripe key:**

   ```bash
   firebase functions:config:set stripe.secret_key="sk_live_..."
   ```

3. **Deploy functions:**

   ```bash
   firebase deploy --only functions
   ```

4. **Verify deployment:**
   ```bash
   firebase functions:log
   ```

### 6. App Store Submission

#### Apple App Store

1. **App Store Connect setup:**
   - Create new app
   - Set bundle identifier
   - Upload screenshots (required sizes: 6.5", 5.5")
   - Write app description
   - Set pricing and availability
   - Complete privacy questionnaire
   - Add privacy policy URL

2. **Upload build:**

   ```bash
   eas submit --platform ios
   ```

   Or upload manually through Transporter app

3. **TestFlight testing:**
   - Add internal testers
   - Conduct thorough testing
   - Fix any issues

4. **Submit for review:**
   - Answer App Store review questions
   - Provide demo account if needed
   - Submit

5. **Post-submission:**
   - Monitor review status
   - Respond to any reviewer questions promptly
   - Typical review time: 24-48 hours

#### Google Play Store

1. **Play Console setup:**
   - Create new app
   - Set package name
   - Upload screenshots (phone, tablet, 7", 10")
   - Write store listing
   - Set content rating
   - Complete data safety form
   - Add privacy policy URL

2. **Upload build:**

   ```bash
   eas submit --platform android
   ```

   Or upload manually through Play Console

3. **Internal testing track:**
   - Add internal testers
   - Test thoroughly
   - Check pre-launch report

4. **Production release:**
   - Promote to production
   - Set rollout percentage (start with 10-20%)
   - Monitor crash reports

5. **Post-release:**
   - Monitor ratings and reviews
   - Respond to user feedback
   - Gradual rollout to 100%

### 7. Monitoring & Analytics

#### Firebase Crashlytics

```bash
# Add Crashlytics to project
expo install expo-firebase-crashlytics
```

#### Performance Monitoring

- Enable Firebase Performance Monitoring
- Set up custom traces for critical paths
- Monitor app start time
- Track network request performance

#### Analytics Setup

- Configure Firebase Analytics events
- Set up conversion tracking
- Create custom dashboards
- Set up alerts for critical metrics

### 8. Post-Launch

#### Immediate Actions

- [ ] Monitor crash reports
- [ ] Check performance metrics
- [ ] Review initial user feedback
- [ ] Verify payment processing
- [ ] Test push notifications in production
- [ ] Confirm email/SMS delivery

#### First Week

- [ ] Analyze user behavior patterns
- [ ] Identify common user flows
- [ ] Address critical bugs
- [ ] Optimize slow operations
- [ ] Review analytics data

#### Ongoing Maintenance

- [ ] Weekly crash report review
- [ ] Monthly performance analysis
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Feature iteration based on feedback

### 9. Update Process

#### Preparing Updates

1. **Increment version:**
   - Update `version` in app.json
   - Update iOS `buildNumber`
   - Update Android `versionCode`

2. **Generate changelog:**

   ```markdown
   ## Version 1.1.0

   ### New Features

   - Feature description

   ### Improvements

   - Improvement description

   ### Bug Fixes

   - Bug fix description
   ```

3. **Build and test:**

   ```bash
   eas build --platform all --profile production
   ```

4. **Submit update:**
   ```bash
   eas submit --platform all
   ```

#### Release Notes Best Practices

- Be specific about changes
- Highlight user-facing improvements
- Acknowledge bug fixes
- Keep tone professional
- Maximum 4000 characters for App Store
- Maximum 500 characters for Play Store "What's New"

### 10. Rollback Procedure

#### iOS Rollback

- Remove current version from sale
- Previous version remains available
- Users can't downgrade
- Push critical fix as new version

#### Android Rollback

- Use Play Console rollback feature
- Select previous version
- Affects new installs only
- Existing users require new update

### 11. Security Considerations

#### Pre-Launch Security Audit

- [ ] Review all Firebase security rules
- [ ] Audit API key restrictions
- [ ] Verify HTTPS endpoints
- [ ] Check for hardcoded secrets
- [ ] Review authentication flows
- [ ] Test permission boundaries

#### Ongoing Security

- [ ] Regular dependency updates
- [ ] Monitor security advisories
- [ ] Rotate API keys periodically
- [ ] Review access logs
- [ ] Conduct penetration testing
- [ ] Maintain incident response plan

---

## Emergency Procedures

### Critical Bug Found

1. Assess severity and impact
2. Remove app from stores if necessary
3. Develop and test fix
4. Submit expedited review (if supported)
5. Communicate with affected users

### Security Breach

1. Immediately rotate compromised credentials
2. Assess scope of breach
3. Notify affected users if required by law
4. Document incident
5. Implement additional security measures
6. Review and update security protocols

### Service Outage

1. Check Firebase status
2. Verify third-party service status
3. Review Cloud Functions logs
4. Check Stripe status
5. Enable maintenance mode if needed
6. Communicate status to users

---

## Support Resources

- **Firebase Console:** https://console.firebase.google.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console
- **EAS Documentation:** https://docs.expo.dev/eas

---

**Last Updated:** February 2026  
**Maintained By:** B.CLEAN Development Team
