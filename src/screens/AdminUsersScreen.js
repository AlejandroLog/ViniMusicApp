import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminUsersScreen() {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await AsyncStorage.getItem('users');
            if (data) setAllUsers(JSON.parse(data));
        };
        fetchUsers();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Usuarios Registrados</Text>
            <FlatList 
                data={allUsers}
                keyExtractor={(item) => item.email}
                renderItem={({item}) => (
                    <View style={styles.userCard}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 20, marginTop: 30 },
    userCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#e63946', elevation: 2 },
    userName: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 4 },
    userEmail: { fontSize: 14, color: '#666' }
});