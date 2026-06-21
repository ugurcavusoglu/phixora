import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Input from '../components/Input';
import Button from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) return;
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successSub}>
            If an account exists with this email, we've sent a password reset link.
          </Text>
          <Button title="Back to Login" onPress={() => navigation.navigate('Login')} style={{ marginTop: 24, minWidth: 160 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email and we'll send a reset link.</Text>

          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />

          <Button title="Send Reset Link" onPress={handleSubmit} style={{ marginTop: 8 }} />

          <Pressable onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
            <Text style={styles.link}>
              Remember your password? <Text style={styles.linkAccent}>Log In</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 4, marginBottom: 24 },
  linkWrap: { marginTop: 24, alignItems: 'center' },
  link: { color: colors.muted, fontSize: 14 },
  linkAccent: { color: colors.violetHi, fontWeight: '600' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  checkmark: { fontSize: 64, color: colors.neon, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  successSub: { color: colors.muted, fontSize: 15, marginTop: 8, textAlign: 'center', lineHeight: 22 },
});
