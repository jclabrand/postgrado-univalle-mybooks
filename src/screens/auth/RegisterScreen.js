import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async ({ email, password }) => {
    setError('');
    setIsLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      setError('Error al registrarse: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required('El campo email es requerido'),
    password: Yup.string()
      .min(8, 'La contraseña debe contener mínimo 8 caracteres')
      .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
      .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)')
      .required('La contraseña es requerida'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
      .required('La confirmación de contraseña es requerida')
  });

  return (
    <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={values => handleRegister(values)}>
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text h3 style={styles.title}>Registro</Text>

          <Input
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            autoCapitalize="none"
            editable={!isLoading}/>
          {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Input
              placeholder="Contraseña"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              editable={!isLoading}/>
          {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
          
          <Input
            placeholder="Confirmar contraseña"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            secureTextEntry
            editable={!isLoading}/>
          {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

          <Button
            title={isLoading ? "Registrando..." : "Registrarse"}
            onPress={handleSubmit}
            containerStyle={styles.button}
            disabled={isLoading}
            icon={isLoading ? <ActivityIndicator size="small" color="white" style={styles.loader} /> : null}/>
          
          <Button 
            title="¿Ya tienes cuenta? Inicia sesión" 
            type="clear"
            onPress={() => navigation.navigate('Login')}
            containerStyle={styles.button}
            disabled={isLoading}/>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    marginTop: -10,
  },
});
