import React, { useState, useRef, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const animationRef = useRef(null);

    const { register } = useContext(GlobalContext);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }
        try {
            await register(name, email, password);
            Alert.alert("Éxito", "Usuario registrado correctamente");
            navigation.replace('Home');  
        } catch (error) {
            Alert.alert("Error en el Registro", error.toString());
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFBE0" />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
                            placeholderTextColor="#A3A095" 
                            value={name} 
                            onChangeText={setName} 
                            autoCapitalize="words"
                        />
                    </View>

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
                    
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Registrarse</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkContainer}>
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
        backgroundColor: '#FFFBE0' 
    },
    scrollContainer: { 
        flexGrow: 1, 
        justifyContent: 'flex-start', 
        paddingTop: Platform.OS === 'ios' ? 50 : 30, 
        paddingBottom: 30 
    },
    animationContainer: { 
        alignItems: 'center', 
        marginBottom: 10 
    },
    lottieSize: { 
        width: 140, 
        height: 140 
    },
    formContainer: { 
        paddingHorizontal: 30 
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
        marginBottom: 25,
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
        marginBottom: 25,
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
    registerButton: { 
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
    registerButtonText: { 
        color: '#000000', 
        fontSize: 16, 
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    linkContainer: { 
        marginTop: 20, 
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