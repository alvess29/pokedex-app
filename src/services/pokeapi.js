const BASE_URL = 'https://pokeapi.co/api/v2';
const cache = new Map();

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) throw new Error(`PokeAPI respondeu ${response.status}`);
  return response.json();
}

export async function fetchPokemonNames() {
  const { results } = await request('/pokemon?limit=1500');
  return results.map(({ name }) => name);
}

export async function fetchPokemon(name) {
  if (cache.has(name)) return cache.get(name);

  const data = await request(`/pokemon/${name}`);
  const pokemon = {
    id: data.id,
    name: data.name,
    image: data.sprites.other['official-artwork'].front_default ?? data.sprites.front_default,
    types: data.types.map(({ type }) => type.name),
    height: data.height / 10,
    weight: data.weight / 10,
    stats: data.stats.map(({ base_stat, stat }) => ({ name: stat.name, value: base_stat })),
  };

  cache.set(name, pokemon);
  return pokemon;
}

export function fetchPokemonDetails(names) {
  return Promise.all(names.map(fetchPokemon));
}
