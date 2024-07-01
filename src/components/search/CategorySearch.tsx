import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Dimensions 
} from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieItem from '../movies/MovieItem';
import MovieDetail from '../../screens/MovieDetail';
import type { Movie } from '../../types/app';
import { useNavigation, StackActions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//mendefinisikan tipe untuk props yang diterima komponen: genres dan onSelectGenre.
interface CategorySearchProps {
  genres: { id: number; name: string }[];
  onSelectGenre: (genreId: number) => void;
}

/*
selectedGenre adalah state untuk menyimpan genre yang dipilih.
movies adalah state untuk menyimpan daftar film berdasarkan genre yang dipilih.
*/
const CategorySearch: React.FC<CategorySearchProps> = ({ genres, onSelectGenre }) => {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigation = useNavigation();

  /*
  fetchMoviesByGenre adalah fungsi asinkron 
  untuk mengambil daftar film berdasarkan genre yang dipilih dari API.
  Jika permintaan berhasil, data film disimpan dalam 
  state movies dan genre yang dipilih disimpan dalam selectedGenre.
  */
  const fetchMoviesByGenre = async (genreId: number) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=1`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const detailedMovies = data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
        }));
        setMovies(detailedMovies);
        setSelectedGenre(genreId);
      } else {
        console.error('Failed to fetch movies by genre');
      }
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
    }
  };

  // digunakan untuk menentukan tata letak grid.
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 90) / numColumns;
  const itemHeight = itemWidth * 1.4;

  // renderItem adalah fungsi untuk merender setiap item film 
  // menggunakan komponen MovieItem.
  const renderItem = ({ item }: { item: Movie }) => (
    <MovieItem
      movie={item}
      size={{ width: itemWidth, height: itemHeight }}
      coverType="poster"
    />
  );

  // pushAction digunakan untuk membuat tindakan navigasi 
  // ke layar detail film ketika sebuah film dipilih.
  const pushAction = (movieId: number) => {
    return StackActions.push('MovieDetail', { id: movieId });
  };

  /*
  Daftar genre ditampilkan menggunakan tombol yang bisa dipilih. 
  Jika genre dipilih, fetchMoviesByGenre dipanggil untuk mengambil 
  daftar film berdasarkan genre tersebut.
  Jika ada film yang diambil (movies.length > 0), 
  film tersebut ditampilkan dalam grid menggunakan FlatList.
  */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Category</Text>
      <View style={styles.genreContainer}>
        {genres.map((genre) => (
          (selectedGenre === null || selectedGenre === genre.id) && (
            <TouchableOpacity
              key={genre.id}
              style={{
                ...styles.genreButton,
                backgroundColor: selectedGenre === genre.id ? '#8978A4' : '#C0B4D5',
              }}
              onPress={() => {
                onSelectGenre(genre.id);
                fetchMoviesByGenre(genre.id);
              }}
            >
              <Text style={styles.genreLabel}>{genre.name}</Text>
            </TouchableOpacity>
          )
        ))}
      </View>
      {movies.length > 0 && (
        <FlatList
          data={movies}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.dispatch(pushAction(item.id))}
              style={styles.movieContainer}
            >
              <MovieItem movie={item} size={{ width: 100, height: 160 }} coverType="poster" />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.movieList}
        />
      )}
    </View>
  );
};
 
// komponen yang mengatur navigasi untuk CategorySearch dan MovieDetail.
// const Stack = createNativeStackNavigator();

// const Category = (): JSX.Element => (
//   <NavigationContainer independent={true}>
//     <Stack.Navigator>
//       <Stack.Screen
//         name="CategoryScreen"
//         component={CategorySearch}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="MovieDetail"
//         component={MovieDetail}
//         options={{ title: 'Movie Detail' }}
//       />
//     </Stack.Navigator>
//   </NavigationContainer>
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  genreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: 20,
    backgroundColor: '#C0B4D5',
  },
  genreLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  movieList: {
    paddingVertical: 16,
    marginTop: 10,
  },
  movieContainer: {
    marginRight: 8,
  },
});

// export default Category;
export default CategorySearch;
