import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import { useAuthStore } from '../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const initial = user.name.charAt(0).toUpperCase();
  const referralLink = `https://phixora.com/signup?ref=${user.referralCode}`;

  const copyReferral = async () => {
    await Clipboard.setStringAsync(referralLink);
    Alert.alert('Copied!', 'Referral link copied to clipboard.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.back}>{'< Back'}</Text>
        </Pressable>

        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Credit Balance</Text>
          <Text style={styles.balanceValue}>{user.gems} <Text style={{ color: colors.gold }}>✦</Text></Text>
          <Pressable onPress={() => navigation.navigate('Pricing')} hitSlop={8}>
            <Text style={styles.buyMore}>Buy more credits</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REFERRAL</Text>
          <Text style={styles.referralDesc}>Invite friends, earn 10 ✦ per signup (max 100)</Text>
          <Button title="Copy Referral Link" variant="outline" onPress={copyReferral} style={{ marginTop: 10 }} />
        </View>

        <Button title="View History" variant="outline" onPress={() => navigation.navigate('History')} style={{ marginTop: 20 }} />
        <Button
          title="Log Out"
          variant="outline"
          onPress={async () => { await logout(); }}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { color: colors.muted, fontSize: 14, marginBottom: 20 },
  avatarWrap: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.violet,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  name: { color: colors.text, fontSize: 20, fontWeight: '700' },
  email: { color: colors.muted, fontSize: 14, marginTop: 4 },
  balanceCard: {
    padding: 20, borderRadius: 16, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', marginBottom: 24,
  },
  balanceLabel: { color: colors.muted, fontSize: 13 },
  balanceValue: { color: colors.text, fontSize: 32, fontWeight: '800', marginTop: 4 },
  buyMore: { color: colors.gold, fontSize: 14, fontWeight: '600', marginTop: 8 },
  section: {
    padding: 16, borderRadius: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  referralDesc: { color: colors.muted, fontSize: 13 },
});
