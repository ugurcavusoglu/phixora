import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import { useAuthStore } from '../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Pricing'>;

const PACKAGES = [
  { id: 'starter', name: 'Starter', price: '$1.99', credits: 50, highlighted: false },
  { id: 'popular', name: 'Popular', price: '$4.99', credits: 150, highlighted: true },
  { id: 'pro', name: 'Pro', price: '$9.99', credits: 500, highlighted: false },
] as const;

const TOOL_COSTS = [
  { name: 'Super Resolution', cost: 5 },
  { name: 'Remove Noise', cost: 3 },
  { name: 'Remove Background', cost: 4 },
];

export default function PricingScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.back}>{'< Back'}</Text>
        </Pressable>

        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>Get credits to power your AI edits</Text>

        {user && (
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceValue}>{user.gems} <Text style={{ color: colors.gold }}>✦</Text></Text>
          </View>
        )}

        {PACKAGES.map((pkg) => (
          <View key={pkg.id} style={[styles.card, pkg.highlighted && styles.cardHighlighted]}>
            {pkg.highlighted && <Text style={styles.badge}>BEST VALUE</Text>}
            <Text style={styles.pkgName}>{pkg.name}</Text>
            <Text style={styles.pkgCredits}>
              {pkg.credits} <Text style={{ color: colors.gold }}>✦</Text> credits
            </Text>
            <Text style={styles.pkgPrice}>{pkg.price}</Text>
            <Button
              title={user ? 'Buy Now' : 'Sign Up'}
              onPress={() => user ? navigation.navigate('Checkout', { packageId: pkg.id }) : navigation.navigate('Signup')}
              style={{ marginTop: 12 }}
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Tool Costs</Text>
        {TOOL_COSTS.map((t) => (
          <View key={t.name} style={styles.costRow}>
            <Text style={styles.costName}>{t.name}</Text>
            <Text style={styles.costValue}>{t.cost} <Text style={{ color: colors.gold }}>✦</Text></Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: colors.muted, fontSize: 14, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 4, marginBottom: 20 },
  balanceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    marginBottom: 20,
  },
  balanceLabel: { color: colors.muted, fontSize: 14 },
  balanceValue: { color: colors.text, fontSize: 18, fontWeight: '700' },
  card: {
    padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, marginBottom: 14,
  },
  cardHighlighted: { borderColor: colors.gold, borderWidth: 2 },
  badge: {
    color: colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1,
    marginBottom: 8,
  },
  pkgName: { color: colors.text, fontSize: 18, fontWeight: '700' },
  pkgCredits: { color: colors.muted, fontSize: 14, marginTop: 4 },
  pkgPrice: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 8 },
  sectionTitle: {
    color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1,
    textTransform: 'uppercase', marginTop: 24, marginBottom: 12,
  },
  costRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  costName: { color: colors.text, fontSize: 14 },
  costValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
