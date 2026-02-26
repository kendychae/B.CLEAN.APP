# B.CLEAN

**Window Washing Operations & Sales Suite**

A production-grade cross-platform mobile application designed for window washing businesses to streamline operations, sales, scheduling, and customer management.

---

## Project Overview

B.CLEAN is an enterprise-level mobile application built for the window washing and exterior cleaning industry, developed by B Clean 4 Step Window Washing LLC. The platform provides comprehensive tools for business owners, sales teams, and field technicians to manage every aspect of their operations from a unified mobile interface.

The application addresses critical operational challenges including scheduling conflicts, sales territory management, payment processing, customer relationship management, and field documentation. Built with scalability and security as foundational principles, B.CLEAN is designed to support growing businesses from single-operator services to multi-location enterprises.

**Official Website:** https://kendychae.github.io/B-CLEAN/

**Target Platforms:**

- iOS (Apple App Store)
- Android (Google Play Store)

**Use Cases:**

- Window washing companies
- Pressure washing services
- Exterior cleaning businesses
- Mobile service operations

---

## Features

### Operations Management

- **Intelligent Scheduling Engine** - Book jobs with real-time availability checking and conflict prevention
- **Calendar Integration** - Automatic sync with Google Calendar and Apple iCal
- **Job Tracking** - Real-time status updates from scheduling through completion
- **Team Management** - Role-based access control with three permission tiers
- **Availability Management** - Employees can mark unavailable time slots or full-day absences

### Sales & Lead Tracking

- **Live Territory Map** - Real-time pin updates visible across entire sales team
- **Lead Management** - Drop pins for prospects, customers, and do-not-contact addresses
- **Territory Protection** - Prevent duplicate contact with synchronized DNC marking
- **Customer Acquisition** - Convert map pins directly into customer profiles
- **Field Data Capture** - Add customers and schedule jobs from anywhere

### Technician Tools

- **Job Dashboard** - View assigned jobs with all relevant details
- **GPS Navigation** - One-tap directions to job locations via native maps
- **Photo Documentation** - Capture and upload before/after photos with automatic compression
- **Digital Signatures** - Collect customer signatures on device
- **Job Completion** - Mark jobs complete and trigger automated follow-up workflows

### Customer Relationship Management

- **Comprehensive Customer Profiles** - Contact information, service history, and lifetime value tracking
- **Advanced Search & Filtering** - Find customers by name, zip code, technician, or service date
- **Service History** - Complete audit trail of all jobs with attached documentation
- **Revenue Analytics** - Track per-customer profitability and total lifetime value
- **Notes & Documentation** - Maintain detailed customer records accessible to authorized team members

### Payments & Invoicing

- **Stripe Integration** - Secure payment processing with PCI compliance
- **Digital Invoicing** - Generate professional PDF invoices
- **Payment Status Tracking** - Real-time visibility into paid, unpaid, and pending transactions
- **Multiple Delivery Methods** - Send invoices via SMS or email
- **Payment History** - Complete transaction records for accounting and tax purposes

### Communication & Automation

- **Push Notifications** - Automated reminders for upcoming jobs
- **Group SMS** - Bulk messaging to filtered customer segments
- **Review Automation** - Automatic review request delivery after job completion
- **Email Integration** - Send invoices and communications directly from app
- **Phone Integration** - One-tap calling to customers or team members

### Security & Permissions

- **Role-Based Access Control (RBAC)** - Three-tier permission system (Admin, Salesperson, Technician)
- **Firebase Security Rules** - Server-side enforcement of all access permissions
- **Encrypted Data Storage** - All customer and business data encrypted at rest
- **Secure Authentication** - Firebase Authentication with industry-standard security
- **Audit Logging** - Track all critical actions for compliance and security review

---

## Tech Stack

### Frontend

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and build toolchain
- **TypeScript** - Type-safe code for reliability and maintainability
- **React Navigation** - Native navigation patterns for iOS and Android
- **React Native Paper** - Material Design component library
- **React Native Maps** - Native map implementation

### Backend

- **Firebase Authentication** - User authentication and session management
- **Cloud Firestore** - NoSQL database with real-time synchronization
- **Firebase Storage** - Secure cloud storage for photos and documents
- **Firebase Cloud Functions** - Serverless backend logic
- **Firebase Cloud Messaging** - Push notification delivery

### Third-Party Services

- **Stripe** - Payment processing and invoicing
- **Google Maps SDK** - Mapping and geocoding services
- **Expo Location** - GPS and location services
- **Expo Camera** - Photo capture functionality
- **Expo Calendar** - Calendar integration

