import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Input, Text, Button, Overlay } from '@rneui/themed';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { auth } from '../../config/firebase';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    nombre: '', apellido: '', photo: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { logout } = useAuth();

  const loadProfile = async () => {
    setIsLoading(true);

    try {
      const docRef = doc(db, 'usuarios', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (error) {
      alert('No se pudo cargar el perfil. Inténtalo de nuevo: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);

    try {
      await setDoc(doc(db, 'usuarios', auth.currentUser.uid), profile);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      alert('Error al actualizar perfil: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const response = await fetch(result.assets[0].uri);
        const blob  = await response.blob();
        const storageRef = ref(storage, `profile_photos/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setProfile({ ...profile, photo: downloadURL });
      } catch (error) {
        if (error.code === 'storage/unauthorized') {
          alert('No tienes permiso para subir imágenes. Verifica tu sesión.');
        } else {
          alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
        }
      }
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await logout();
    setIsSigningOut(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage} disabled={isSaving}>
        <Image
          source={
            profile.photo && profile.photo.length
              ? { uri: profile.photo }
              : require('../../../assets/favicon.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.avatarText}>Cambiar foto</Text>
      </TouchableOpacity>

      <Input
        placeholder="Nombre"
        value={profile.nombre}
        onChangeText={(text) => setProfile({ ...profile, nombre: text })}
        disabled={isSaving}
      />

      <Input
        placeholder="Apellido"
        value={profile.apellido}
        onChangeText={(text) => setProfile({ ...profile, apellido: text })}
        disabled={isSaving}
      />

      <Button
        title={isSaving ? "Guardando..." : "Actualizar Perfil"}
        onPress={handleUpdate}
        containerStyle={styles.button}
        disabled={isSaving || isSigningOut}
        icon={isSaving ? <ActivityIndicator size="small" color="white" style={styles.loader} /> : null}
      />

      <Button
        title="Cerrar Sesión"
        type="outline"
        containerStyle={styles.button}
        onPress={handleSignOut}
        disabled={isSaving || isSigningOut}
      />

      <Overlay
        isVisible={isSaving}
        overlayStyle={styles.overlay}
        backdropStyle={styles.backdrop}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.overlayText}>Guardando cambios...</Text>
      </Overlay>
      <Overlay
        isVisible={isLoading}
        overlayStyle={styles.overlay}
        backdropStyle={styles.backdrop}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.overlayText}>Cargando perfil...</Text>
      </Overlay>
      <Overlay
        isVisible={isSigningOut}
        overlayStyle={styles.overlay}
        backdropStyle={styles.backdrop}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.overlayText}>Cerrando sesión...</Text>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eee',
  },
  avatarText: {
    marginTop: 8,
    color: '#007bff',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});