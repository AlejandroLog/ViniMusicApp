import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Ingresa correo y contraseña");
            return;
        }

        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                await AsyncStorage.setItem('currentUser', JSON.stringify(user));
                navigation.replace('Home'); 
            } else {
                Alert.alert("Error", "Credenciales incorrectas");
            }
        } catch (error) {
            Alert.alert("Error", "Hubo un problema al iniciar sesión");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            
            <Button title="Iniciar Sesión" onPress={handleLogin} />

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
                <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
    linkContainer: { marginTop: 20, alignItems: 'center' },
    linkText: { color: 'blue', textDecorationLine: 'underline' }
});