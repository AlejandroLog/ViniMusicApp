import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { GlobalContext } from '../context/GlobalContext';

export default function ProfileScreen({ navigation }) {
    const { user, setUser, orders, deleteOrder, updateOrder } = useContext(GlobalContext);

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que deseas salir de tu cuenta?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sí, salir", 
                    style: "destructive", 
                    onPress: async () => {
                        await AsyncStorage.removeItem('currentUser'); 
                        if (setUser) setUser(null); 
                        navigation.replace('Login'); 
                    }
                }
            ]
        );
    };

    const handleDeleteOrder = (item) => {
        if (item.status !== 'Cancelado') {
            Alert.alert(
                "Acción no permitida", 
                "Debes cancelar el pedido antes de poder eliminarlo de tu historial."
            );
            return;
        }

        Alert.alert(
            "Eliminar Pedido",
            "¿Estás seguro de que quieres borrar este pedido del historial?",
            [
                { text: "No", style: "cancel" },
                { 
                    text: "Sí, borrar", 
                    style: "destructive", 
                    onPress: () => deleteOrder(item.id) 
                }
            ]
        );
    };

    const renderOrder = ({ item }) => {
        const isCancelado = item.status === 'Cancelado';

        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <Text style={[styles.orderStatus, { color: isCancelado ? 'red' : '#666' }]}>
                    Estado: {item.status || 'Pendiente'}
                </Text>
                <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
                
                <View style={styles.orderActions}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('OrderDetail', { order: item })}
                        style={[styles.actionBtn, { backgroundColor: '#111', borderColor: '#111' }]}
                    >
                        <Text style={[styles.actionText, { color: '#fff' }]}>Ver Detalles</Text>
                    </TouchableOpacity>

                    {!isCancelado && (
                        <TouchableOpacity 
                            onPress={() => updateOrder(item.id, 'Cancelado')}
                            style={styles.actionBtn}
                        >
                            <Text style={styles.actionText}>Cancelar</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                        onPress={() => handleDeleteOrder(item)}
                        style={[styles.actionBtn, { borderColor: isCancelado ? 'red' : '#ccc' }]}
                    >
                        <Text style={[styles.actionText, { color: isCancelado ? 'red' : '#ccc' }]}>
                            Borrar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.name}>{user?.name}</Text>
                
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={styles.editBtnText}>Editar Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Historial de Pedidos</Text>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrder}
                ListEmptyComponent={<Text style={styles.empty}>No hay pedidos registrados.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: { alignItems: 'center', marginVertical: 20 },
    avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    name: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
    
    headerButtons: { flexDirection: 'row', marginTop: 15, gap: 10 },
    editBtn: { paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#eee', borderRadius: 5 },
    editBtnText: { fontSize: 14, fontWeight: 'bold', color: '#111' },
    logoutBtn: { paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: 'red', borderRadius: 5 },
    logoutBtnText: { fontSize: 14, fontWeight: 'bold', color: 'red' },
    
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
    orderCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    orderId: { fontWeight: 'bold' },
    orderDate: { fontSize: 12, color: '#666' },
    orderStatus: { color: '#666', marginTop: 5, fontWeight: 'bold' },
    orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#e63946', marginTop: 5 },
    orderActions: { flexDirection: 'row', marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
    actionBtn: { marginRight: 15, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: '#ccc' },
    actionText: { fontSize: 12, fontWeight: 'bold' },
    empty: { textAlign: 'center', color: '#999', marginTop: 20 }
});