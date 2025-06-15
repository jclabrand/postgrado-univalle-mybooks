# BookRev

MyBooks es una aplicación móvil desarrollada con **React Native** que permite a los usuarios buscar libros, agregarlos a su biblioteca personal, escribir reseñas y calificar libros con estrellas. Utiliza **Firebase** (Firestore, Auth y Storage) como backend y soporta tanto el uso en la nube como con emuladores locales para desarrollo.

## Características

- **Autenticación de usuarios** (Firebase Auth)
- **Búsqueda y visualización de libros**
- **Agregar/quitar libros de la biblioteca personal**
- **Escribir y ver reseñas de libros**
- **Calificación por estrellas**
- **Subida y visualización de foto de perfil**
- **Soporte para emuladores de Firebase en desarrollo**

## Estructura del proyecto

```
src/
  ├── config/           # Configuración de Firebase
  ├── context/          # Contextos globales (Auth, etc.)
  ├── screens/          # Pantallas principales (BookScreen, ProfileScreen, ReviewScreen, etc.)
  ├── assets/           # Imágenes y recursos estáticos
  └── App.js            # Punto de entrada principal
```

## Instalación

1. **Clona el repositorio**
   ```sh
   git clone https://github.com/jclabrand/postgrado-univalle-mybooks
   cd postgrado-univalle-mybooks
   ```

2. **Instala dependencias**
   ```sh
   npm install
   # o
   yarn install
   ```

3. **Instala dependencias nativas necesarias**
   ```sh
   npx expo install expo-image-picker
   npm install @react-native-async-storage/async-storage
   npm install buffer
   ```

4. **Configura Firebase**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Copia tu configuración en `src/config/firebase.js`
   - Para desarrollo local, asegúrate de tener los emuladores de Firebase corriendo:
     ```sh
     firebase emulators:start
     ```

## Uso de emuladores de Firebase

El proyecto está preparado para conectarse a los emuladores de Auth, Firestore y Storage en desarrollo.  
Asegúrate de que los puertos y la IP local estén correctamente configurados en `src/config/firebase.js`.

## Scripts útiles

- **Iniciar la app en desarrollo**
  ```sh
  npx expo start
  ```

- **Iniciar emuladores de Firebase**
  ```sh
  firebase emulators:start
  ```

## Notas técnicas

- Para subir imágenes a Firebase Storage en React Native/Hermes, se utiliza una conversión manual de base64 a bytes.
- El proyecto utiliza `expo-image-picker` para seleccionar imágenes de perfil.
- El manejo de fechas y ratings está adaptado para el entorno móvil y español.

## Licencia

MIT

---

Juan Carlos Labrandero Cervantes
