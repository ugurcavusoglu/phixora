import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Input from '../components/Input';
import Button from '../components/Button';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken, fetchMe } = useAuthStore();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await login(email, password);
      await setToken(data.access_token);
      await fetchMe();
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>Log in to your account</Text>
          <Text style={styles.subtitle}>Welcome back</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••" secureTextEntry />

          <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={{ alignItems: 'flex-end', marginTop: 4, marginBottom: 4 }}>
            <Text style={{ color: colors.muted, fontSize: 12 }}>Forgot Password?</Text>
          </Pressable>

          <Button title="Log In" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

          <Pressable onPress={() => navigation.navigate('Signup')} style={styles.linkWrap}>
            <Text style={styles.link}>
              Don't have an account? <Text style={styles.linkAccent}>Sign Up</Text>
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
  error: { color: colors.danger, marginBottom: 12 },
  linkWrap: { marginTop: 24, alignItems: 'center' },
  link: { color: colors.muted, fontSize: 14 },
  linkAccent: { color: colors.violetHi, fontWeight: '600' },
});