### Architecture

The application follows clean architecture principles with clear separation of concerns:

- **Presentation Layer** - React Native screens and components
- **Business Logic Layer** - Context providers and custom hooks
- **Data Layer** - Firebase services and API integrations
- **Security Layer** - Firestore rules and authentication middleware

---

## Security & Compliance

### Data Security

- All data transmission occurs over encrypted HTTPS connections
- Customer data stored in Firebase Cloud Firestore with encryption at rest
- Photo and document storage secured through Firebase Storage with access control rules
- Payment information processed exclusively through Stripe's PCI-compliant infrastructure
- No credit card data stored on device or in application database

### Access Control

- **Three-Tier RBAC System:**
  - **Admin:** Full system access including user management, analytics, and financial data
  - **Salesperson:** Customer and job management with restricted access to sensitive data
  - **Technician:** Limited to assigned jobs and field documentation
- Permissions enforced at both application and database levels
- Server-side security rules prevent unauthorized data access regardless of client manipulation

### Privacy

- Customer data used exclusively for business operations
- No data sharing with third parties except payment processor (Stripe)
- Users can request data deletion in compliance with privacy regulations
- Location data collected only during active app usage with explicit user permission

### Compliance Notes

- This application is not HIPAA compliant and should not be used for healthcare-related services
- This application is not SOC 2 certified
- Users are responsible for compliance with local laws regarding SMS marketing and data privacy
- Application implements industry best practices but users must ensure compliance with their specific regulatory requirements

---

## Legal Protection

### Intellectual Property Notice

All code, designs, assets, and documentation contained in this repository are proprietary and confidential. This includes but is not limited to:

- Source code and compiled binaries
- User interface designs and layouts
- Database schemas and architecture
- Business logic and algorithms
- Documentation and specifications

**Unauthorized copying, modification, distribution, or commercial use of any materials in this repository is strictly prohibited.**

© 2026 B Clean 4 Step Window Washing LLC. All Rights Reserved.

### License

**Proprietary Software - All Rights Reserved**

This repository and its contents are NOT open-source software. The code is made available for reference purposes only under the following restrictions:

- No license is granted for use, modification, or distribution
- You may not use this code for commercial purposes
- You may not create derivative works
- You may not distribute or sublicense this code
- Reading the code for educational purposes does not grant any usage rights

Written permission from B Clean 4 Step Window Washing LLC is required for any use beyond viewing. For licensing inquiries, contact the business development team.

### Disclaimer

**THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND**

B Clean 4 Step Window Washing LLC makes no guarantees, representations, or warranties regarding:

- Fitness for any particular purpose
- Merchantability or quality
- Accuracy of calculations or data
- Availability or uptime
- Business results or revenue generation

**Limitation of Liability:**

- B Clean 4 Step Window Washing LLC shall not be liable for any direct, indirect, incidental, or consequential damages
- Users assume all risk associated with use of this software
- No guarantee of App Store approval or ongoing availability
- Not responsible for data loss, business interruption, or financial losses

**User Responsibilities:**

- Users must comply with all applicable local, state, and federal laws
- SMS marketing features require compliance with TCPA and CAN-SPAM regulations
- Users are responsible for obtaining proper consent before sending marketing messages
- Location tracking features require compliance with privacy laws in user's jurisdiction
- Tax and financial reporting is the user's responsibility

---

## Development Setup

### Prerequisites

Before beginning development, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **Yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **EAS CLI** (`npm install -g eas-cli`)
- **iOS Development:** Xcode 14+ (macOS only)
- **Android Development:** Android Studio with SDK 33+
- **Firebase Account** with project created
- **Stripe Account** with API keys
- **Google Cloud Account** for Maps API

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kendychae/B.CLEAN.APP.git
   cd B.CLEAN.APP
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   - Firebase credentials
   - Stripe API keys
   - Google Maps API keys

4. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication, Firestore, Storage, and Cloud Messaging
   - Download configuration files
   - Add your Firebase config to `.env`

5. **Deploy Firestore security rules:**

   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

6. **Set up Stripe:**
   - Create a Stripe account at https://stripe.com
   - Get your API keys from the dashboard
   - Add keys to `.env` and Cloud Functions configuration

### Running Locally

**Start the development server:**

```bash
npm start
```

**Run on iOS simulator:**

```bash
npm run ios
```

**Run on Android emulator:**

```bash
npm run android
```

**Run in web browser (limited functionality):**

