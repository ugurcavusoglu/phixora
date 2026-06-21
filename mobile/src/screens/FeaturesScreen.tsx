import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Features'>;

const features = [
  { icon: '◈', title: 'Super Resolution', desc: 'Upscale your images without losing detail.' },
  { icon: '✦', title: 'Remove Noise', desc: 'Clean grain, compression artifacts and sensor noise from any photo.' },
  { icon: '⊙', title: 'Remove Background', desc: 'Instantly remove image backgrounds. Exports as transparent PNG.' },
  { icon: '⇤⇥', title: 'Before / After Preview', desc: 'Drag the slider to compare your original and enhanced image side by side.' },
  { icon: '↻', title: 'History', desc: 'Every processed image is saved to your history. Reopen, re-download, or delete past results anytime.' },
  { icon: '↓', title: 'Fast Export', desc: 'Download your enhanced image instantly in full quality.' },
];

export default function FeaturesScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.back}>{'< Back'}</Text>
        </Pressable>

        <Text style={styles.title}>Features</Text>
        <Text style={styles.subtitle}>Everything you need to enhance your images.</Text>

        <View style={styles.cards}>
          {features.map((f) => (
            <View key={f.title} style={styles.card}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{f.icon}</Text>
              </View>
              <Text style={styles.cardTitle}>{f.title}</Text>
              <Text style={styles.cardDesc}>{f.desc}</Text>
              <Pressable onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.tryNow}>Try now →</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, paddingBottom: 40 },
  back: { color: colors.muted, fontSize: 14, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 4, marginBottom: 24 },
  cards: { gap: 16 },
  card: {
    padding: 20, borderRadius: 16, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.surface,
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(139,92,246,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  icon: { fontSize: 20, color: colors.violetHi },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardDesc: { color: colors.muted, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  tryNow: { color: colors.violetHi, fontSize: 13, fontWeight: '600' },
});
