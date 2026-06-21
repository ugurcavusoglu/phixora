import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Tutorial'>;

const steps = [
  { num: '01', icon: '↑', title: 'Upload Your Image', desc: 'Drag and drop your image onto the upload area, or click to browse. Supports PNG, JPG, JPEG, and WEBP up to 20 MB.' },
  { num: '02', icon: '◈', title: 'Choose an AI Tool', desc: 'Select from Super Resolution, Remove Noise, or Remove Background.' },
  { num: '03', icon: '⚙', title: 'Adjust Settings', desc: 'Configure your selected tool. Each tool has controls tuned for its specific task.' },
  { num: '04', icon: '⟳', title: 'Processing', desc: 'Hit Apply and the AI will process your image. A progress bar shows the status — most edits finish in under 30 seconds.' },
  { num: '05', icon: '⇤⇥', title: 'Compare Before & After', desc: 'Drag the interactive slider to compare your original and enhanced image side by side.' },
  { num: '06', icon: '↓', title: 'Export or Save', desc: 'Download in full quality. Every result is also saved to your History automatically.' },
];

export default function TutorialScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.back}>{'< Back'}</Text>
        </Pressable>

        <Text style={styles.title}>How It Works</Text>
        <Text style={styles.subtitle}>Get started in 6 simple steps.</Text>

        <View style={styles.timeline}>
          {steps.map((s, i) => (
            <View key={s.num} style={styles.step}>
              {i < steps.length - 1 && <View style={styles.line} />}
              <View style={styles.numCircle}>
                <Text style={styles.numText}>{s.num}</Text>
              </View>
              <View style={styles.stepCard}>
                <Text style={styles.stepIcon}>{s.icon}</Text>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Create Account" onPress={() => navigation.navigate('Signup')} />
          <Button title="Try as Guest" variant="outline" onPress={() => navigation.navigate('Demo')} style={{ marginTop: 12 }} />
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
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 4, marginBottom: 28 },
  timeline: { gap: 0 },
  step: { flexDirection: 'row', marginBottom: 20, position: 'relative' },
  line: {
    position: 'absolute', left: 19, top: 40, bottom: -20, width: 2,
    backgroundColor: 'rgba(139,92,246,0.25)',
  },
  numCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.violet, alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  numText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  stepCard: {
    flex: 1, padding: 16, borderRadius: 14, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.surface,
  },
  stepIcon: { fontSize: 20, color: colors.violetHi, marginBottom: 8 },
  stepTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  stepDesc: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  actions: { marginTop: 12 },
});
