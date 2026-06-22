import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as SecureStore from 'expo-secure-store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import { useImageStore } from '../store/imageStore';
import ScreenHeader from '../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

// Keep the longest edge under this so AI models don't run out of GPU memory.
const MAX_EDGE = 1600;

const ONBOARDING_STEPS = [
  { icon: '↑', title: 'Upload', desc: 'Pick a photo from your gallery to get started.' },
  { icon: '◈', title: 'Choose Tool', desc: 'Select an AI tool: upscale, denoise, or remove background.' },
  { icon: '⇌', title: 'Compare Results', desc: 'Slide to compare before & after, then save or share.' },
];

export default function UploadScreen({ navigation }: Props) {
  const { uri, setImage } = useImageStore();
  const [preparing, setPreparing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('phixora-onboarding').then((val) => {
      if (!val) setShowOnboarding(true);
    });
  }, []);

  const dismissOnboarding = async () => {
    await SecureStore.setItemAsync('phixora-onboarding', '1');
    setShowOnboarding(false);
  };

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (res.canceled || !res.assets[0]) return;

    const asset = res.assets[0];
    setPreparing(true);
    try {
      const longest = Math.max(asset.width ?? 0, asset.height ?? 0);
      if (longest > MAX_EDGE) {
        const scale = MAX_EDGE / longest;
        const ctx = ImageManipulator.manipulate(asset.uri).resize({
          width: Math.round((asset.width ?? 0) * scale),
          height: Math.round((asset.height ?? 0) * scale),
        });
        const image = await ctx.renderAsync();
        const out = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.9 });
        setImage(out.uri);
      } else {
        setImage(asset.uri);
      }
    } catch {
      setImage(asset.uri); // fall back to original if resize fails
    } finally {
      setPreparing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Upload" onHistory={() => navigation.navigate('History')} />

      <View style={styles.content}>
        <Pressable onPress={pick} style={styles.dropzone}>
          {uri ? (
            <Image source={{ uri }} style={styles.preview} resizeMode="contain" />
          ) : (
            <>
              <View style={styles.iconCircle}><Text style={styles.icon}>↑</Text></View>
              <Text style={styles.dropTitle}>Tap to choose an image</Text>
              <Text style={styles.dropSub}>PNG, JPG, JPEG, WEBP</Text>
            </>
          )}
        </Pressable>

        {uri && (
          <Button title="Change Image" variant="outline" onPress={pick} loading={preparing} style={{ marginTop: 16 }} />
        )}

        <Button
          title="Continue"
          onPress={() => navigation.navigate('Tools')}
          disabled={!uri || preparing}
          style={{ marginTop: 16 }}
        />
      </View>

      <Modal visible={showOnboarding} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Welcome to Phixora</Text>
            {ONBOARDING_STEPS.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
            <Button title="Got it!" onPress={dismissOnboarding} style={{ marginTop: 20 }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  dropzone: {
    borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 18,
    padding: 32, alignItems: 'center', justifyContent: 'center', minHeight: 280, backgroundColor: colors.surface,
  },
  preview: { width: '100%', height: 240, borderRadius: 12 },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(124,58,237,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  icon: { fontSize: 26, color: colors.violetHi },
  dropTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  dropSub: { color: colors.muted, fontSize: 12, marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 24, width: '100%', borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  stepCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(124,58,237,0.2)', alignItems: 'center', justifyContent: 'center' },
  stepIcon: { fontSize: 20, color: colors.violetHi },
  stepTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  stepDesc: { color: colors.muted, fontSize: 13, marginTop: 2 },
});
