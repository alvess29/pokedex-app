import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export function useFavorites() {
  const [favoriteNames, setFavoriteNames] = useState([]);

  useEffect(() => {
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
    const user = auth.currentUser;
    if (!user || !pokemon) return;

    const reference = doc(db, 'users', user.uid, 'favorites', String(pokemon.id));
    if (favoriteNames.includes(pokemon.name)) {
      await deleteDoc(reference);
    } else {
      await setDoc(reference, { name: pokemon.name });
    }
  }, [favoriteNames]);

  return { favoriteNames, isFavorite, toggleFavorite };
}
