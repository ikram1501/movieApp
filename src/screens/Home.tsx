import React from 'react';
import { ScrollView, View, StatusBar, StyleSheet } from 'react-native';
import type { MovieListProps } from '../types/app'; // Pastikan file types/app.ts ada dan tidak ada kesalahan di dalamnya.
import MovieList from '../components/movies/MovieList'; // Pastikan jalur ke komponen MovieList benar dan komponen ini tidak mengalami kesalahan.

const movieLists: MovieListProps[] = [
  {
    title: 'Now Playing in Theater',
    path: 'movie/now_playing?language=en-US&page=1',
    coverType: 'backdrop',
  },
  {
    title: 'Upcoming Movies',
    path: 'movie/upcoming?language=en-US&page=1',
    coverType: 'poster',
  },
  {
    title: 'Top Rated Movies',
    path: 'movie/top_rated?language=en-US&page=1',
    coverType: 'poster',
  },
  {
    title: 'Popular Movies',
    path: 'movie/popular?language=en-US&page=1',
    coverType: 'poster',
  },
];

const Home = (): JSX.Element => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {movieLists.map((movieList) => (
          <MovieList
            title={movieList.title}
            path={movieList.path}
            coverType={movieList.coverType}
            key={movieList.title} // Pastikan bahwa title dari setiap elemen di movieLists benar dan unik.
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight ?? 32, // Pastikan StatusBar.currentHeight tidak menyebabkan masalah.
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 16, // Pastikan rowGap didukung di versi React Native yang Anda gunakan.
  },
});

export default Home;
