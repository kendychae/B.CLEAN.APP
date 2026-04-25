import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar } from 'react-native-paper';

const LAST_UPDATED = 'April 25, 2026';

export default function TermsOfServiceScreen({ navigation }: any) {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Terms of Service" />
      </Appbar.Header>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.updated}>Effective {LAST_UPDATED} • Last Updated {LAST_UPDATED}</Text>

        <Text style={styles.body}>
          These Terms of Service ("Terms") govern your access to and use of the B.CLEAN mobile
          application and related services (the "App") provided by B.CLEAN ("Company", "we",
          "us", or "our"). By using the App, you agree to these Terms, our Privacy Policy, and
          our End-User License Agreement. These Terms apply across all U.S. states and territories,
          including Idaho and Utah.
        </Text>

        <Text style={styles.heading}>1. Eligibility</Text>
        <Text style={styles.body}>
          You must be at least 18 years old (or the age of majority in your jurisdiction) and able
          to form a binding contract.
        </Text>

        <Text style={styles.heading}>2. Account and Roles</Text>
        <Text style={styles.body}>
          The App provides role-based access (Administrator, Salesperson, Technician). You must
          provide accurate information, keep your credentials confidential, and are responsible
          for activity under your account. Notify us immediately of any unauthorized use.
        </Text>

        <Text style={styles.heading}>3. Subscription and Fees</Text>
        <Text style={styles.body}>
          Access may require an active subscription or authorized account. Fees are non-refundable
          unless required by applicable law. We may change pricing on at least 30 days' notice. If
          you purchase via the Apple App Store or Google Play, that platform's billing, refund,
          and cancellation policies also apply.
        </Text>

        <Text style={styles.heading}>4. License Grant</Text>
        <Text style={styles.body}>
          We grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable
          license to install and use the App on devices you own or control, solely for your
          internal business purposes. All other rights are reserved.
        </Text>

        <Text style={styles.heading}>5. Acceptable Use</Text>
        <Text style={styles.body}>
          You agree not to: (a) use the App unlawfully; (b) reverse engineer or derive source code
          (except to the extent applicable law expressly permits); (c) copy or modify the App;
          (d) sublicense, sell, lease, or commercially exploit it; (e) remove proprietary notices;
          (f) share credentials with unauthorized individuals; (g) use the App to build a competing
          product or scrape data; (h) interfere with the App's security or integrity; (i) attempt
          unauthorized access; or (j) violate the privacy rights of any third party.
        </Text>

        <Text style={styles.heading}>6. Your Data</Text>
        <Text style={styles.body}>
          You retain ownership of the data you submit ("Customer Data"). You grant B.CLEAN a
          worldwide, royalty-free license to host, process, transmit, and display Customer Data
          solely as necessary to operate, secure, and improve the App. You represent that you
          have all rights necessary to provide the Customer Data, that it does not violate any
          law or third-party right, and that your collection and use of personal information
          about your customers complies with applicable privacy laws and any required disclosures
          and consents (including those required for SMS, email, recordings, signatures, and
          photographs).
        </Text>

        <Text style={styles.heading}>7. Intellectual Property</Text>
        <Text style={styles.body}>
          The App and all related software, content, designs, trademarks, logos, and documentation
          are owned by B.CLEAN or its licensors and are protected by copyright, trademark, patent,
          trade secret, and other intellectual-property laws.
        </Text>

        <Text style={styles.heading}>8. Feedback</Text>
        <Text style={styles.body}>
          If you submit suggestions or feedback, you grant B.CLEAN a perpetual, irrevocable,
          royalty-free, worldwide license to use them without obligation to you.
        </Text>

        <Text style={styles.heading}>9. Third-Party Services</Text>
        <Text style={styles.body}>
          The App integrates with third-party services (e.g., Google Firebase, Google Maps,
          Stripe, AdMob, Expo). Your use of those services is subject to their own terms and
          privacy policies, and we are not responsible for them.
        </Text>

        <Text style={styles.heading}>10. Advertising</Text>
        <Text style={styles.body}>
          The App may display advertisements provided by third-party ad networks. By default, the
          App requests only non-personalized ads. We do not endorse any advertised product or
          service.
        </Text>

        <Text style={styles.heading}>11. SMS, Calls, and Email</Text>
        <Text style={styles.body}>
          The App lets you initiate SMS, calls, and email through your device's native apps. YOU
          ARE SOLELY RESPONSIBLE FOR COMPLIANCE WITH THE TELEPHONE CONSUMER PROTECTION ACT (TCPA),
          CAN-SPAM, the Utah Telephone and Facsimile Solicitation Act, and any other applicable
          state or federal law in any state where you operate. You must obtain any required
          consent before sending automated, bulk, or marketing messages.
        </Text>

        <Text style={styles.heading}>12. Disclaimer of Warranties</Text>
        <Text style={styles.body}>
          THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM
          ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APP WILL BE
          UNINTERRUPTED, ERROR-FREE, OR SECURE.
        </Text>

        <Text style={styles.heading}>13. Limitation of Liability</Text>
        <Text style={styles.body}>
          TO THE FULLEST EXTENT PERMITTED BY LAW, B.CLEAN WILL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF
          PROFITS, REVENUE, DATA, BUSINESS, OR GOODWILL. OUR TOTAL CUMULATIVE LIABILITY WILL NOT
          EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING
          THE CLAIM AND (B) ONE HUNDRED DOLLARS ($100). NOTHING LIMITS LIABILITY THAT CANNOT BE
          LIMITED UNDER APPLICABLE LAW.
        </Text>

        <Text style={styles.heading}>14. Indemnification</Text>
        <Text style={styles.body}>
          You agree to defend, indemnify, and hold harmless B.CLEAN and its officers, directors,
          employees, contractors, and agents from any claims, damages, losses, liabilities, costs,
          and expenses (including reasonable attorneys' fees) arising out of or relating to your
          use of the App, your Customer Data, your communications, or your violation of these
          Terms or any law.
        </Text>

        <Text style={styles.heading}>15. Termination</Text>
        <Text style={styles.body}>
          We may suspend or terminate your access at any time for any reason. Sections that by
          their nature should survive termination will survive (including IP, disclaimers,
          limitations of liability, indemnification, and dispute-resolution).
        </Text>

        <Text style={styles.heading}>16. Force Majeure</Text>
        <Text style={styles.body}>
          We are not liable for delays or failures caused by events beyond our reasonable control,
          including natural disasters, war, civil disturbance, labor disputes, government action,
          internet or utility outages, third-party service failures, or pandemics.
        </Text>

        <Text style={styles.heading}>17. Governing Law</Text>
        <Text style={styles.body}>
          These Terms are governed by the laws of the State of Idaho, without regard to its
          conflict-of-laws rules. The Federal Arbitration Act governs Section 18.
        </Text>

        <Text style={styles.heading}>18. Binding Arbitration; Class Waiver</Text>
        <Text style={styles.body}>
          PLEASE READ CAREFULLY — THIS AFFECTS YOUR LEGAL RIGHTS.{'\n'}
          {'\n'}(a) Informal resolution: before filing a claim, the parties will attempt to resolve
          the dispute informally for at least 30 days by emailing business@bclean.app.{'\n'}
          {'\n'}(b) Binding arbitration: any unresolved dispute will be resolved by binding
          individual arbitration administered by the American Arbitration Association under its
          Consumer Arbitration Rules, except for individual small-claims-court actions. Arbitration
          will be in Ada County, Idaho, or — at your election — in your home county within the
          U.S., or by telephone or video.{'\n'}
          {'\n'}(c) Class action waiver: claims must be brought only individually and not as part
          of any class, collective, consolidated, or representative action.{'\n'}
          {'\n'}(d) 30-day opt-out: you may opt out of this arbitration agreement by emailing
          business@bclean.app with subject "Arbitration Opt-Out" within 30 days of first accepting
          these Terms.{'\n'}
          {'\n'}(e) Carve-outs: either party may seek injunctive relief in court for IP infringement
          or unauthorized access to the App.{'\n'}
          {'\n'}(f) If the class waiver is unenforceable for a particular claim, that claim will
          proceed in court but the rest of Section 18 still applies.
        </Text>

        <Text style={styles.heading}>19. Venue</Text>
        <Text style={styles.body}>
          For any non-arbitrable claim, the parties consent to the exclusive jurisdiction and
          venue of the state and federal courts located in Ada County, Idaho, and waive any
          objection based on inconvenient forum.
        </Text>

        <Text style={styles.heading}>20. Apple App Store Terms</Text>
        <Text style={styles.body}>
          If you obtained the App via the Apple App Store: these Terms are between you and
          B.CLEAN, not Apple; Apple is not responsible for the App; the license is limited to use
          on Apple-branded products you own or control consistent with the Usage Rules in Apple's
          Media Services Terms; Apple has no maintenance or support obligations; in the event of
          a warranty failure, Apple may refund the price (if any) and has no other warranty
          obligation; B.CLEAN is responsible for product-liability, legal-compliance, and
          consumer-protection claims and IP-infringement claims; you represent that you are not
          located in an embargoed country or on a U.S. prohibited-parties list; and Apple and its
          subsidiaries are third-party beneficiaries of these Terms.
        </Text>

        <Text style={styles.heading}>21. Google Play Terms</Text>
        <Text style={styles.body}>
          If you obtained the App via Google Play, the App is also subject to Google's Google Play
          Terms of Service and Developer Distribution Agreement, and Google is not a party to
          these Terms.
        </Text>

        <Text style={styles.heading}>22. U.S. Government Users</Text>
        <Text style={styles.body}>
          The App is "Commercial Computer Software" and "Commercial Computer Software
          Documentation" under 48 C.F.R. 12.212. Any U.S. Government use is governed solely by
          these Terms.
        </Text>

        <Text style={styles.heading}>23. Export Control</Text>
        <Text style={styles.body}>
          You may not export, re-export, or transfer the App in violation of any applicable U.S.
          export control law.
        </Text>

        <Text style={styles.heading}>24. No Professional Advice</Text>
        <Text style={styles.body}>
          The App provides operational tools for cleaning-service businesses. It does not provide
          legal, tax, accounting, financial, medical, or other professional advice.
        </Text>

        <Text style={styles.heading}>25. Modifications</Text>
        <Text style={styles.body}>
          We may modify these Terms. Material changes will be posted in the App, and the "Last
          Updated" date will be revised. Continued use after the effective date of a change
          constitutes acceptance.
        </Text>

        <Text style={styles.heading}>26. General</Text>
        <Text style={styles.body}>
          If any provision is held unenforceable, the rest remain in force. Failure to enforce a
          provision is not a waiver. You may not assign these Terms without our prior written
          consent; we may assign in a merger, acquisition, or asset sale. These Terms, together
          with the Privacy Policy and EULA, are the entire agreement.
        </Text>

        <Text style={styles.heading}>27. Contact</Text>
        <Text style={styles.body}>
          Email: business@bclean.app{'\n'}
          Website: https://bclean.app
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
