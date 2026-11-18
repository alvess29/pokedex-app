import { useEffect, useState } from 'react';
import { fetchPokemonDetails } from '../services/pokeapi';

export function useFavoritePokemon(names) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPokemonDetails(names)
      .then((pokemon) => {
        if (!cancelled) setItems([...pokemon].sort((a, b) => a.id - b.id));
      })
      .catch(console.warn)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [names]);

  return { items, loading };
}
