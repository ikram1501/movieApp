import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  Text 
} from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieItem from '../movies/MovieItem';
import type { Movie } from '../../types/app';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MovieDetail from '../../screens/MovieDetail';

const KeywordSearch = (): JSX.Element => {
  const [keyword, setKeyword] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);

  /*  
  fungsi asinkron yang dipanggil ketika pengguna mengklik tombol "Search"
  Fungsi ini mengirimkan permintaan ke API The Movie Database (TMDB) 
  untuk mencari film berdasarkan kata kunci yang dimasukkan pengguna.
  */
  const handleSearch = async () => {
    console.log('Submitted keyword:', keyword);

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(keyword)}&page=1`, options);
      const data = await response.json();
      console.log('Keyword data:', data);

      const detailedMovies = data.results.map((movie: any) => {
        if (movie.id && movie.poster_path && movie.title) {
          return {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            vote_average: movie.vote_average,
          };
        }
        return null;
      }).filter((movie: Movie | null) => movie !== null);

      setMovies(detailedMovies as Movie[]);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 90) / numColumns; 
  const itemHeight = itemWidth * 1.4; 

  const renderItem = ({ item }: { item: Movie }) => (
    <MovieItem
      movie={item}
      size={{ width: itemWidth, height: itemHeight }}
      coverType="poster"
    />
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a keyword"
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch}
      />
      <Button title="Search" onPress={handleSearch} />
      {movies.length === 0 ? (
        <Text>No movies found.</Text>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.movieList}
        />
      )}
    </View>
  );
};

// komponen yang mengatur navigasi untuk KeywordSearch dan MovieDetail.
const Stack = createNativeStackNavigator();

const Keyword = (): JSX.Element => (
  <NavigationContainer independent={true}>
    <Stack.Navigator>
      <Stack.Screen
        name="KeywordScreen"
        component={KeywordSearch}
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
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#C0B4D5',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  movieList: {
    paddingVertical: 16,
    marginTop: 10,
  },
});

export default Keyword;
