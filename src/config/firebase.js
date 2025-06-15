import { initializeApp, getApps } from 'firebase/app';
import { connectAuthEmulator, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage'; // <-- Importa storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
};
const localEmulatorIp = '192.168.100.6';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);
const storage = getStorage(app);

connectAuthEmulator(auth, `http://${localEmulatorIp}:9099`, { disableWarnings: true });
connectFirestoreEmulator(db, localEmulatorIp, 9080);
connectStorageEmulator(storage, localEmulatorIp, 9199);

export { auth, db, storage };
