import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native'; // Tambahkan Dimensions
import { Feather } from '@expo/vector-icons';
import { API_ACCESS_TOKEN } from '@env';
import Rekomendasi from '../components/movies/Rekomendasi';

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movieDetails, setMovieDetails] = useState<any>(null);

  useEffect(() => {
    fetchMovieDetails();
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
    width: windowWidth - 32, // Sesuaikan lebar gambar dengan lebar layar dikurangi padding
    height: 400, // Tetapkan tinggi gambar
    borderRadius: 8,
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
