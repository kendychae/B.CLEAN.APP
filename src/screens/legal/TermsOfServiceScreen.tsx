import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar } from 'react-native-paper';

export default function TermsOfServiceScreen({ navigation }: any) {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Terms of Service" />
      </Appbar.Header>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.updated}>Last Updated: April 2026</Text>

        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.body}>
          By downloading, installing, or using the B.CLEAN application ("App"), you agree to be bound
          by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.
          The App is provided by B.CLEAN ("Company", "we", "us", or "our") and is intended for
          authorized business use by B.CLEAN employees and licensed subscribers only.
        </Text>

        <Text style={styles.heading}>2. Subscription and Payment</Text>
        <Text style={styles.body}>
          Access to the App requires an active paid subscription or authorized employee account.
          Subscription fees are billed in accordance with the plan selected at the time of purchase.
          All fees are non-refundable unless otherwise required by applicable law. We reserve the
          right to modify pricing at any time with 30 days' prior notice. Continued use after a price
          change constitutes acceptance of the new pricing.
        </Text>

        <Text style={styles.heading}>3. License Grant</Text>
        <Text style={styles.body}>
          Subject to your compliance with these Terms and payment of all applicable fees, we grant
          you a limited, non-exclusive, non-transferable, revocable license to use the App on devices
          you own or control, solely for your internal business operations. You may not sublicense,
          sell, resell, transfer, assign, distribute, or otherwise commercially exploit or make
          available to any third party the App or any content obtained through the App.
        </Text>

        <Text style={styles.heading}>4. Prohibited Uses</Text>
        <Text style={styles.body}>
          You agree not to:{'\n'}
          {'\n'}• Use the App for any unlawful purpose or in violation of any applicable law
          {'\n'}• Reverse engineer, decompile, disassemble, or attempt to derive the source code
          {'\n'}• Copy, modify, or create derivative works of the App
          {'\n'}• Remove, alter, or obscure any proprietary notices or labels
          {'\n'}• Share your account credentials with unauthorized users
          {'\n'}• Use the App to collect data for competing products or services
          {'\n'}• Attempt to gain unauthorized access to the App or its systems
          {'\n'}• Use the App in any manner that could damage, disable, or impair it
        </Text>

        <Text style={styles.heading}>5. Intellectual Property</Text>
        <Text style={styles.body}>
          The App and all content, features, and functionality (including but not limited to
          information, software, text, displays, images, and design) are owned by B.CLEAN, its
          licensors, or other providers and are protected by United States and international copyright,
          trademark, patent, trade secret, and other intellectual property laws. Nothing in these
          Terms grants you any right, title, or interest in the App except the limited license
          described herein.
        </Text>

        <Text style={styles.heading}>6. User Data and Privacy</Text>
        <Text style={styles.body}>
          Your use of the App is also governed by our Privacy Policy, which is incorporated into
          these Terms by reference. You acknowledge that any data you enter into the App (including
          customer information, job records, and business data) is stored securely using
          industry-standard encryption and access controls. You are responsible for maintaining
          the accuracy and legality of data you input.
        </Text>

        <Text style={styles.heading}>7. Advertising</Text>
        <Text style={styles.body}>
          The App may display advertisements provided by third-party ad networks. These ads are
          designed to be minimally invasive and do not interfere with core App functionality. By using
          the App, you consent to the display of such advertisements. Ad-free plans may be made
          available at our discretion.
        </Text>

        <Text style={styles.heading}>8. Disclaimer of Warranties</Text>
        <Text style={styles.body}>
          THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APP
          WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
        </Text>

        <Text style={styles.heading}>9. Limitation of Liability</Text>
        <Text style={styles.body}>
          IN NO EVENT SHALL B.CLEAN, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR
          AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
          INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE)
          THE APP. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE APP IN THE
          TWELVE (12) MONTHS PRECEDING THE CLAIM.
        </Text>

        <Text style={styles.heading}>10. Indemnification</Text>
        <Text style={styles.body}>
          You agree to defend, indemnify, and hold harmless B.CLEAN and its officers, directors,
          employees, and agents from and against any claims, liabilities, damages, judgments, awards,
          losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or
          relating to your violation of these Terms or your use of the App.
        </Text>

        <Text style={styles.heading}>11. Termination</Text>
        <Text style={styles.body}>
          We may terminate or suspend your account and access to the App immediately, without prior
          notice or liability, for any reason, including without limitation if you breach these Terms.
          Upon termination, your right to use the App will cease immediately. All provisions of these
          Terms which by their nature should survive termination shall survive, including ownership
          provisions, warranty disclaimers, indemnity, and limitations of liability.
        </Text>

        <Text style={styles.heading}>12. Governing Law</Text>
        <Text style={styles.body}>
          These Terms shall be governed by and construed in accordance with the laws of the State of
          Washington, United States, without regard to its conflict of law provisions. Any legal
          action or proceeding arising under these Terms shall be brought exclusively in the courts
          located in the State of Washington.
        </Text>

        <Text style={styles.heading}>13. Changes to Terms</Text>
        <Text style={styles.body}>
          We reserve the right to modify these Terms at any time. We will provide notice of any
          material changes by posting the updated Terms within the App and updating the "Last
          Updated" date. Your continued use of the App after such changes constitutes your acceptance
          of the revised Terms.
        </Text>

        <Text style={styles.heading}>14. Contact Information</Text>
        <Text style={styles.body}>
          For questions about these Terms of Service, please contact us at:{'\n'}
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
