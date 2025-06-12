import React, { createContext, useState, useContext } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth } from '../config/firebase';
import { db } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      const docRef = doc(db, 'usuarios', auth.currentUser.uid);
      const docSnapshot = await getDoc(docRef);
      let data;
      if (docSnapshot.exists()) {
        data = docSnapshot.data();
      } else {
        data = { nombre: '', apellido: '' };
        await setDoc(doc(db, 'usuarios', auth.currentUser.uid), data);
      }
      setUser({
        ...data,
        uid: auth.currentUser.uid,
      });
      setIsAuthenticated(true);
    } catch (error) {
      alert('No se pudo cargar el perfil. Inténtalo de nuevo: ' + error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
