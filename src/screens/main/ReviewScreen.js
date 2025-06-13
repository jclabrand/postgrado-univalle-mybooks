import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Formik } from 'formik';
import { doc, setDoc } from 'firebase/firestore';

import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

export default function ReviewScreen({ route }) {
  const { bookId } = route.params;
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSendReview = async (values) => {
    setIsSaving(true);

    try {
      const data = { bookId, ...values, date: new Date().getTime() }
      await setDoc(doc(db, 'book_reviews', user.uid), data);
      alert('Reseña enviada');
    } catch (error) {
      alert('Error al guardar reseña: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  const renderStars = (setFieldValue) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => {
          setRating(star);
          setFieldValue('rating', star);
        }}>
          <Text style={star <= rating ? styles.starSelected : styles.star}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar reseña</Text>

      <Formik
        initialValues={{ review: '', rating: 0 }}
        onSubmit={handleSendReview}
      >
        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
          <>
            <Text style={styles.label}>Calificación:</Text>
            {renderStars(setFieldValue)}
            <TextInput
              style={styles.input}
              placeholder="Escribe tu reseña..."
              value={values.review}
              onChangeText={handleChange('review')}
              onBlur={handleBlur('review')}
              multiline
            />
            <Button title="Enviar" onPress={handleSubmit} />
          </>
        )}
      </Formik>

      <Overlay
        isVisible={isSaving}
        overlayStyle={styles.overlay}
        backdropStyle={styles.backdrop}
      >
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.overlayText}>Guardando cambios...</Text>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  star: {
    fontSize: 32,
    color: '#ccc',
    marginHorizontal: 2,
  },
  starSelected: {
    fontSize: 32,
    color: '#FFD700',
    marginHorizontal: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    minHeight: 40,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 20,
    marginTop: -10,
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayText: {
    marginTop: 10,
    fontSize: 16,
  }
});