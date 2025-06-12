import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import { collection, query, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import useBooksApi from '../../hooks/useBooksApi';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

function ItemBook({ id }) {
  const { loading, error, data, getBookById } = useBooksApi();
  const navigation = useNavigation();

  useEffect(() => {
    getBookById(id)
  }, [id]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return data && data.book ? (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookScreen', { book: data.book })}
    >
      <Image source={{ uri: data.book.imageLinks.thumbnail }} style={styles.bookImage} />
      <Text style={styles.title}>{data.book.title}</Text>
      {
        data.book.authors && (data.book.authors.length > 0) && data.book.authors.map((author, index) => (
          <Text key={index}>{author}</Text>
        ))
      }
    </TouchableOpacity>
  ) : null;
}

export default function MyBooksScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState([]);

  const getUserLibrary = async () => {
    setIsLoading(true);
    try {
      const coleccionRef = collection(db, 'libraries', user.uid, 'books');
      const querySnapshot = await getDocs(query(coleccionRef));
      const result = [];
      querySnapshot.forEach((doc) => result.push({ id: doc.id }));
      setBooks(result)
    } catch (error) {
      console.error("Error al obtener datos de la libreria:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getUserLibrary();
    }, [])
  );

  return (
    <View style={styles.container}>
      {
        isLoading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Cargando libros...</Text>
          </View>
        )
      }
      {books.length > 0 ? (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <ItemBook id={item.id}>
            </ItemBook>
          )}
        />
      ) : (
        <Text style={styles.noBooks}>No hay libros en tu libreria</Text>
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
  noBooks: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
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
  title: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});
