import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async ({ email, password }) => {
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required('El campo email es requerido'),
    password: Yup.string()
      .required('La contraseña es requerida')
  });

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={values => handleLogin(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
        <View style={styles.container}>
          <Text h3 style={styles.title}>Iniciar Sesión</Text>

          <Input
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            autoCapitalize="none"
            editable={!isLoading}
          />
          {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
          
          <Input
              placeholder="Contraseña"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              editable={!isLoading}
          />
          {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
          
          <Button
            title={isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            onPress={handleSubmit}
            containerStyle={styles.button}
            disabled={!isValid || !dirty || isLoading}
            icon={isLoading ? <ActivityIndicator size="small" color="white" style={styles.loader} /> : null}
          />

          <Button 
            title="¿No tienes cuenta? Regístrate" 
            type="clear"
            onPress={() => navigation.navigate('Register')}
          />
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
});
