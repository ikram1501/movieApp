// components/search/CategorySearch.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CategorySearchProps {
  genres: { id: number; name: string }[];
  onSelectGenre: (genreId: number) => void;
}

const CategorySearch: React.FC<CategorySearchProps> = ({ genres, onSelectGenre }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Category</Text>
      <View style={styles.genreContainer}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={styles.genreButton}
            onPress={() => onSelectGenre(genre.id)}
          >
            <Text style={styles.genreLabel}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

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
});

export default CategorySearch;
