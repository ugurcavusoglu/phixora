import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const features = [
  { icon: '◈', title: 'Super Resolution', desc: 'Upscale images up to 4x without losing detail.' },
  { icon: '✦', title: 'Noise Removal', desc: 'Clean up grain and artifacts from any photo.' },
  { icon: '⊙', title: 'Background Removal', desc: 'Remove backgrounds instantly with AI.' },
];

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={{ color: colors.violetHi }}>◇ </Text>phiXora
          </Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>AI-Powered Image Enhancement</Text>
          </View>
          <Text style={styles.title}>
            All the best tools{'\n'}
            <Text style={styles.titleAccent}>with easy usage</Text>
          </Text>
          <Text style={styles.subtitle}>
            Professional-grade AI image editing in your pocket. No expertise required.
          </Text>
        </View>

        <View style={styles.features}>
          {features.map((f) => (
            <View key={f.title} style={styles.card}>
              <Text style={styles.cardIcon}>{f.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{f.title}</Text>
                <Text style={styles.cardDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Get Started Free" onPress={() => navigation.navigate('Signup')} />
          <Button title="Log In" variant="outline" onPress={() => navigation.navigate('Login')} style={{ marginTop: 12 }} />
          <Button title="Try as Guest" variant="outline" onPress={() => navigation.navigate('Demo')} style={{ marginTop: 12 }} />
          <Button title="Pricing" variant="outline" onPress={() => navigation.navigate('Pricing')} style={{ marginTop: 12 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, paddingBottom: 40 },
  header: { paddingVertical: 16 },
  logo: { fontSize: 22, fontWeight: '800', color: colors.text },
  hero: { marginTop: 40, marginBottom: 32 },
  badge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.4)', backgroundColor: 'rgba(124,58,237,0.1)',
    marginBottom: 20,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.neon, marginRight: 8 },
  badgeText: { color: colors.violetHi, fontSize: 12 },
  title: { fontSize: 40, fontWeight: '900', color: colors.text, lineHeight: 46 },
  titleAccent: { color: colors.violetHi },
  subtitle: { color: colors.muted, fontSize: 15, marginTop: 16, lineHeight: 22 },
  features: { gap: 12, marginBottom: 32 },
  card: {
    flexDirection: 'row', gap: 14, alignItems: 'center',
    padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  cardIcon: { fontSize: 24, color: colors.violetHi },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  cardDesc: { color: colors.muted, fontSize: 13, marginTop: 2 },
  actions: { marginTop: 8 },
});
