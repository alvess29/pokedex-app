import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import PokemonCard from './src/components/PokemonCard';
import PokemonModal from './src/components/PokemonModal';
import { usePokemonList } from './src/hooks/usePokemonList';
import { useFavorites } from './src/hooks/useFavorites';
import { useFavoritePokemon } from './src/hooks/useFavoritePokemon';
import { colors } from './src/theme';

const TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'favorites', label: 'Favoritos' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);

  const list = usePokemonList(query);
  const { favoriteNames, isFavorite, toggleFavorite } = useFavorites();
  const favorites = useFavoritePokemon(favoriteNames);

  const showingFavorites = tab === 'favorites';
  const data = showingFavorites ? favorites.items : list.items;
  const loading = showingFavorites ? favorites.loading : list.status === 'loading';

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.lens} />
          <Text style={styles.title}>Pokédex</Text>
        </View>
        {!showingFavorites && (
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar pelo nome"
            placeholderTextColor={colors.mutedOnRed}
            style={styles.search}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        <View style={styles.tabs}>
          {TABS.map(({ key, label }) => (
            <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, tab === key && styles.tabActive]}>
              <Text style={[styles.tabLabel, tab === key && styles.tabLabelActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>

      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.red} style={styles.center} />
        ) : list.status === 'error' && !showingFavorites ? (
          <Text style={styles.message}>Não foi possível carregar os dados. Verifique sua conexão e tente novamente.</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <PokemonCard pokemon={item} favorite={isFavorite(item.name)} onPress={() => setSelected(item)} />
            )}
            onEndReached={showingFavorites ? undefined : list.loadMore}
            onEndReachedThreshold={0.4}
            ListEmptyComponent={
              <Text style={styles.message}>
                {showingFavorites ? 'Toque no coração de um Pokémon para salvá-lo aqui.' : 'Nenhum Pokémon encontrado com esse nome.'}
              </Text>
            }
            ListFooterComponent={
              list.status === 'loadingMore' && !showingFavorites ? (
                <ActivityIndicator color={colors.red} style={styles.footer} />
              ) : null
            }
          />
        )}
      </View>

      <PokemonModal
        pokemon={selected}
        favorite={selected ? isFavorite(selected.name) : false}
        onToggleFavorite={() => toggleFavorite(selected)}
        onClose={() => setSelected(null)}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.red,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8 },
  lens: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lens,
    borderWidth: 3,
    borderColor: colors.white,
  },
  title: { fontSize: 28, fontWeight: '800', color: colors.white, letterSpacing: 0.3 },
  search: {
    backgroundColor: colors.redDark,
    color: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  tabActive: { backgroundColor: colors.white },
  tabLabel: { color: colors.mutedOnRed, fontWeight: '700', fontSize: 15 },
  tabLabelActive: { color: colors.red },
  body: { flex: 1, backgroundColor: colors.paper },
  listContent: { padding: 12, paddingBottom: 32 },
  row: { gap: 12 },
  center: { marginTop: 48 },
  message: { textAlign: 'center', color: colors.muted, fontSize: 15, padding: 32, lineHeight: 22 },
  footer: { marginVertical: 20 },
});
