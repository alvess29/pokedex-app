import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import TypeBadge from './TypeBadge';
import { colors, typeColors } from '../theme';
import { formatName, formatNumber } from '../utils/format';

export default function PokemonCard({ pokemon, favorite, onPress }) {
  const tint = typeColors[pokemon.types[0]];

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.imageWrapper, { backgroundColor: `${tint}33` }]}>
        <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
        {favorite && <Text style={styles.heart}>♥</Text>}
      </View>
      <Text style={styles.number}>{formatNumber(pokemon.id)}</Text>
      <Text style={styles.name}>{formatName(pokemon.name)}</Text>
      <View style={styles.types}>
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    gap: 4,
  },
  imageWrapper: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 130,
    marginBottom: 6,
  },
  image: { width: 110, height: 110 },
  heart: { position: 'absolute', top: 8, right: 10, color: colors.red, fontSize: 20 },
  number: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  name: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
});
