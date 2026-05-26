import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function EditProfileScreen({ navigation }) {
    // Asegúrate de que estas funciones llamen a axios.put(`/api/users/${user._id}`) y axios.delete(...)
    const { user, updateUser, deleteUser, logout } = useContext(GlobalContext);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleSave = async () => {
        if (!name || !email) {
            Alert.alert("ERROR", "Todos los campos son obligatorios.");
            return;
        }
        try {
            await updateUser(user._id, { name, email });
            Alert.alert("ACTUALIZADO", "Tu perfil ha sido modificado con éxito.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("ERROR", error.toString());
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "DESTRUIR CUENTA",
            "¿Estás seguro? Esta acción borrará tu existencia de nuestra base de datos permanentemente. No hay vuelta atrás.",
            [
                { text: "CANCELAR", style: "cancel" },
                { 
                    text: "SÍ, ELIMINAR", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteUser(user._id);
                            await logout();
                            navigation.replace('Login');
                        } catch (error) {
                            Alert.alert("ERROR", error.toString());
                        }
                    }
                }
            ]
        );
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>CONFIGURACIÓN</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NOMBRE COMPLETO</Text>
                        <TextInput 
                            style={styles.input} 
                            value={name} 
                            onChangeText={setName} 
                            placeholderTextColor="#A3A095"
                            autoCapitalize="words"
                        />
                    </View>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                        <TextInput 
                            style={styles.input} 
                            value={email} 
                            onChangeText={setEmail} 
                            keyboardType="email-address" 
                            autoCapitalize="none" 
                            placeholderTextColor="#A3A095"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                        <Text style={styles.saveBtnText}>GUARDAR CAMBIOS</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dangerZone}>
                    <Text style={styles.dangerTitle}>ZONA DE PELIGRO</Text>
                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount} activeOpacity={0.8}>
                        <Text style={styles.deleteBtnText}>ELIMINAR MI PERFIL</Text>
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
    header: { 
        backgroundColor: '#000000', 
        padding: 20, 
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        borderBottomWidth: 4, 
        borderBottomColor: '#FF784A',
        alignItems: 'center'
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: '900', 
        color: '#8CFF66', // Verde neón
        letterSpacing: 2
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40
    },
    formSection: {
        marginBottom: 40
    },
    inputGroup: {
        marginBottom: 25
    },
    label: { 
        fontSize: 14, 
        fontWeight: '900', 
        marginBottom: 8, 
        color: '#000000',
        letterSpacing: 1
    },
    input: { 
        borderWidth: 2, 
        borderColor: '#FF784A', // Naranja vibrante 
        backgroundColor: '#FFFFFF',
        padding: 16, 
        borderRadius: 0, // Brutalista, sin curvas
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000'
    },
    saveBtn: { 
        backgroundColor: '#8CFF66', // Verde Neón
        padding: 18, 
        alignItems: 'center', 
        marginTop: 10,
        // Sombra dura
        borderWidth: 2,
        borderColor: '#000000',
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4
    },
    saveBtnText: { 
        color: '#000000', 
        fontWeight: '900', 
        fontSize: 16,
        letterSpacing: 1
    },
    dangerZone: {
        marginTop: 20,
        paddingTop: 30,
        borderTopWidth: 2,
        borderTopColor: '#000000'
    },
    dangerTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#000000',
        marginBottom: 15,
        letterSpacing: 1
    },
    deleteBtn: { 
        backgroundColor: '#000000', 
        padding: 18, 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF784A', // Borde naranja sobre negro
        shadowColor: '#FF784A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4
    },
    deleteBtnText: { 
        color: '#FF784A', 
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1
    }
});