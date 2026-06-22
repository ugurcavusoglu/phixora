import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { useImageStore } from '../store/imageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ navigation }: Props) {
  const { beforeUrl: storedBefore, outputUrl, tool, uri, reset } = useImageStore();
  const beforeUrl = storedBefore || uri;
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!beforeUrl || !outputUrl) {
    navigation.replace('Upload');
    return null;
  }

  // Download the result URL to a local file so we can save/share it.
  const downloadToCache = async (): Promise<string> => {
    const ext = outputUrl.split('.').pop()?.split('?')[0] || 'png';
    const dest = `${FileSystem.cacheDirectory}phixora-${Date.now()}.${ext}`;
    const { uri } = await FileSystem.downloadAsync(outputUrl, dest);
    return uri;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Allow photo access to save the image.');
        return;
      }
      const localUri = await downloadToCache();
      await MediaLibrary.saveToLibraryAsync(localUri);
      Alert.alert('Saved', 'Image saved to your gallery.');
    } catch {
      Alert.alert('Error', 'Could not save the image. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Unavailable', 'Sharing is not available on this device.');
        return;
      }
      const localUri = await downloadToCache();
      await Sharing.shareAsync(localUri);
    } catch {
      Alert.alert('Error', 'Could not share the image.');
    } finally {
      setSharing(false);
    }
  };

  const handleNew = () => {
    reset();
    navigation.replace('Upload');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Result" onHistory={() => navigation.navigate('History')} />
      <ScrollView contentContainerStyle={styles.content}>
        <BeforeAfterSlider
          beforeUrl={beforeUrl}
          afterUrl={outputUrl}
          showCheckerboard={tool === 'remove-background'}
        />
        <Text style={styles.hint}>Drag the handle to compare</Text>

        <View style={styles.row}>
          <Button title="Save" onPress={handleSave} loading={saving} style={styles.flexBtn} />
          <Button title="Share" variant="neon" onPress={handleShare} loading={sharing} style={styles.flexBtn} />
        </View>
        <Button title="New Image" variant="outline" onPress={handleNew} style={{ marginTop: 12 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  hint: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 12 },
  row: { flexDirection: 'row', gap: 12, marginTop: 24 },
  flexBtn: { flex: 1 },
});
