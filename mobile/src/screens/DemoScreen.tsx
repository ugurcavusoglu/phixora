import { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import { DEMO_SAMPLES } from '../demo/demoData';
import { useImageStore } from '../store/imageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Demo'>;

export default function DemoScreen({ navigation }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { startDemo } = useImageStore();

  const handleContinue = () => {
    const sample = DEMO_SAMPLES.find((s) => s.id === selectedId);
    if (sample) {
      startDemo(sample);
      navigation.navigate('Tools');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Try phiXora as a guest</Text>
        <Text style={styles.subtitle}>
          Choose a sample image to see how the tools work.{'\n'}Sign up to upload your own.
        </Text>
      </View>

      <FlatList
        data={DEMO_SAMPLES}
        keyExtractor={(s) => s.id}
        numColumns={1}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const selected = selectedId === item.id;
          return (
            <Pressable
              onPress={() => setSelectedId(item.id)}
              style={[styles.card, selected && styles.cardSelected]}
            >
              <Image source={item.original} style={styles.thumbnail} resizeMode="cover" />
              <Text style={[styles.label, selected && styles.labelSelected]}>{item.label}</Text>
            </Pressable>
          );
        }}
      />

      <View style={styles.footer}>
        <Button
          title="Continue to Tools"
          onPress={handleContinue}
          disabled={!selectedId}
        />
        <Pressable onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
          <Text style={styles.signupText}>
            Want full access?{' '}
            <Text style={styles.signupAccent}>Sign up free</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  list: { paddingHorizontal: 24, paddingBottom: 16, gap: 12 },
  card: {
    borderRadius: 16, overflow: 'hidden', borderWidth: 2,
    borderColor: colors.border, backgroundColor: colors.surface,
  },
  cardSelected: { borderColor: colors.violet },
  thumbnail: { width: '100%', height: 160 },
  label: {
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, fontWeight: '600', color: colors.text,
  },
  labelSelected: { color: colors.violetHi },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8, gap: 12 },
  signupLink: { alignItems: 'center' },
  signupText: { fontSize: 13, color: colors.muted },
  signupAccent: { color: colors.violetHi, fontWeight: '600' },
});
