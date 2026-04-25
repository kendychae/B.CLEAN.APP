import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar } from 'react-native-paper';

const LAST_UPDATED = 'April 25, 2026';

export default function EULAScreen({ navigation }: any) {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="License Agreement" />
      </Appbar.Header>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>End-User License Agreement</Text>
        <Text style={styles.updated}>Effective {LAST_UPDATED} • Last Updated {LAST_UPDATED}</Text>

        <Text style={styles.heading}>IMPORTANT — READ CAREFULLY</Text>
        <Text style={styles.body}>
          This End-User License Agreement ("EULA") is a legal agreement between you ("User") and
          B.CLEAN ("Licensor") for use of the B.CLEAN mobile application ("Software"). By
          installing or using the Software, you agree to this EULA. If you do not agree, do not
          install or use the Software. This EULA is enforceable in all U.S. states and territories,
          including Idaho and Utah.
        </Text>

        <Text style={styles.heading}>1. License Grant</Text>
        <Text style={styles.body}>
          Subject to this EULA and payment of any applicable subscription fees, Licensor grants
          you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to
          download, install, and use the Software on devices you own or control, solely for your
          personal or internal business purposes.
        </Text>

        <Text style={styles.heading}>2. License Restrictions</Text>
        <Text style={styles.body}>
          You shall not:{'\n'}
          {'\n'}(a) copy, modify, or distribute the Software;
          {'\n'}(b) reverse engineer, decompile, or disassemble it (except to the extent applicable
          law expressly permits);
          {'\n'}(c) rent, lease, lend, sell, sublicense, or transfer it;
          {'\n'}(d) make it available on any file-sharing or hosting service;
          {'\n'}(e) remove proprietary notices;
          {'\n'}(f) use it to develop a competing product;
          {'\n'}(g) use it for any unlawful purpose;
          {'\n'}(h) share credentials with unauthorized users;
          {'\n'}(i) use automated systems (bots, scrapers) to access it.
        </Text>

        <Text style={styles.heading}>3. Subscription and Fees</Text>
        <Text style={styles.body}>
          Use of the Software may require an active, paid subscription billed on a recurring basis
          as agreed at purchase. Failure to maintain an active subscription may result in
          suspension. All fees are non-refundable except as required by applicable law. If you
          purchased via Apple or Google, that platform's billing, refund, and cancellation
          policies also apply.
        </Text>

        <Text style={styles.heading}>4. Intellectual Property</Text>
        <Text style={styles.body}>
          The Software is protected by copyright, trade secret, and other IP laws. Licensor
          retains all right, title, and interest in the Software. This EULA conveys no interest
          other than the limited license expressly granted.
        </Text>

        <Text style={styles.heading}>5. Data Collection and Privacy</Text>
        <Text style={styles.body}>
          The Software collects data as described in our Privacy Policy. By using the Software,
          you consent to such collection and use. Licensor will handle all personal data in
          accordance with applicable privacy laws and the Privacy Policy.
        </Text>

        <Text style={styles.heading}>6. Third-Party Content and Advertising</Text>
        <Text style={styles.body}>
          The Software may display advertisements from third-party ad networks. Such ads are
          provided "as is" and Licensor makes no representations regarding third-party content.
        </Text>

        <Text style={styles.heading}>7. Disclaimer of Warranties</Text>
        <Text style={styles.body}>
          THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
          INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, TITLE, AND NON-INFRINGEMENT. LICENSOR DOES NOT WARRANT THAT THE SOFTWARE WILL
          BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
        </Text>

        <Text style={styles.heading}>8. Limitation of Liability</Text>
        <Text style={styles.body}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY
          SPECIAL, INCIDENTAL, INDIRECT, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES (INCLUDING
          LOSS OF PROFITS, BUSINESS INTERRUPTION, OR LOSS OF INFORMATION). LICENSOR'S TOTAL
          LIABILITY WILL NOT EXCEED THE GREATER OF THE FEES YOU PAID IN THE TWELVE (12) MONTHS
          PRECEDING THE CLAIM AND ONE HUNDRED DOLLARS ($100).
        </Text>

        <Text style={styles.heading}>9. Indemnification</Text>
        <Text style={styles.body}>
          You agree to defend, indemnify, and hold harmless Licensor from any claim arising out
          of or relating to your use of the Software, your data, or your breach of this EULA or
          any law.
        </Text>

        <Text style={styles.heading}>10. Termination</Text>
        <Text style={styles.body}>
          This EULA is effective until terminated. It terminates automatically if you fail to
          comply with any term. Licensor may also terminate at any time without notice. Upon
          termination, you must cease all use and destroy all copies. Sections 2, 4, 7, 8, 9, 11,
          and 12 survive termination.
        </Text>

        <Text style={styles.heading}>11. Governing Law; Dispute Resolution</Text>
        <Text style={styles.body}>
          This EULA is governed by the laws of the State of Idaho, without regard to conflict-of-
          laws rules. Any dispute will be resolved as described in the Terms of Service Section 18
          (binding individual arbitration in Ada County, Idaho, or your home county within the
          U.S., with class-action waiver and a 30-day opt-out). For non-arbitrable claims, the
          parties consent to the exclusive jurisdiction of the state and federal courts located
          in Ada County, Idaho.
        </Text>

        <Text style={styles.heading}>12. Apple App Store Terms</Text>
        <Text style={styles.body}>
          If you obtained the Software via the Apple App Store: this EULA is between you and
          Licensor only, not Apple; Apple is not responsible for the Software; the license is
          limited to use on Apple-branded products you own or control consistent with the Usage
          Rules in the Apple Media Services Terms; Apple has no maintenance or support obligations;
          in the event of a warranty failure, you may notify Apple, and Apple may refund the price
          (if any), with no other warranty obligation; Licensor (not Apple) is responsible for
          product-liability, legal-compliance, consumer-protection, and IP-infringement claims;
          you represent that you are not in an embargoed country or on any U.S. prohibited-parties
          list; and Apple and its subsidiaries are third-party beneficiaries of this EULA.
        </Text>

        <Text style={styles.heading}>13. U.S. Government End Users</Text>
        <Text style={styles.body}>
          The Software is "Commercial Computer Software" and "Commercial Computer Software
          Documentation" under 48 C.F.R. 12.212. Any U.S. Government use is governed solely by
          this EULA.
        </Text>

        <Text style={styles.heading}>14. Severability; Entire Agreement</Text>
        <Text style={styles.body}>
          If any provision is unenforceable, the remainder remains in force. This EULA, together
          with the Terms of Service and Privacy Policy, is the entire agreement between you and
          Licensor regarding the Software and supersedes all prior agreements on the same subject.
        </Text>

        <Text style={styles.heading}>15. Contact</Text>
        <Text style={styles.body}>
          B.CLEAN{'\n'}
          Email: business@bclean.app{'\n'}
          Website: https://bclean.app
        </Text>

        <Text style={[styles.body, { marginTop: 24, fontWeight: '600' }]}>
          BY INSTALLING OR USING THE SOFTWARE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD,
          AND AGREE TO BE BOUND BY THE TERMS OF THIS EULA.
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
