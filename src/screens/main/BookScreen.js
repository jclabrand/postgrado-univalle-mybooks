import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';

import { db } from '../../config/firebase';

export default function BookScreen({ route }) {
  const { book } = route.params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const getBookReviews = async () => {
    console.log("Usuarios fhrthrthgrtgh:");
    setIsLoading(true);
    try {
      const coleccionRef = collection(db, 'book_reviews');
      const q = query(coleccionRef, where("bookId", "==", book.id));
      const querySnapshot = await getDocs(q);

      const result = [];
      querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data(), user: {} });
      });
      for (const item of result) {
        const docRef = doc(db, 'usuarios', item.id);
        const userSnap = await getDoc(docRef);
        const user = userSnap.data();
        item.user = { displayName: `${user.nombre} ${user.apellido}`};
      }
      console.log("Usuarios activos:", result);
      setReviews(result);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getBookReviews()
  }, []);

  const imageUri =
    book.imageLinks?.thumbnail ||
    book.imageLinks?.smallThumbnail ||
    book.imageUrl ||
    'https://via.placeholder.com/150x220?text=Sin+Imagen';

  const authors =
    Array.isArray(book.authors)
      ? book.authors.join(', ')
      : book.author || 'Autor desconocido';

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Image source={{ uri: imageUri }} style={styles.bookImage} resizeMode="contain" />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{authors}</Text>
      <Text style={styles.description}>{book.description || 'Sin descripción.'}</Text>
      <Button
        title="Agregar reseña"
        onPress={() =>
          navigation.navigate('ReviewScreen', {
            bookId: book.id,
            bookTitle: book.title,
          })
        }
      />
      <Text style={styles.reviewTitle}>Reseñas</Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={reviews}
      keyExtractor={(_, idx) => idx.toString()}
      renderItem={({ item }) => (
        <View style={styles.reviewItem}>
          <View style={styles.userRow}>
            <Image
              source={{ uri: item.user?.photoURL || 'https://ui-avatars.com/api/?name=U' }}
              style={styles.profileImage}
            />
            <Text style={styles.reviewUser}>
              {item.user?.displayName || item.user?.email || 'Usuario'}
            </Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text
                    key={star}
                    style={star <= (item.rating || 0) ? styles.starSelected : styles.star}
                  >
                    ★
                  </Text>
                ))}
              </View>
              <Text style={[styles.reviewDate, { marginLeft: 'auto' }]}>{
                new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
              }</Text>
            </View>
            <Text style={styles.reviewText}>{item.review}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={
        isLoading
        ? <Text style={styles.noReviews}>Cargando reseñas...</Text>
        : <Text style={styles.noReviews}>No hay reseñas aún.</Text>
      }
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  bookImage: {
    width: 180,
    height: 260,
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  author: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 24,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  reviewItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  reviewText: {
    fontSize: 15,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
  noReviews: {
    color: 'gray',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  star: {
    fontSize: 20,
    color: '#ddd',
  },
  starSelected: {
    fontSize: 16,
    color: '#f39c12',
  },
});