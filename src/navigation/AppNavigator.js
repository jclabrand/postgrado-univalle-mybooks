import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import BookScreen from '../screens/main/BookScreen';
import ReviewScreen from '../screens/main/ReviewScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {
        isAuthenticated
        ? (
          <Stack.Navigator>
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BookScreen"
              component={BookScreen}
              options={{ title: 'Detalles del Libro' }}
            />
            <Stack.Screen
              name="ReviewScreen"
              component={ReviewScreen}
              options={({ route }) => ({ title: `Reseñas de ${route.params.bookTitle}` })}
            />
          </Stack.Navigator>
        )
        : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </Stack.Navigator>
        )
      }
    </NavigationContainer>
  );
}
