import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar } from 'react-native-paper';

const LAST_UPDATED = 'April 25, 2026';

export default function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Privacy Policy" />
      </Appbar.Header>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Effective {LAST_UPDATED} • Last Updated {LAST_UPDATED}</Text>

        <Text style={styles.body}>
          This Privacy Policy explains how B.CLEAN ("Company", "we", "us", or "our") collects, uses,
          discloses, and safeguards information in connection with the B.CLEAN mobile application
          and related services (the "App"). By using the App, you acknowledge that you have read
          and understood this Privacy Policy. If you do not agree, do not use the App.
        </Text>

        <Text style={styles.heading}>1. Who We Are</Text>
        <Text style={styles.body}>
          B.CLEAN is a private business based in the State of Idaho, United States. The App is
          operated for use across the United States, including Idaho, Utah, and all other U.S.
          states and territories.{'\n'}
          {'\n'}Email: business@bclean.app
          {'\n'}Website: https://bclean.app
        </Text>

        <Text style={styles.heading}>2. Information We Collect</Text>
        <Text style={styles.body}>
          a) Information you provide: name, email, phone, password (encrypted), profile photo,
          assigned role, and the business data you enter (customers, jobs, schedules, signatures,
          invoices), and any communications you send to support.{'\n'}
          {'\n'}b) Collected automatically: device model, operating system, language, time zone,
          unique device identifiers, mobile network information, crash diagnostics, screens visited,
          features used, IP address, and access times.{'\n'}
          {'\n'}c) With your permission only: precise location, camera and photo library access for
          job photos, calendar access for job entries, contacts you choose to import, and the push
          notification token after you grant notification permission.{'\n'}
          {'\n'}We do NOT knowingly collect Social Security numbers, government ID numbers,
          biometric identifiers, or financial-account credentials from end users.
        </Text>

        <Text style={styles.heading}>3. How We Use Information</Text>
        <Text style={styles.body}>
          To operate, secure, and improve the App; authenticate users; provide scheduling, customer
          management, mapping, and job-tracking features; send transactional and operational
          communications; deliver push notifications you opt into; analyze usage; display and
          frequency-cap advertising (where enabled); comply with legal obligations; and detect and
          prevent fraud or abuse.
        </Text>

        <Text style={styles.heading}>4. How We Share Information</Text>
        <Text style={styles.body}>
          We do NOT sell personal information for monetary consideration. We share information
          only with:{'\n'}
          {'\n'}• Service providers acting under written agreements (cloud hosting, authentication,
          database, file storage, analytics, error monitoring, push delivery, mapping, and — when
          you use payment features — payment processing).
          {'\n'}• Other authorized users within your B.CLEAN-licensed organization, as required for
          the App to function.
          {'\n'}• Authorities, when required by law, subpoena, or court order, or to protect rights,
          users, or public safety.
          {'\n'}• A successor in connection with a merger, acquisition, or sale of assets.
          {'\n'}• Anyone you direct us to share with.{'\n'}
          {'\n'}Current third-party processors include Google/Firebase (auth, database, storage,
          functions, messaging, analytics), Stripe (server-side, only if you use payment features),
          Google Maps Platform, Google AdMob (when enabled), and Expo Application Services.
        </Text>

        <Text style={styles.heading}>5. Advertising and Analytics</Text>
        <Text style={styles.body}>
          When advertising is enabled in your build, the App requests non-personalized ads by
          default. You may opt out of personalized advertising at any time:{'\n'}
          {'\n'}• iOS: Settings → Privacy & Security → Tracking, and Privacy & Security → Apple Advertising.
          {'\n'}• Android: Settings → Google → Ads → "Delete advertising ID" or "Opt out of Ads
          Personalization".
        </Text>

        <Text style={styles.heading}>6. Data Retention</Text>
        <Text style={styles.body}>
          We retain personal information for as long as your account is active and as needed to
          provide the App and comply with applicable law. Business records (customers, jobs,
          invoices) are retained for the life of your subscription and a reasonable period after
          for backup, legal-defense, audit, and tax purposes. You may request earlier deletion at
          any time.
        </Text>

        <Text style={styles.heading}>7. Security</Text>
        <Text style={styles.body}>
          We use industry-standard safeguards including TLS in transit, encryption at rest with our
          cloud providers, role-based access controls, Firestore and Cloud Storage security rules,
          and authenticated API access. No method of transmission or storage is 100% secure, and
          you are responsible for keeping your account credentials confidential.
        </Text>

        <Text style={styles.heading}>8. Children's Privacy</Text>
        <Text style={styles.body}>
          The App is intended for adults in a business setting and is not directed to children
          under 13 (or under 16 in jurisdictions where that higher age applies). We do not
          knowingly collect personal information from children.
        </Text>

        <Text style={styles.heading}>9. Your Privacy Rights (All U.S. States)</Text>
        <Text style={styles.body}>
          We honor verifiable requests from any U.S. resident at the level of protection your
          state requires, regardless of where you live. Your universal rights include:{'\n'}
          {'\n'}• Access — receive a copy of personal information we hold about you.
          {'\n'}• Correction — request correction of inaccurate information.
          {'\n'}• Deletion — request deletion (subject to legal-retention exceptions).
          {'\n'}• Portability — receive a copy in a machine-readable format.
          {'\n'}• Withdraw consent — for permission-based processing (location, camera, contacts,
          calendar, notifications) at any time via device settings.
          {'\n'}• Opt out of advertising personalization — at any time via device settings.
        </Text>

        <Text style={styles.heading}>10. State-Specific Rights</Text>
        <Text style={styles.body}>
          California (CCPA / CPRA), Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah
          (UCPA), Texas (TDPSA), Oregon (OCPA), Montana (MCDPA), Iowa (ICDPA), Tennessee (TIPA),
          Indiana (INCDPA), Delaware (DPDPA), New Hampshire (NHPA), New Jersey (NJDPA), Nebraska
          (NEDPA), Maryland (MODPA), Minnesota (MCDPA), Rhode Island (RIDPA), Kentucky (KCDPA),
          and any other comprehensive state privacy law: you have the right to confirm processing,
          access, correct (where the law provides), delete, port your data, and opt out of sale,
          targeted advertising, and certain forms of profiling. We honor authenticated requests at
          the highest standard required by your state.{'\n'}
          {'\n'}Nevada (SB 220): you may opt out of any future sale of covered information; we do
          not currently sell covered information.{'\n'}
          {'\n'}Illinois BIPA, Washington My Health My Data, and similar specialty laws: we do not
          collect biometric identifiers or consumer health data through the App.
        </Text>

        <Text style={styles.heading}>11. How to Exercise Your Rights</Text>
        <Text style={styles.body}>
          Email business@bclean.app with the subject "Privacy Request" and a description of your
          request. We will verify your identity using the email associated with your account and
          respond within the time required by applicable law (typically 30–45 days, extendable as
          permitted). You will not be discriminated against for exercising any right granted by
          law. If we decline, you may appeal by replying to our response. We will respond within
          60 days, or as your state law requires.
        </Text>

        <Text style={styles.heading}>12. International Users</Text>
        <Text style={styles.body}>
          The App is offered from and intended for use within the United States. If you access it
          from outside the U.S., you understand that your information will be transferred to and
          processed in the United States.
        </Text>

        <Text style={styles.heading}>13. Do Not Track</Text>
        <Text style={styles.body}>
          We treat the iOS App Tracking Transparency response and Android advertising ID opt-out
          as a Do Not Track signal for advertising purposes.
        </Text>

        <Text style={styles.heading}>14. Changes</Text>
        <Text style={styles.body}>
          We may update this Privacy Policy. Material changes will be posted in the App and the
          "Last Updated" date will be revised. If a change materially reduces your rights, we will
          provide additional notice.
        </Text>

        <Text style={styles.heading}>15. Contact</Text>
        <Text style={styles.body}>
          Email: business@bclean.app{'\n'}
          Website: https://bclean.app{'\n'}
          Postal: B.CLEAN, Privacy Office, State of Idaho, USA (full address available on request).
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
