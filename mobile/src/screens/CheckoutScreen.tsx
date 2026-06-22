import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Input from '../components/Input';
import Button from '../components/Button';
import { purchaseGems, PackageId } from '../api/gems';
import { useAuthStore } from '../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const PKG_INFO: Record<string, { name: string; price: string; credits: number }> = {
  starter: { name: 'Starter', price: '$1.99', credits: 50 },
  popular: { name: 'Popular', price: '$4.99', credits: 150 },
  pro: { name: 'Pro', price: '$9.99', credits: 500 },
};

export default function CheckoutScreen({ navigation, route }: Props) {
  const { packageId } = route.params;
  const pkg = PKG_INFO[packageId] || PKG_INFO.starter;
  const { setGems, setTier, fetchMe } = useAuthStore();

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [expiryError, setExpiryError] = useState('');

  const validate = (): string | null => {
    setExpiryError('');
    if (!cardName.trim()) return 'Name on card is required.';
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) return 'Card number must be 16 digits.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      const monthMatch = expiry.match(/^(\d{2})\//);
      if (monthMatch) {
        const m = parseInt(monthMatch[1], 10);
        if (m < 1 || m > 12) { setExpiryError('Invalid month (01-12)'); return 'Invalid expiry.'; }
      }
      return 'Expiry must be MM/YY format.';
    }
    const [mm, yy] = expiry.split('/').map(Number);
    const now = new Date();
    const expiryDate = new Date(2000 + yy, mm);
    if (expiryDate <= now) { setExpiryError('Card has expired'); return 'Card has expired.'; }
    if (!/^\d{3}$/.test(cvv)) return 'CVV must be exactly 3 digits.';
    return null;
  };

  const handlePay = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await purchaseGems(packageId as PackageId);
      setGems(data.gems);
      setTier(data.tier);
      await fetchMe();
      setSuccess(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSub}>{pkg.credits} credits added to your account</Text>
          <Button title="Start Editing" onPress={() => navigation.navigate('Upload')} style={{ marginTop: 24, minWidth: 200 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Checkout</Text>

          <View style={styles.summary}>
            <Text style={styles.pkgName}>{pkg.name} Package</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{pkg.credits} <Text style={{ color: colors.gold }}>✦</Text> credits</Text>
              <Text style={styles.summaryPrice}>{pkg.price}</Text>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Input label="Name on Card" value={cardName} onChangeText={setCardName} placeholder="John Doe" />
          <Input label="Card Number" value={cardNumber} onChangeText={setCardNumber} placeholder="1234 5678 9012 3456" keyboardType="number-pad" maxLength={19} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label="Expiry" value={expiry} onChangeText={setExpiry} placeholder="MM/YY" maxLength={5} />
              {expiryError ? <Text style={styles.expiryError}>{expiryError}</Text> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Input label="CVV" value={cvv} onChangeText={setCvv} placeholder="123" keyboardType="number-pad" maxLength={3} secureTextEntry />
            </View>
          </View>

          <Button
            title={`Pay ${pkg.price}`}
            onPress={handlePay}
            loading={loading}
            style={{ marginTop: 8, backgroundColor: colors.goldDk }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, padding: 24 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 20 },
  summary: {
    padding: 16, borderRadius: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, marginBottom: 20,
  },
  pkgName: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: colors.muted, fontSize: 14 },
  summaryPrice: { color: colors.text, fontSize: 22, fontWeight: '800' },
  error: { color: colors.danger, marginBottom: 12 },
  expiryError: { color: colors.danger, fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  checkmark: { fontSize: 64, color: colors.neon, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  successSub: { color: colors.muted, fontSize: 15, marginTop: 8 },
});
