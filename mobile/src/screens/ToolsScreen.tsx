import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import { useImageStore } from '../store/imageStore';
import { useAuthStore } from '../store/authStore';
import type { Tool } from '../api/image';

type Props = NativeStackScreenProps<RootStackParamList, 'Tools'>;

const TOOLS: { id: Tool; label: string; icon: string; desc: string }[] = [
  { id: 'super-resolution', label: 'Super Resolution', icon: '◈', desc: 'Upscale up to 4x' },
  { id: 'remove-noise', label: 'Remove Noise', icon: '✦', desc: 'Clean grain & artifacts' },
  { id: 'remove-background', label: 'Remove Background', icon: '⊙', desc: 'Auto background removal' },
];

export default function ToolsScreen({ navigation }: Props) {
  const { uri, tool, scale, isDemo, demoSample, setTool, setScale } = useImageStore();
  const tier = useAuthStore((s) => s.user?.tier);

  useEffect(() => {
    if (!uri && !isDemo) navigation.replace('Upload');
  }, [uri, isDemo]);

  if (!uri && !isDemo) return null;

  const previewSource = isDemo && demoSample ? demoSample.original : { uri: uri! };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Tools" onHistory={() => navigation.navigate('History')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={previewSource} style={styles.preview} resizeMode="contain" />

        <Text style={styles.section}>Choose a Tool</Text>
        {TOOLS.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setTool(t.id)}
            style={[styles.tool, tool === t.id && styles.toolActive]}
          >
            <Text style={[styles.toolIcon, tool === t.id && styles.toolIconActive]}>{t.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toolLabel, tool === t.id && styles.toolLabelActive]}>{t.label}</Text>
              <Text style={styles.toolDesc}>{t.desc}</Text>
            </View>
          </Pressable>
        ))}

        {tool === 'super-resolution' && (
          <View style={styles.options}>
            <Text style={styles.optLabel}>SCALE</Text>
            <View style={styles.scaleRow}>
              {([2, 4] as const).map((s) => {
                const locked = s === 4 && (!tier || tier === 'free' || tier === 'starter');
                return (
                  <Pressable
                    key={s}
                    onPress={() => locked ? navigation.navigate('Pricing') : setScale(s)}
                    style={[styles.scaleBtn, scale === s && !locked && styles.scaleBtnActive, locked && styles.scaleBtnLocked]}
                  >
                    <Text style={[styles.scaleText, scale === s && !locked && styles.scaleTextActive]}>
                      {locked ? `${s}x \u{1F512}` : `${s}x`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <Button
          title={tool ? `Apply ${TOOLS.find((t) => t.id === tool)?.label}` : 'Select a Tool'}
          onPress={() => navigation.navigate('Process')}
          disabled={!tool}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  preview: { width: '100%', height: 220, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  section: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  tool: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 10,
  },
  toolActive: { borderColor: 'rgba(124,58,237,0.5)', backgroundColor: 'rgba(124,58,237,0.15)' },
  toolIcon: { fontSize: 22, color: colors.muted },
  toolIconActive: { color: colors.violetHi },
  toolLabel: { color: colors.text, fontSize: 15, fontWeight: '600' },
  toolLabelActive: { color: colors.violetHi },
  toolDesc: { color: colors.muted, fontSize: 12, marginTop: 2 },
  options: { marginTop: 16 },
  optLabel: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  scaleRow: { flexDirection: 'row', gap: 10 },
  scaleBtn: {
    flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg,
  },
  scaleBtnActive: { backgroundColor: colors.violet, borderColor: colors.violet },
  scaleText: { color: colors.muted, fontWeight: '700' },
  scaleTextActive: { color: '#fff' },
  scaleBtnLocked: { opacity: 0.5, borderColor: colors.muted },
});
