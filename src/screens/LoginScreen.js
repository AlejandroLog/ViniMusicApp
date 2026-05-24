import React, { useState, useRef, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const animationRef = useRef(null);

    const { setUser } = useContext(GlobalContext); 

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Ingresa correo y contraseña");
            return;
        }

        if (email === 'admin@vinia.com' && password === 'admin123') {
            const adminUser = { name: 'Admin VINIA', email, role: 'admin' };
            await AsyncStorage.setItem('currentUser', JSON.stringify(adminUser));
            setUser(adminUser);
            navigation.replace('Home');
            return;
        }

        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];

            const found = users.find(u => u.email === email && u.password === password);

            if (found) {
                const standardUser = { ...found, role: 'user' };
                await AsyncStorage.setItem('currentUser', JSON.stringify(standardUser));
                
                setUser(standardUser); 
                
                navigation.replace('Home'); 
            } else {
                Alert.alert("Error", "Credenciales incorrectas");
            }
        } catch (error) {
            Alert.alert("Error", "Hubo un problema al iniciar sesión");
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.animationContainer}>
                <LottieView
                    ref={animationRef}
                    source={require('../../assets/animations/vinil.json')} 
                    autoPlay
                    loop
                    style={styles.lottieSize}
                />
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>Inicia sesión para explorar la colección</Text>

                <View style={styles.inputGroup}>
                    <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>

                <View style={styles.passwordContainer}>
                    <TextInput style={styles.passwordInput} placeholder="Contraseña" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                        <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
                    <Text style={styles.linkText}>¿No tienes cuenta? <Text style={styles.linkTextBold}>Regístrate aquí</Text></Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    animationContainer: { flex: 0.4, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 },
    lottieSize: { width: 180, height: 180 },
    formContainer: { flex: 0.6, paddingHorizontal: 30 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#000000', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#A0A0A0', marginBottom: 30 },
    inputGroup: { marginBottom: 15 },
    input: { backgroundColor: '#fdf8f8', color: '#000000', borderWidth: 1, borderColor: '#333', padding: 15, borderRadius: 10, fontSize: 16 },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#333', borderRadius: 10, marginBottom: 25 },
    passwordInput: { flex: 1, color: '#000000', padding: 15, fontSize: 16 },
    eyeIcon: { padding: 15 },
    loginButton: { backgroundColor: '#FFFFFF', paddingVertical: 15, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
    loginButtonText: { color: '#000000', fontSize: 16, fontWeight: 'bold' },
    linkContainer: { marginTop: 25, alignItems: 'center' },
    linkText: { color: '#000000', fontSize: 14 },
    linkTextBold: { color: '#000000', fontWeight: 'bold' }
});