import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            const userData = await AsyncStorage.getItem('currentUser');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };
        getUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('currentUser');
            navigation.replace('Login'); 
        } catch (error) {
            Alert.alert("Error", "No se pudo cerrar la sesión");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>
                ¡Bienvenido a VINIA, {user ? user.name : 'Usuario'}!
            </Text>
            <Text style={styles.infoText}>Pronto aquí verás tu catálogo de vinilos.</Text>
            
            <Button title="Cerrar Sesión" color="red" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    welcomeText: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    infoText: { fontSize: 16, color: 'gray', marginBottom: 30 }
});