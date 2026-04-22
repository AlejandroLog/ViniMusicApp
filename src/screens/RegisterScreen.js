import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];

            if (users.find(u => u.email === email)) {
                Alert.alert("Error", "Este correo ya está registrado");
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            await AsyncStorage.setItem('users', JSON.stringify(users));
            
            Alert.alert("Éxito", "Usuario registrado correctamente");
            navigation.goBack();
            
        } catch (error) {
            Alert.alert("Error", "No se pudo registrar el usuario");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Nombre completo" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Registrarse" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});