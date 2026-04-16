import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar } from 'react-native-paper';

export default function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Privacy Policy" />
      </Appbar.Header>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last Updated: April 2026</Text>

        <Text style={styles.heading}>1. Introduction</Text>
        <Text style={styles.body}>
          B.CLEAN ("Company", "we", "us", or "our") is committed to protecting the privacy of our
          users. This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you use our mobile application ("App"). Please read this Privacy Policy
          carefully. By using the App, you consent to the practices described in this policy.
        </Text>

        <Text style={styles.heading}>2. Information We Collect</Text>
        <Text style={styles.body}>
          We collect information you provide directly, including:{'\n'}
          {'\n'}• Account information (name, email address, phone number)
          {'\n'}• Business data (customer records, job details, scheduling information)
          {'\n'}• Location data (with your permission, for mapping and navigation features)
          {'\n'}• Photos (with your permission, for job documentation)
          {'\n'}• Device information (device type, operating system, unique identifiers)
          {'\n'}• Usage data (how you interact with the App)
        </Text>

        <Text style={styles.heading}>3. How We Use Your Information</Text>
        <Text style={styles.body}>
          We use the collected information to:{'\n'}
          {'\n'}• Provide, maintain, and improve the App
          {'\n'}• Process transactions and send related information
          {'\n'}• Send push notifications (with your consent)
          {'\n'}• Provide customer support
          {'\n'}• Monitor and analyze usage patterns
          {'\n'}• Display relevant advertisements
          {'\n'}• Protect against fraudulent or unauthorized activity
        </Text>

        <Text style={styles.heading}>4. Third-Party Services</Text>
        <Text style={styles.body}>
          We use the following third-party services that may collect information:{'\n'}
          {'\n'}• Firebase (Google) — authentication, database, storage, and analytics
          {'\n'}• Stripe — payment processing (we do not store credit card numbers)
          {'\n'}• Google Maps — location and mapping services
          {'\n'}• Google AdMob — advertising services
          {'\n'}• Expo — push notification delivery
          {'\n'}
          {'\n'}Each third-party service has its own privacy policy governing the use of your
          information. We encourage you to review their privacy policies.
        </Text>

        <Text style={styles.heading}>5. Advertising</Text>
        <Text style={styles.body}>
          The App uses Google AdMob to display advertisements. AdMob may use cookies, device
          identifiers, and similar technologies to serve ads and measure their effectiveness.
          You may opt out of personalized advertising through your device settings:{'\n'}
          {'\n'}• iOS: Settings → Privacy → Apple Advertising → turn off Personalized Ads
          {'\n'}• Android: Settings → Google → Ads → Opt out of Ads Personalization
        </Text>

        <Text style={styles.heading}>6. Data Security</Text>
        <Text style={styles.body}>
          We implement industry-standard security measures to protect your information, including:{'\n'}
          {'\n'}• Encryption in transit (TLS/SSL)
          {'\n'}• Encryption at rest (Firebase server-side encryption)
          {'\n'}• Role-based access controls
          {'\n'}• Secure authentication via Firebase Auth
          {'\n'}
          {'\n'}However, no method of electronic transmission or storage is 100% secure, and we
          cannot guarantee absolute security.
        </Text>

        <Text style={styles.heading}>7. Data Retention</Text>
        <Text style={styles.body}>
          We retain your personal information for as long as your account is active or as needed to
          provide services. Business data (customer records, job history) is retained as long as
          necessary for legitimate business purposes. You may request deletion of your account and
          associated data by contacting us.
        </Text>

        <Text style={styles.heading}>8. Your Rights</Text>
        <Text style={styles.body}>
          Depending on your location, you may have the following rights:{'\n'}
          {'\n'}• Access: Request a copy of the personal information we hold about you
          {'\n'}• Correction: Request correction of inaccurate information
          {'\n'}• Deletion: Request deletion of your personal information
          {'\n'}• Portability: Request a copy of your data in a portable format
          {'\n'}• Opt-Out: Opt out of personalized advertising
          {'\n'}
          {'\n'}To exercise any of these rights, contact us at business@bclean.app.
        </Text>

        <Text style={styles.heading}>9. Children's Privacy</Text>
        <Text style={styles.body}>
          The App is not intended for use by children under the age of 13. We do not knowingly
          collect personal information from children under 13. If we discover that a child under 13
          has provided us with personal information, we will delete it immediately.
        </Text>

        <Text style={styles.heading}>10. California Privacy Rights (CCPA)</Text>
        <Text style={styles.body}>
          If you are a California resident, you have the right to request disclosure of what
          personal information we collect, use, and disclose. You also have the right to request
          deletion of your personal information. We will not discriminate against you for exercising
          these rights.
        </Text>

        <Text style={styles.heading}>11. Changes to This Policy</Text>
        <Text style={styles.body}>
          We may update this Privacy Policy from time to time. We will notify you of material
          changes by posting the updated policy within the App and updating the "Last Updated" date.
          Your continued use of the App after any changes constitutes acceptance of the revised
          Privacy Policy.
        </Text>

        <Text style={styles.heading}>12. Contact Us</Text>
        <Text style={styles.body}>
          If you have questions or concerns about this Privacy Policy, please contact us at:{'\n'}
          {'\n'}Email: business@bclean.app
          {'\n'}Website: https://bclean.app
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  updated: { fontSize: 13, color: '#8E8E93', marginBottom: 24 },
  heading: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginTop: 20, marginBottom: 8 },
  body: { fontSize: 15, color: '#3C3C43', lineHeight: 22 },
});
