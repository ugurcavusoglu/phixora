import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import Button from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'NotFound'>;

export default function NotFoundScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>The page you're looking for doesn't exist.</Text>
        <Button title="Go Home" onPress={() => navigation.navigate('Welcome')} style={{ marginTop: 24, minWidth: 160 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  code: { fontSize: 72, fontWeight: '900', color: colors.violetHi },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 8 },
  subtitle: { color: colors.muted, fontSize: 15, marginTop: 8 },
});
