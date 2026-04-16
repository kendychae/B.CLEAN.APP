import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar } from 'react-native-paper';

export default function EULAScreen({ navigation }: any) {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="License Agreement" />
      </Appbar.Header>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>End-User License Agreement (EULA)</Text>
        <Text style={styles.updated}>Last Updated: April 2026</Text>

        <Text style={styles.heading}>IMPORTANT — READ CAREFULLY</Text>
        <Text style={styles.body}>
          This End-User License Agreement ("EULA") is a legal agreement between you ("User") and
          B.CLEAN ("Licensor") for use of the B.CLEAN mobile application ("Software"). By installing
          or using the Software, you agree to be bound by the terms of this EULA. If you do not
          agree, do not install or use the Software.
        </Text>

        <Text style={styles.heading}>1. License Grant</Text>
        <Text style={styles.body}>
          Subject to the terms of this EULA and payment of all applicable subscription fees, the
          Licensor grants you a limited, non-exclusive, non-transferable, revocable license to
          download, install, and use the Software on mobile devices owned or controlled by you,
          solely for your personal or internal business purposes in accordance with this EULA and
          any applicable subscription agreement.
        </Text>

        <Text style={styles.heading}>2. License Restrictions</Text>
        <Text style={styles.body}>
          You shall not:{'\n'}
          {'\n'}(a) Copy, modify, or distribute the Software or any portion thereof
          {'\n'}(b) Reverse engineer, decompile, disassemble, or attempt to discover the source code
          {'\n'}(c) Rent, lease, lend, sell, sublicense, or transfer the Software to any third party
          {'\n'}(d) Make the Software available on any file-sharing or application hosting service
          {'\n'}(e) Remove any proprietary notices, labels, or marks from the Software
          {'\n'}(f) Use the Software to develop a competing product or service
          {'\n'}(g) Use the Software for any unlawful purpose
          {'\n'}(h) Share account credentials with unauthorized individuals
          {'\n'}(i) Use automated systems to access the Software (bots, scrapers, etc.)
        </Text>

        <Text style={styles.heading}>3. Subscription and Fees</Text>
        <Text style={styles.body}>
          Use of the Software requires an active, paid subscription. The subscription is billed on
          a recurring basis (monthly or annually) as agreed at the time of purchase. Failure to
          maintain an active subscription will result in suspension of access to the Software.
          All fees are non-refundable except as required by applicable law or as explicitly stated
          in the subscription agreement.
        </Text>

        <Text style={styles.heading}>4. Intellectual Property</Text>
        <Text style={styles.body}>
          The Software is protected by copyright, trade secret, and other intellectual property laws.
          The Licensor retains all right, title, and interest in and to the Software, including all
          intellectual property rights therein. This EULA does not convey any interest in or to the
          Software other than the limited license to use the Software as expressly granted above.
        </Text>

        <Text style={styles.heading}>5. Data Collection and Privacy</Text>
        <Text style={styles.body}>
          The Software collects certain data as described in our Privacy Policy. By using the
          Software, you consent to such data collection and use. The Licensor shall handle all
          personal data in accordance with applicable privacy laws and the Privacy Policy.
        </Text>

        <Text style={styles.heading}>6. Third-Party Content and Advertising</Text>
        <Text style={styles.body}>
          The Software may display advertisements from third-party ad networks. These advertisements
          are provided "as is" and the Licensor makes no representations or warranties regarding
          third-party content. The Licensor is not responsible for any third-party products or
          services advertised within the Software.
        </Text>

        <Text style={styles.heading}>7. Disclaimer of Warranties</Text>
        <Text style={styles.body}>
          THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
          INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, TITLE, AND NON-INFRINGEMENT. THE LICENSOR DOES NOT WARRANT THAT THE SOFTWARE
          WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
        </Text>

        <Text style={styles.heading}>8. Limitation of Liability</Text>
        <Text style={styles.body}>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE LICENSOR BE
          LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER
          (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS
          INTERRUPTION, LOSS OF BUSINESS INFORMATION, OR ANY OTHER PECUNIARY LOSS) ARISING OUT
          OF THE USE OF OR INABILITY TO USE THE SOFTWARE, EVEN IF THE LICENSOR HAS BEEN ADVISED
          OF THE POSSIBILITY OF SUCH DAMAGES. THE LICENSOR'S TOTAL AGGREGATE LIABILITY SHALL NOT
          EXCEED THE FEES PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
        </Text>

        <Text style={styles.heading}>9. Termination</Text>
        <Text style={styles.body}>
          This EULA is effective until terminated. It will terminate automatically if you fail to
          comply with any term of this EULA. The Licensor may also terminate this EULA at any time
          without notice. Upon termination, you must cease all use of the Software and destroy all
          copies in your possession. Sections 4, 7, 8, and 10 shall survive termination.
        </Text>

        <Text style={styles.heading}>10. Governing Law</Text>
        <Text style={styles.body}>
          This EULA shall be governed by and construed in accordance with the laws of the State of
          Washington, United States, without regard to conflict of law principles. Any disputes
          arising under this EULA shall be resolved exclusively in the state or federal courts
          located in the State of Washington.
        </Text>

        <Text style={styles.heading}>11. Entire Agreement</Text>
        <Text style={styles.body}>
          This EULA, together with the Terms of Service and Privacy Policy, constitutes the entire
          agreement between you and the Licensor with respect to the Software and supersedes all
          prior agreements and understandings, both written and oral.
        </Text>

        <Text style={styles.heading}>12. Contact</Text>
        <Text style={styles.body}>
          For questions regarding this EULA, contact:{'\n'}
          {'\n'}B.CLEAN
          {'\n'}Email: business@bclean.app
          {'\n'}Website: https://bclean.app
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
