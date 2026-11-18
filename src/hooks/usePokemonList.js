import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchPokemonDetails, fetchPokemonNames } from '../services/pokeapi';

const PAGE_SIZE = 20;

export function usePokemonList(query) {
  const [names, setNames] = useState([]);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const latestRequest = useRef(0);

  useEffect(() => {
    fetchPokemonNames().then(setNames).catch(() => setStatus('error'));
  }, []);

  const filteredNames = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? names.filter((name) => name.includes(term)) : names;
  }, [names, query]);

  const loadPage = useCallback(async (offset, requestId) => {
    try {
      const page = await fetchPokemonDetails(filteredNames.slice(offset, offset + PAGE_SIZE));
      if (requestId !== latestRequest.current) return;
      setItems((previous) => (offset === 0 ? page : [...previous, ...page]));
      setStatus('ready');
    } catch {
      if (requestId === latestRequest.current) setStatus('error');
    }
  }, [filteredNames]);

  useEffect(() => {
    if (names.length === 0) return;
    latestRequest.current += 1;
    setStatus('loading');
    loadPage(0, latestRequest.current);
  }, [names, loadPage]);

  const loadMore = useCallback(() => {
    if (status !== 'ready' || items.length >= filteredNames.length) return;
    setStatus('loadingMore');
    loadPage(items.length, latestRequest.current);
  }, [status, items.length, filteredNames.length, loadPage]);

  return { items, status, loadMore };
}
