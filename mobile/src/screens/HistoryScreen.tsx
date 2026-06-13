import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import { getHistory, deleteHistoryItem, HistoryItem } from '../api/history';
import { useImageStore, absolute } from '../store/imageStore';
import type { Tool } from '../api/image';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const LABELS: Record<string, string> = {
  'super-resolution': 'Super Resolution',
  'remove-noise': 'Remove Noise',
  'remove-background': 'Remove Background',
};

export default function HistoryScreen({ navigation }: Props) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const loadHistoryItem = useImageStore((s) => s.loadHistoryItem);

  useEffect(() => {
    getHistory()
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    await deleteHistoryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const open = (item: HistoryItem) => {
    loadHistoryItem({ tool: item.tool as Tool, inputUrl: item.inputUrl, outputUrl: item.outputUrl });
    navigation.navigate('Result');
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="History" />
      {loading ? (
        <Text style={styles.empty}>Loading…</Text>
      ) : items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>◇</Text>
          <Text style={styles.empty}>No history yet. Process an image to see it here.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => open(item)}>
              <Image source={{ uri: absolute(item.outputUrl) }} style={styles.thumb} resizeMode="cover" />
              <View style={{ flex: 1 }}>
                <Text style={styles.tool}>{LABELS[item.tool] ?? item.tool}</Text>
                <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
              </View>
              <Pressable onPress={() => remove(item.id)} hitSlop={10}>
                <Text style={styles.delete}>Delete</Text>
              </Pressable>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyIcon: { fontSize: 48, color: colors.muted, marginBottom: 12 },
  empty: { color: colors.muted, fontSize: 14, textAlign: 'center', padding: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 10,
  },
  thumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: colors.bg },
  tool: { color: colors.text, fontSize: 15, fontWeight: '600' },
  date: { color: colors.muted, fontSize: 12, marginTop: 2 },
  delete: { color: colors.danger, fontSize: 13 },
});
