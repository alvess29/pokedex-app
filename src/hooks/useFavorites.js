import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db, firebaseEnabled } from '../services/firebase';

export function useFavorites() {
  const [favoriteNames, setFavoriteNames] = useState([]);

  useEffect(() => {
    if (!firebaseEnabled) return;

    let stopListening = () => {};

    const stopAuth = onAuthStateChanged(auth, (user) => {
      stopListening();
      if (!user) {
        signInAnonymously(auth).catch(console.warn);
        return;
      }
      stopListening = onSnapshot(collection(db, 'users', user.uid, 'favorites'), (snapshot) => {
        setFavoriteNames(snapshot.docs.map((document) => document.data().name));
      });
    });

    return () => {
      stopListening();
      stopAuth();
    };
  }, []);

  const isFavorite = useCallback((name) => favoriteNames.includes(name), [favoriteNames]);

  const toggleFavorite = useCallback(async (pokemon) => {
    if (!pokemon) return;
    const alreadyFavorite = favoriteNames.includes(pokemon.name);

    if (!firebaseEnabled) {
      setFavoriteNames((previous) =>
        alreadyFavorite ? previous.filter((name) => name !== pokemon.name) : [...previous, pokemon.name]
      );
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    const reference = doc(db, 'users', user.uid, 'favorites', String(pokemon.id));
    if (alreadyFavorite) {
      await deleteDoc(reference);
    } else {
      await setDoc(reference, { name: pokemon.name });
    }
  }, [favoriteNames]);

  return { favoriteNames, isFavorite, toggleFavorite };
}
