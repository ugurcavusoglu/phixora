import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import { useImageStore } from '../store/imageStore';
import { useAuthStore } from '../store/authStore';
import { processImage } from '../api/image';

type Props = NativeStackScreenProps<RootStackParamList, 'Process'>;

const CREDIT_COSTS: Record<string, number> = {
  'super-resolution': 5,
  'remove-noise': 3,
  'remove-background': 4,
};

const LABELS: Record<string, string> = {
  'super-resolution': 'Super Resolution',
  'remove-noise': 'Remove Noise',
  'remove-background': 'Remove Background',
};

export default function ProcessScreen({ navigation }: Props) {
  const { uri, tool, scale, intensity, faceEnhance, isDemo, demoSample, setResult, setDemoResult } = useImageStore();
  const setGems = useAuthStore((s) => s.setGems);
  const userGems = useAuthStore((s) => s.user?.gems ?? 0);
  const [confirmed, setConfirmed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [creditError, setCreditError] = useState(false);

  useEffect(() => {
    if ((!uri && !isDemo) || !tool) { navigation.replace('Upload'); return; }
    if (!confirmed) {
      const cost = tool ? CREDIT_COSTS[tool] ?? 0 : 0;
      const toolLabel = tool ? LABELS[tool] : '';
      Alert.alert(
        'Confirm Processing',
        `${toolLabel} will use ${cost} credits.\nYour balance: ${userGems} credits.`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => navigation.goBack() },
          { text: 'Confirm & Apply', onPress: () => setConfirmed(true) },
        ],
        { cancelable: false },
      );
      return;
    }
    let cancelled = false;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p < 40) return p + 4;
        if (p < 70) return p + 1.2;
        if (p < 90) return p + 0.4;
        return p;
      });
    }, 400);

    const finish = (outputUrl: string) => {
      if (cancelled) return;
      clearInterval(interval);
      setProgress(100);
      setResult(outputUrl);
      setTimeout(() => navigation.replace('Result'), 500);
    };

    if (isDemo && demoSample) {
      const resultSource = demoSample.results[tool];
      if (!resultSource) {
        clearInterval(interval);
        setError('Demo result not available for this tool.');
        return () => clearInterval(interval);
      }
      const { Image: RNImage } = require('react-native');
      const resolvedResult = RNImage.resolveAssetSource(resultSource);
      const resolvedBefore = RNImage.resolveAssetSource(demoSample.original);
      const timer = setTimeout(() => {
        if (cancelled) return;
        clearInterval(interval);
        setProgress(100);
        setDemoResult(resolvedResult.uri, resolvedBefore.uri);
        setTimeout(() => navigation.replace('Result'), 500);
      }, 2500);
      return () => { cancelled = true; clearInterval(interval); clearTimeout(timer); };
    }

    processImage(uri!, tool, { scale, intensity, faceEnhance })
      .then(({ data }) => {
        if (data.remainingGems !== undefined) setGems(data.remainingGems);
        finish(data.outputUrl);
      })
      .catch((err) => {
        if (cancelled) return;
        clearInterval(interval);
        if (err?.response?.status === 403) {
          setCreditError(true);
          setError('Not enough credits');
        } else {
          const msg = err?.response?.status === 429
            ? 'The AI service is busy. Please wait a moment and try again.'
            : 'Processing failed. Please try again.';
          setError(msg);
        }
      });

    return () => { cancelled = true; clearInterval(interval); };
  }, [confirmed]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        {error ? (
          <>
            <Text style={styles.error}>{error}</Text>
            {creditError ? (
              <Button title="Buy Credits" onPress={() => navigation.navigate('Pricing')} style={{ marginTop: 16, minWidth: 160 }} />
            ) : (
              <Button title="Go Back" onPress={() => navigation.replace('Tools')} style={{ marginTop: 16, minWidth: 160 }} />
            )}
          </>
        ) : (
          <>
            <Text style={styles.toolLabel}>{tool ? LABELS[tool] : ''}</Text>
            <View style={styles.ring}>
              <ActivityIndicator size="large" color={colors.violetHi} />
              <Text style={styles.percent}>{Math.round(progress)}%</Text>
            </View>
            <Text style={styles.hint}>Editing… please wait</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  toolLabel: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 28 },
  ring: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  percent: { color: colors.text, fontSize: 28, fontWeight: '800' },
  hint: { color: colors.muted, fontSize: 14, marginTop: 24 },
  error: { color: colors.danger, fontSize: 15, textAlign: 'center' },
});
