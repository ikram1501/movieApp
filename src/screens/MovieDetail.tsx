import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { API_ACCESS_TOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rekomendasi from '../components/movies/Rekomendasi';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  popularity: number;
  overview: string;
}

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    checkIsFavorite(id); // Panggil checkIsFavorite saat komponen dimuat
  }, []);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const movie = await response.json();
      setMovieDetails(movie);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const checkIsFavorite = async (movieId: number): Promise<boolean> => {
    try {
      const favoriteMovies = await AsyncStorage.getItem('@FavoriteList');
      if (favoriteMovies !== null) {
        const parsedFavorites: Movie[] = JSON.parse(favoriteMovies);
        const isFav = parsedFavorites.some(movie => movie.id === movieId);
        setIsFavorite(isFav); // Update isFavorite berdasarkan hasil check
        return isFav;
      }
      return false;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  };

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = [];
      
      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie];
      } else {
        favMovieList = [movie];
      }
      
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (movieId: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      
      if (initialData !== null) {
        let favMovieList: Movie[] = JSON.parse(initialData);
        favMovieList = favMovieList.filter(movie => movie.id !== movieId);
        
        await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
        setIsFavorite(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!movieDetails) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.poster}
        source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.favoriteIcon} onPress={isFavorite ? () => removeFavorite(id) : () => addFavorite(movieDetails)}>
        <FontAwesome
          name={isFavorite ? 'heart' : 'heart-o'}
          size={24}
          color={isFavorite ? 'red' : 'black'}
        />
      </TouchableOpacity>
      <View style={styles.details}>
        <Text style={[styles.title, styles.textCenter]}>{movieDetails.title}</Text>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Feather name="star" size={24} color="yellow" style={styles.icon} />
            <Text style={styles.text}>{movieDetails.vote_average.toFixed(1)}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={[styles.text, styles.alignRight]}>{`Count: ${movieDetails.vote_count}`}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.text}>{movieDetails.release_date}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={[styles.text, styles.alignRight]}>{`Popularity: ${movieDetails.popularity.toFixed(2)}`}</Text>
          </View>
        </View>
        <Text style={styles.overview}>{movieDetails.overview}</Text>
        <Rekomendasi movieId={id} />
      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  poster: {
    width: windowWidth - 32,
    height: 400,
    borderRadius: 8,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  details: {
    marginTop: 16,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  textCenter: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 20,
  },
  alignRight: {
    textAlign: 'right',
  },
  overview: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default MovieDetail;
