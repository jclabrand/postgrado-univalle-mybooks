import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Image, TextInput, TouchableOpacity } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import useBooksApi from '../../hooks/useBooksApi';

export default function LibraryScreen() {
  const { loading, error, data, getAllBooks, searchBooks } = useBooksApi();
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    if (query.length < 3) {
      getAllBooks();
      return;
    }

    searchBooks(query)

  }, [searchQuery]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
        <Button title="Reintentar" onPress={getAllBooks} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar libros..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {
        loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Cargando libros...</Text>
          </View>
        )
      }
      {data && data.books && data.books.length > 0 ? (
        <FlatList
          data={data.books}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookItem}
              onPress={() => navigation.navigate('BookScreen', { book: item })}
            >
              <Image source={{ uri: item.imageLinks.thumbnail }} style={styles.bookImage} />
              <Text style={styles.title}>{item.title}</Text>
              {
                item.authors && (item.authors.length > 0) && item.authors.map((author, index) => (
                  <Text key={index}>{author}</Text>
                ))
              }
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noBooks}>No hay libros disponibles</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  bookItem: {
    flex: 1,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookImage: {
    width: 150,
    height: 220,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  noBooks: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});