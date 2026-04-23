import React, { useContext } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs'; 
import { Ionicons } from '@expo/vector-icons';

// 1. Importamos el Contexto para saber el rol del usuario
import { GlobalContext } from '../context/GlobalContext';

// Importación de todas las pantallas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import RadiotecaScreen from '../screens/RadiotecaScreen';
import RadiotecaDetailScreen from '../screens/RadiotecaDetailScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';

// 2. Importamos las nuevas pantallas del Admin (las crearemos en el siguiente paso)
import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminAddProductScreen from '../screens/AdminAddProductScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  // 3. Obtenemos al usuario y verificamos si es admin
  const { user } = useContext(GlobalContext);
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#e63946',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#eee' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Iconos para todos
          if (route.name === 'Tienda') iconName = focused ? 'albums' : 'albums-outline';
          if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          
          // Iconos para clientes
          if (route.name === 'Radioteca') iconName = focused ? 'radio' : 'radio-outline';
          if (route.name === 'Carrito') iconName = focused ? 'cart' : 'cart-outline';
          
          // Iconos para Admin
          if (route.name === 'Usuarios') iconName = focused ? 'people' : 'people-outline';
          if (route.name === 'Gestionar') iconName = focused ? 'add-circle' : 'add-circle-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBar={(props) => (
        <View style={{ backgroundColor: '#fff' }}>
          {/* El reproductor se queda intacto sonando para todos */}
          <GlobalAudioPlayer />
          <BottomTabBar {...props} />
        </View>
      )}
    >
      {/* Pestaña común: Todos ven la Tienda */}
      <Tab.Screen name="Tienda" component={HomeScreen} />

      {/* Pestañas condicionales */}
      {isAdmin ? (
        <Tab.Group>
          <Tab.Screen name="Usuarios" component={AdminUsersScreen} />
          <Tab.Screen name="Gestionar" component={AdminAddProductScreen} />
        </Tab.Group>
      ) : (
        <Tab.Group>
          <Tab.Screen name="Radioteca" component={RadiotecaScreen} />
          <Tab.Screen name="Carrito" component={CartScreen} />
        </Tab.Group>
      )}

      {/* Pestaña común: Todos ven su Perfil */}
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Crear Cuenta' }} />
      
      <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
      
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Detalles del Disco' }} />
      <Stack.Screen name="RadiotecaDetail" component={RadiotecaDetailScreen} options={{ title: 'Info de Radioteca' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Detalle del Pedido' }} />
    </Stack.Navigator>
  );
}