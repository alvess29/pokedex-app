import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import TypeBadge from './TypeBadge';
import { colors, statNames, typeColors } from '../theme';
import { formatName, formatNumber } from '../utils/format';

const MAX_STAT = 255;

export default function PokemonModal({ pokemon, favorite, onToggleFavorite, onClose }) {
  if (!pokemon) return null;

  const tint = typeColors[pokemon.types[0]];

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: tint }]}>
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeLabel}>Fechar</Text>
          </Pressable>
          <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.info}>
          <Text style={styles.number}>{formatNumber(pokemon.id)}</Text>
          <Text style={styles.name}>{formatName(pokemon.name)}</Text>
          <View style={styles.types}>
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </View>

          <View style={styles.measures}>
            <Measure label="Altura" value={`${pokemon.height} m`} />
            <Measure label="Peso" value={`${pokemon.weight} kg`} />
          </View>

          <Text style={styles.sectionTitle}>Atributos base</Text>
          {pokemon.stats.map(({ name, value }) => (
            <View key={name} style={styles.statRow}>
              <Text style={styles.statName}>{statNames[name] ?? name}</Text>
              <Text style={styles.statValue}>{value}</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${(value / MAX_STAT) * 100}%`, backgroundColor: tint }]} />
              </View>
            </View>
          ))}

          <Pressable onPress={onToggleFavorite} style={[styles.favorite, favorite && styles.favoriteActive]}>
            <Text style={[styles.favoriteLabel, favorite && styles.favoriteLabelActive]}>
              {favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
}

function Measure({ label, value }) {
  return (
    <View style={styles.measure}>
      <Text style={styles.measureValue}>{value}</Text>
      <Text style={styles.measureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: 40 },
  hero: { height: 280, alignItems: 'center', justifyContent: 'flex-end', paddingTop: 16 },
  close: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 1,
  },
  closeLabel: { color: colors.white, fontWeight: '700' },
  image: { width: 240, height: 240, marginBottom: -20 },
  info: { padding: 24, paddingTop: 36, gap: 8 },
  number: { color: colors.muted, fontWeight: '600', fontSize: 14 },
  name: { color: colors.ink, fontSize: 32, fontWeight: '800' },
  types: { flexDirection: 'row', gap: 8, marginTop: 4 },
  measures: { flexDirection: 'row', gap: 12, marginVertical: 16 },
  measure: { flex: 1, backgroundColor: colors.paper, borderRadius: 14, padding: 14, alignItems: 'center' },
  measureValue: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  measureLabel: { color: colors.muted, fontSize: 13, marginTop: 2 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  statName: { width: 96, color: colors.muted, fontSize: 14 },
  statValue: { width: 34, color: colors.ink, fontWeight: '700', textAlign: 'right' },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.paper, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  favorite: {
    marginTop: 24,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.red,
  },
  favoriteActive: { backgroundColor: colors.paper },
  favoriteLabel: { color: colors.white, fontWeight: '800', fontSize: 16 },
  favoriteLabelActive: { color: colors.red },
});
