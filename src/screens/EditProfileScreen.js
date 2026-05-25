import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function EditProfileScreen({ navigation }) {
    // Asegúrate de que estas funciones llamen a axios.put(`/api/users/${user._id}`) y axios.delete(...)
    const { user, updateUser, deleteUser, logout } = useContext(GlobalContext);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleSave = async () => {
        if (!name || !email) {
            Alert.alert("Error", "Campos obligatorios");
            return;
        }
        try {
            await updateUser(user._id, { name, email });
            Alert.alert("Éxito", "Perfil actualizado en la base de datos");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", error.toString());
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Eliminar Cuenta",
            "¿Estás seguro? Se borrará tu cuenta de la base de datos permanentemente.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: async () => {
                    try {
                        await deleteUser(user._id);
                        await logout();
                        navigation.replace('Login');
                    } catch (error) {
                        Alert.alert("Error", error.toString());
                    }
                }}
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.btnText}>Guardar Cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
                <Text style={styles.deleteText}>Eliminar mi Perfil</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 20 },
    saveBtn: { backgroundColor: '#111', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    deleteBtn: { padding: 15, alignItems: 'center' },
    deleteText: { color: 'red', fontWeight: 'bold' }
});