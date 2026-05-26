import React, { useState, useRef, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const animationRef = useRef(null);

    const { login } = useContext(GlobalContext); 

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Ingresa correo y contraseña");
            return;}
        try {
            const userData = await login(email, password);
            if (userData.role === 'admin') {
                navigation.replace('Home');
            } else {
                navigation.replace('Home'); 
            }
        } catch (error) {
            Alert.alert("Error de Autenticación", error.toString());
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFBE0" />
            
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
                    <TextInput 
                        style={styles.input} 
                        placeholder="Correo electrónico" 
                        placeholderTextColor="#A3A095"
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
                        placeholderTextColor="#A3A095" 
                        value={password} 
                        onChangeText={setPassword} 
                        secureTextEntry={!showPassword} 
                    />
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
    container: { 
        flex: 1, 
        backgroundColor: '#FFFBE0'
    },
    animationContainer: { 
        flex: 0.4, 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        paddingBottom: 20 
    },
    lottieSize: { 
        width: 180, 
        height: 180 
    },
    formContainer: { 
        flex: 0.6, 
        paddingHorizontal: 30,
        paddingTop: 10
    },
    title: { 
        fontSize: 34, 
        fontWeight: '900', 
        color: '#000000',
        marginBottom: 8,
        letterSpacing: -0.5
    },
    subtitle: { 
        fontSize: 16, 
        color: '#000000',
        marginBottom: 35,
        fontWeight: '500'
    },
    inputGroup: { 
        marginBottom: 16 
    },
    input: { 
        backgroundColor: '#FFFFFF',
        color: '#000000', 
        borderWidth: 1.5, 
        borderColor: '#FF784A',
        padding: 16, 
        borderRadius: 12, 
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },
    passwordContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFFFFF', 
        borderWidth: 1.5, 
        borderColor: '#FF784A',
        borderRadius: 12, 
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },
    passwordInput: { 
        flex: 1, 
        color: '#000000', 
        padding: 16, 
        fontSize: 16 
    },
    eyeIcon: { 
        padding: 15 
    },
    loginButton: { 
        backgroundColor: '#8CFF66',
        paddingVertical: 16, 
        borderRadius: 12, 
        alignItems: 'center', 
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 5, 
        elevation: 4 
    },
    loginButtonText: { 
        color: '#000000',
        fontSize: 16, 
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    linkContainer: { 
        marginTop: 25, 
        alignItems: 'center' 
    },
    linkText: { 
        color: '#000000',
        fontSize: 15 
    },
    linkTextBold: { 
        color: '#FF784A',
        fontWeight: 'bold' 
    }
});