import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { getHistory } from '../api/history';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const TIER_COLORS: Record<string, string> = {
  pro: '#8B5CF6',
  popular: colors.gold,
  starter: '#38BDF8',
  free: colors.muted,
};

const TIER_CREDITS: Record<string, string> = {
  pro: '500 credits/mo',
  popular: '150 credits/mo',
  starter: '50 credits/mo',
  free: '10 credits/mo',
};

const TIER_FEATURES: Record<string, string[]> = {
  pro: ['Super Resolution: 2x & 4x', 'Remove Noise', 'Remove Background', 'Priority processing'],
  popular: ['Super Resolution: 2x & 4x', 'Remove Noise', 'Remove Background'],
  starter: ['Super Resolution: 2x only', 'Remove Noise', 'Remove Background'],
  free: ['Super Resolution: 2x only', 'Remove Noise'],
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuthStore();
  const [toolCounts, setToolCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    getHistory().then(({ data }) => {
      const counts: Record<string, number> = {};
      data.forEach((h) => { counts[h.tool] = (counts[h.tool] || 0) + 1; });
      setToolCounts(counts);
    }).catch(() => {});
  }, []);

  if (!user) return null;

  const tier = user.tier || 'free';
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
          <Text style={styles.sectionTitle}>PLAN</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[tier] || colors.muted }]}>
              <Text style={styles.tierBadgeText}>{tier.toUpperCase()}</Text>
            </View>
            <Text style={styles.tierCredits}>{TIER_CREDITS[tier] || ''}</Text>
          </View>
          {(TIER_FEATURES[tier] || []).map((f, i) => (
            <Text key={i} style={styles.featureText}>{'✓ ' + f}</Text>
          ))}
        </View>

        {Object.keys(toolCounts).length > 0 && (
          <View style={[styles.section, { marginTop: 14 }]}>
            <Text style={styles.sectionTitle}>USAGE STATISTICS</Text>
            {Object.entries(toolCounts).map(([tool, count]) => (
              <View key={tool} style={styles.statRow}>
                <Text style={styles.statLabel}>{tool}</Text>
                <Text style={styles.statValue}>{count}</Text>
              </View>
            ))}
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { fontWeight: '700' }]}>Total</Text>
              <Text style={[styles.statValue, { fontWeight: '700' }]}>{Object.values(toolCounts).reduce((a, b) => a + b, 0)}</Text>
            </View>
          </View>
        )}

        <View style={[styles.section, { marginTop: 14 }]}>
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
  tierBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tierBadgeText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  tierCredits: { color: colors.muted, fontSize: 13 },
  featureText: { color: colors.neon, fontSize: 13, marginBottom: 4 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  statLabel: { color: colors.text, fontSize: 14 },
  statValue: { color: colors.text, fontSize: 14 },
});
