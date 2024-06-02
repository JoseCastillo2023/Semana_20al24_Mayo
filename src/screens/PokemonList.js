import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, TextInput, ActivityIndicator, Alert } from 'react-native';
import PokemonItem from '../components/PokemonItem';

const WIDTH = Dimensions.get('window').width;
const numColumns = 2;

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nombrePokemon, setNombrePokemon] = useState('');
  const [allPokemon, setAllPokemon] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let allPokemonList = [];
      let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';

      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error(`Error de la solicitud: ${response.status}`);
        }
        const data = await response.json();
        allPokemonList = [...allPokemonList, ...data.results];
        nextUrl = data.next;
      }

      setAllPokemon(allPokemonList);
      setPokemon(allPokemonList);
    } catch (error) {
      console.log("Hubo un error al obtener la lista de Pokémon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchPokemon = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`Error de la solicitud: ${response.status}`);
      }
      const data = await response.json();
      setPokemon([data]);
    } catch (error) {
      console.log("Hubo un error al obtener el Pokémon:", error);
      Alert.alert('Error', 'No se pudo encontrar el Pokémon. Verifique el nombre ingresado.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (nombrePokemon.trim() !== '') {
      searchPokemon();
    } else {
      setPokemon(allPokemon);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de pokemon"
          onChangeText={setNombrePokemon}
          value={nombrePokemon}
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={pokemon}
          renderItem={({ item }) => (
            <PokemonItem item={item} />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87ceeb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    width: '70%',
    backgroundColor: '#BC123A',
    height: 50,
    fontWeight: '900',
    borderRadius: 5,
    margin: 5,
    fontSize: 18,
  },
  list: {
    justifyContent: 'center',
  },
  loading: {
    marginTop: 20,
  },
});

export default PokemonList;
