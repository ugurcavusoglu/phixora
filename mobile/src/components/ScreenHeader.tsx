import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';

interface Props {
  title: string;
  onHistory?: () => void;
}

export default function ScreenHeader({ title, onHistory }: Props) {
  const logout = useAuthStore((s) => s.logout);
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>
        <Text style={{ color: colors.violetHi }}>◇ </Text>{title}
      </Text>
      <View style={styles.actions}>
        {onHistory && (
          <Pressable onPress={onHistory} hitSlop={8}>
            <Text style={styles.action}>⟳ History</Text>
          </Pressable>
        )}
        <Pressable onPress={logout} hitSlop={8}>
          <Text style={styles.action}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  logo: { fontSize: 18, fontWeight: '800', color: colors.text },
  actions: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  action: { color: colors.muted, fontSize: 13 },
});
