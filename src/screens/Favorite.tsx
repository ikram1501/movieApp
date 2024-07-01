import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieItem from '../components/movies/MovieItem';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MovieDetail from './MovieDetail';
import { Movie } from '../types/app';

const FavoriteScreen = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  // Fungsi asinkron untuk mengambil daftar film favorit dari AsyncStorage.
  const fetchFavoriteMovies = async () => {
    try {
      const favoriteMoviesData = await AsyncStorage.getItem('@FavoriteList');
      if (favoriteMoviesData !== null) {
        const parsedFavoriteMovies: Movie[] = JSON.parse(favoriteMoviesData);
        setFavoriteMovies(parsedFavoriteMovies);
      }
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
    }
  };

  // Menghitung lebar dan tinggi setiap item film
  // berdasarkan lebar layar dan jumlah kolom.
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 48) / numColumns;
  const itemHeight = itemWidth * 1.3;

  // Fungsi untuk merender daftar film dalam bentuk grid, 
  // menggunakan MovieItem untuk setiap film.
  const renderMovies = () => {
    const rows = Math.ceil(favoriteMovies.length / numColumns);
    const movieRows = [];

    for (let i = 0; i < rows; i++) {
      const row = favoriteMovies.slice(i * numColumns, (i + 1) * numColumns);
      const movieRow = (
        <View key={i} style={styles.row}>
          {row.map((movie, index) => (
            <MovieItem
              key={index}
              movie={movie}
              size={{ width: itemWidth, height: itemHeight }}
              coverType="poster"
            />
          ))}
        </View>
      );
      movieRows.push(movieRow);
    }

    return movieRows;
  };

  /*
  Mengembalikan tampilan yang menampilkan teks "No favorite movies found" 
  jika tidak ada film favorit, atau daftar film favorit dalam grid jika ada.
  */
  return (
    <View style={styles.container}>
      {favoriteMovies.length === 0 ? (
        <Text>No favorite movies found.</Text>
      ) : (
        <View style={styles.moviesContainer}>{renderMovies()}</View>
      )}
    </View>
  );
};

// Mengatur navigasi antara FavoriteScreen dan MovieDetail. 
const Stack = createNativeStackNavigator();

const Favorite = (): JSX.Element => (
  <NavigationContainer independent={true}>
    <Stack.Navigator>
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{ title: 'Movie Detail' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  moviesContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default Favorite;
