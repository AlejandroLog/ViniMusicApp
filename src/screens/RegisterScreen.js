import React, { useState, useRef } from 'react';
import { 
    View, 
    TextInput, 
    Text, 
    StyleSheet, 
    Alert, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const animationRef = useRef(null);

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
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.animationContainer}>
                    <LottieView
                        ref={animationRef}
                        source={require('../../assets/animations/newuser.json')} 
                        autoPlay
                        loop
                        style={styles.lottieSize}
                    />
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <Text style={styles.subtitle}>Únete para conseguir tus formatos físicos favoritos</Text>

                    <View style={styles.inputGroup}>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Nombre completo" 
                            placeholderTextColor="#999"
                            value={name} 
                            onChangeText={setName} 
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Correo electrónico" 
                            placeholderTextColor="#999"
                            value={email} 
                            onChangeText={setEmail} 
                            keyboardType="email-address" 
                            autoCapitalize="none" 
                        />
                    </View>

                    <View style={styles.passwordContainer}>
                        <TextInput 
                            style={styles.passwordInput} 
                            placeholder="Contraseña" 
                            placeholderTextColor="#999"
                            value={password} 
                            onChangeText={setPassword} 
                            secureTextEntry={!showPassword} 
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon} 
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Registrarse</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={styles.linkContainer}
                    >
                        <Text style={styles.linkText}>¿Ya tienes cuenta? <Text style={styles.linkTextBold}>Inicia sesión</Text></Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFFFF', // Modo Claro activado
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start', // Esto asegura que todo suba
        paddingTop: Platform.OS === 'ios' ? 50 : 30, // Empuja ligeramente hacia abajo desde la barra de estado
        paddingBottom: 30,
    },
    animationContainer: {
        alignItems: 'center',
        marginBottom: 10, // Reduce el espacio entre la animación y el título
    },
    lottieSize: {
        width: 140, // Ligeramente más pequeña para ahorrar espacio vertical
        height: 140,
    },
    formContainer: {
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111111', // Texto oscuro para buen contraste
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666666', // Gris oscuro para subtítulos
        marginBottom: 25,
    },
    inputGroup: {
        marginBottom: 15,
    },
    input: { 
        backgroundColor: '#F7F7F7', // Fondo gris muy tenue para los inputs
        color: '#333333',
        borderWidth: 1, 
        borderColor: '#E0E0E0', // Borde sutil
        padding: 15, 
        borderRadius: 10, 
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        marginBottom: 25,
    },
    passwordInput: {
        flex: 1,
        color: '#333333',
        padding: 15,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 15,
    },
    registerButton: {
        backgroundColor: '#111111', // Botón principal oscuro para contrastar con el fondo blanco
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    registerButtonText: {
        color: '#FFFFFF', // Texto blanco sobre botón oscuro
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkContainer: { 
        marginTop: 20, 
        alignItems: 'center' 
    },
    linkText: { 
        color: '#666666', 
        fontSize: 14,
    },
    linkTextBold: {
        color: '#111111',
        fontWeight: 'bold',
    }
});