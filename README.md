# Pokédex

App em React Native com Expo que consome a [PokéAPI](https://pokeapi.co/docs/v2) e exibe uma lista de Pokémon com busca, paginação infinita e tela de detalhes. Os favoritos são salvos no Firebase (Authentication anônimo e Cloud Firestore), então persistem entre sessões.

## Como rodar

```bash
npm install
cp .env.example .env
npx expo start
```

Preencha o `.env` com as chaves do app web do seu projeto Firebase (Configurações do projeto, Seus apps).

## Configuração do Firebase

1. Crie um projeto no [console do Firebase](https://console.firebase.google.com/).
2. Em Authentication, ative o provedor Anônimo.
3. Em Firestore Database, crie o banco e publique as regras do arquivo `firestore.rules`.
4. Registre um app Web e copie as chaves para o `.env`.

## Deploy da versão web no Netlify

O arquivo `netlify.toml` já define o build (`npx expo export --platform web`) e a pasta publicada (`dist`). No Netlify, importe o repositório e cadastre as mesmas variáveis `EXPO_PUBLIC_FIREBASE_*` em Site configuration, Environment variables. O Render não é necessário, pois o app não possui backend próprio.

## Estrutura

```
App.js
src/
  components/   PokemonCard, PokemonModal, TypeBadge
  hooks/        usePokemonList, useFavorites, useFavoritePokemon
  services/     pokeapi, firebase
  utils/        format
  theme.js
```
