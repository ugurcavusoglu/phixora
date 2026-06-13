import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Input from '../components/Input';
import Button from '../components/Button';
import { register } from '../api/auth';
import { useAuthStore } from '../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken, fetchMe } = useAuthStore();

  const handleSignup = async () => {
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await register(name, email, password);
      await setToken(data.access_token);
      await fetchMe();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create New Account</Text>
          <Text style={styles.subtitle}>Start enhancing your images today</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Input label="Name" value={name} onChangeText={setName} placeholder="Your full name" />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••" secureTextEntry />
          <Input label="Confirm Password" value={confirm} onChangeText={setConfirm} placeholder="••••••" secureTextEntry />

          <Button title="Create Account" onPress={handleSignup} loading={loading} style={{ marginTop: 8 }} />

          <Pressable onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
            <Text style={styles.link}>
              Already have an account? <Text style={styles.linkAccent}>Log In</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 4, marginBottom: 24 },
  error: { color: colors.danger, marginBottom: 12 },
  linkWrap: { marginTop: 20, alignItems: 'center' },
  link: { color: colors.muted, fontSize: 14 },
  linkAccent: { color: colors.violetHi, fontWeight: '600' },
});
