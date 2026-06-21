import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Contact'>;

const FAQ: { q: string; a: string }[] = [
  { q: 'What is phiXora?', a: 'phiXora is an AI-powered image editing tool that lets you enhance, upscale, denoise, and remove backgrounds from your photos with one click.' },
  { q: 'Which image formats and sizes are supported?', a: 'We support PNG, JPG, JPEG, and WEBP formats. Maximum file size is 10 MB.' },
  { q: 'How does the AI processing work?', a: 'Your images are processed by state-of-the-art AI models running in the cloud. We use Real-ESRGAN for super resolution and rembg for background removal.' },
  { q: 'Can I try it without creating an account?', a: 'Yes! Use the guest demo mode to try our tools on sample images. Upload and full processing require an account.' },
  { q: 'Where are my processed images stored?', a: 'Processed images are stored securely on our servers and linked to your account. You can view them anytime in your History.' },
  { q: 'How does pricing work?', a: 'Each AI tool costs a set number of credits per use. You can purchase credit packages from the Pricing page. New accounts start with free credits.' },
];

export default function ContactScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/contact', { name, email, subject, message });
      setSuccess(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.successTitle}>Message Sent!</Text>
          <Text style={styles.successSub}>We'll get back to you as soon as possible.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 24, minWidth: 160 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={styles.back}>{'< Back'}</Text>
          </Pressable>

          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>Have a question or feedback? Reach out.</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Input label="Name" value={name} onChangeText={setName} placeholder="Your name" />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
          <Input label="Subject" value={subject} onChangeText={setSubject} placeholder="What is this about?" />
          <Input label="Message" value={message} onChangeText={setMessage} placeholder="Your message..." multiline numberOfLines={4} style={{ height: 100, textAlignVertical: 'top', paddingTop: 12 }} />

          <Button title="Send Message" onPress={handleSubmit} loading={loading} style={{ marginTop: 8 }} />

          <Text style={styles.faqTitle}>FAQ</Text>
          {FAQ.map((item, i) => (
            <Pressable key={i} onPress={() => setOpenFaq(openFaq === i ? null : i)} style={styles.faqItem}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQ}>{item.q}</Text>
                <Text style={styles.faqArrow}>{openFaq === i ? '−' : '+'}</Text>
              </View>
              {openFaq === i && <Text style={styles.faqA}>{item.a}</Text>}
            </Pressable>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { color: colors.muted, fontSize: 14, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 4, marginBottom: 20 },
  error: { color: colors.danger, marginBottom: 12 },
  faqTitle: {
    color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1,
    textTransform: 'uppercase', marginTop: 32, marginBottom: 12,
  },
  faqItem: {
    padding: 14, borderRadius: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, marginBottom: 8,
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1 },
  faqArrow: { color: colors.muted, fontSize: 18, marginLeft: 8 },
  faqA: { color: colors.muted, fontSize: 13, marginTop: 10, lineHeight: 20 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  checkmark: { fontSize: 64, color: colors.neon, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  successSub: { color: colors.muted, fontSize: 15, marginTop: 8 },
});
