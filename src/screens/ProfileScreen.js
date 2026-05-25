import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GlobalContext } from '../context/GlobalContext';

export default function ProfileScreen({ navigation }) {
    // Asegúrate de tener estas funciones mapeadas en tu GlobalContext hacia axios
    const { user, logout, orders, fetchUserOrders, cancelOrder, deleteOrder } = useContext(GlobalContext);

    // Recargar el historial cuando el perfil se muestre en pantalla
    useFocusEffect(
        React.useCallback(() => {
            if (user && user._id) {
                fetchUserOrders(user._id);
            }
        }, [user])
    );

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
                        await logout();
                        navigation.replace('Login'); 
                    }
                }
            ]
        );
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId);
            Alert.alert("Actualizado", "El pedido ha sido cancelado.");
        } catch (error) {
            Alert.alert("Error", error.toString());
        }
    };

    const handleDeleteOrder = (item) => {
        if (item.status !== 'Cancelado') {
            Alert.alert("Acción no permitida", "Debes cancelar el pedido antes de eliminarlo del historial.");
            return;
        }

        Alert.alert(
            "Eliminar Pedido",
            "¿Estás seguro de que quieres borrar este pedido permanentemente?",
            [
                { text: "No", style: "cancel" },
                { 
                    text: "Sí, borrar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteOrder(item._id);
                            Alert.alert("Eliminado", "El pedido desapareció de tu historial.");
                        } catch (error) {
                            Alert.alert("Error", error.toString());
                        }
                    } 
                }
            ]
        );
    };

    const renderOrder = ({ item }) => {
        const isCancelado = item.status === 'Cancelado';

        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    {/* Convertir la fecha de MongoDB a formato legible */}
                    <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <Text style={[styles.orderStatus, { color: isCancelado ? 'red' : '#666' }]}>
                    Estado: {item.status || 'Pendiente'}
                </Text>
                <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
                
                <View style={styles.orderActions}>
                    <TouchableOpacity onPress={() => navigation.navigate('OrderDetail', { order: item })} style={[styles.actionBtn, { backgroundColor: '#111', borderColor: '#111' }]}>
                        <Text style={[styles.actionText, { color: '#fff' }]}>Ver Detalles</Text>
                    </TouchableOpacity>

                    {!isCancelado && (
                        <TouchableOpacity onPress={() => handleCancelOrder(item._id)} style={styles.actionBtn}>
                            <Text style={styles.actionText}>Cancelar</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => handleDeleteOrder(item)} style={[styles.actionBtn, { borderColor: isCancelado ? 'red' : '#ccc' }]}>
                        <Text style={[styles.actionText, { color: isCancelado ? 'red' : '#ccc' }]}>Borrar</Text>
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
                keyExtractor={(item) => item._id}
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
    orderDate: { fontSize: 12, color: '#666' },
    orderStatus: { color: '#666', marginTop: 5, fontWeight: 'bold' },
    orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#e63946', marginTop: 5 },
    orderActions: { flexDirection: 'row', marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
    actionBtn: { marginRight: 15, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: '#ccc' },
    actionText: { fontSize: 12, fontWeight: 'bold' },
    empty: { textAlign: 'center', color: '#999', marginTop: 20 }
});