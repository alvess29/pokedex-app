import { StyleSheet, Text, View } from 'react-native';
import { typeColors, typeNames } from '../theme';

export default function TypeBadge({ type }) {
  return (
    <View style={[styles.badge, { backgroundColor: typeColors[type] }]}>
      <Text style={styles.label}>{typeNames[type] ?? type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  label: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
