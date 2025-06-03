import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Text, Button } from '@rneui/themed';
import useBooksApi from '../../hooks/useBooksApi';

export default function LibraryScreen() {
  const { loading, error, data, getAllBooks } = useBooksApi();
  
  useEffect(() => {
    getAllBooks();
  }, []);
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando libros...</Text>
      </View>
    );
  }
  
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
      {data && data.books && data.books.length > 0 ? (
        <FlatList
          data={data.books}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Image source={{ uri: item.imageLinks.thumbnail }} style={styles.bookImage} />
              <Text style={styles.title}>{item.title}</Text>
              {
                item.authors.map((author, index) => (
                  <Text key={index}>{author}</Text>
                ))
              }
            </View>
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
  bookItem: {
    flex: 1,
    padding: 15,
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