```bash
npm run web
```

### Building for Production

**Configure EAS Build:**

```bash
eas login
eas build:configure
```

**Build for iOS:**

```bash
npm run build:ios
```

**Build for Android:**

```bash
npm run build:android
```

**Build for both platforms:**

```bash
npm run build:all
```

### Deployment

**Deploy Cloud Functions:**

```bash
cd functions
npm install
firebase deploy --only functions
```

**Submit to Apple App Store:**

```bash
npm run submit:ios
```

**Submit to Google Play Store:**

```bash
npm run submit:android
```

For detailed submission instructions, refer to `DEPLOYMENT.md`.

---

## Roadmap

### Phase 1 (Current)

- Core scheduling and job management
- Customer CRM functionality
- Sales mapping system
- Payment processing
- Photo documentation

### Phase 2 (Q2 2026)

- Advanced analytics dashboard with revenue forecasting
- Route optimization using AI/ML algorithms
- Native chat functionality for team communication
- Offline mode with local data persistence
- Recurring job automation

### Phase 3 (Q3 2026)

- Multi-location support for franchise operations
- Web-based admin portal for desktop management
- Customer self-service portal
- Integration with QuickBooks and accounting software
- Automated marketing campaigns

### Phase 4 (Q4 2026)

- Subscription-based pricing tiers (Basic, Professional, Enterprise)
- White-label solution for resellers
- API for third-party integrations
- Equipment tracking and maintenance scheduling
- Enhanced business intelligence and reporting

---

## App Store Submission Checklists

### Apple App Store Requirements

**Pre-Submission:**

- [ ] App Store Connect account created
- [ ] Apple Developer Program enrollment ($99/year)
- [ ] App icons and screenshots prepared (all required sizes)
- [ ] Privacy policy URL added to app metadata
- [ ] App Store description and keywords optimized
- [ ] Age rating questionnaire completed
- [ ] Export compliance information provided

**Technical Requirements:**

- [ ] Build signed with distribution certificate
- [ ] All privacy permissions have usage descriptions
- [ ] App tested on multiple iOS device sizes
- [ ] No crashes or critical bugs in production build
- [ ] Performance optimization complete
- [ ] Push notifications properly configured

**Content Requirements:**

- [ ] App name does not infringe trademarks
- [ ] No placeholder content or lorem ipsum text
- [ ] All features functional and accessible
- [ ] In-app purchases configured (if applicable)
- [ ] Accurate app description and screenshots

### Google Play Store Requirements

**Pre-Submission:**

- [ ] Google Play Console account created ($25 one-time fee)
- [ ] App signing key generated
- [ ] Store listing content prepared
- [ ] Privacy policy hosted and linked
- [ ] Content rating completed through IARC
- [ ] Target API level meets current requirements

**Technical Requirements:**

- [ ] APK or App Bundle signed and uploaded
- [ ] All required permissions declared in manifest
- [ ] App tested on multiple Android devices and OS versions
- [ ] No crashes detected in pre-launch report
- [ ] 64-bit architecture support included
- [ ] Proper handling of configuration changes

**Content Requirements:**

- [ ] Feature graphic and promotional materials uploaded
- [ ] Accurate categorization selected
- [ ] Complete description with proper formatting
- [ ] Contact information and support resources provided
- [ ] Data safety form completed

---

## Documentation

- **[Schema Documentation](./SCHEMA.md)** - Complete database structure and Firestore rules
- **[API Documentation](./API.md)** - Cloud Functions API reference (to be created)
- **[Deployment Guide](./DEPLOYMENT.md)** - Step-by-step production deployment (to be created)
- **[Contributing Guidelines](./CONTRIBUTING.md)** - For authorized contributors only (to be created)

---

## Support & Contact

### Business Inquiries

For licensing, partnership opportunities, or enterprise solutions:

**Email:** dbingsbusiness@gmail.com  
**Website:** https://kendychae.github.io/B-CLEAN/

### Technical Support

For technical issues or implementation questions from authorized parties:

**Email:** dbingsbusiness@gmail.com  
**Documentation:** Refer to inline code documentation and schema reference

---

## Acknowledgments

Built with industry-leading technologies:

- React Native and Expo development framework
- Firebase platform for backend infrastructure
- Stripe for secure payment processing
- Google Maps for location services

---

**B.CLEAN** - Professional Window Washing Operations Software  
© 2026 B Clean 4 Step Window Washing LLC. All Rights Reserved.  
**Website:** https://kendychae.github.io/B-CLEAN/
