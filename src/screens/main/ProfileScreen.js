import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Text, Button, Overlay } from '@rneui/themed';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth } from '../../config/firebase';
import { db } from '../../config/firebase';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    nombre: '', apellido: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <View style={styles.container}>

      <Input
        placeholder="Nombre"
        value={profile.nombre}
        onChangeText={(text) => setProfile({...profile, nombre: text})}
        disabled={isSaving}/>

      <Input
        placeholder="Apellido"
        value={profile.apellido}
        onChangeText={(text) => setProfile({...profile, apellido: text})}
        disabled={isSaving}/>

      <Button
        title={isSaving ? "Guardando..." : "Actualizar Perfil"}
        onPress={handleUpdate}
        containerStyle={styles.button}
        disabled={isSaving || isSigningOut}
        icon={isSaving ? <ActivityIndicator size="small" color="white" style={styles.loader}/> : null}/>
      
      <Button 
        title="Cerrar Sesión" 
        type="outline"
        containerStyle={styles.button}
      />

      <Overlay 
        isVisible={isSaving} 
        overlayStyle={styles.overlay}
        backdropStyle={styles.backdrop}>
        <ActivityIndicator size="large" color="#0066cc"/>
        <Text style={styles.overlayText}>Guardando cambios...</Text>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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