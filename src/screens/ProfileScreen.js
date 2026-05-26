import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
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
            "CERRAR SESIÓN",
            "¿Estás seguro de que deseas salir de tu cuenta?",
            [
                { text: "CANCELAR", style: "cancel" },
                { 
                    text: "SÍ, SALIR", 
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
            Alert.alert("ACTUALIZADO", "El pedido ha sido cancelado.");
        } catch (error) {
            Alert.alert("ERROR", error.toString());
        }
    };

    const handleDeleteOrder = (item) => {
        if (item.status !== 'Cancelado') {
            Alert.alert("ACCIÓN DENEGADA", "Debes cancelar el pedido antes de eliminarlo del historial.");
            return;
        }

        Alert.alert(
            "ELIMINAR PEDIDO",
            "¿Estás seguro de que quieres borrar este pedido permanentemente?",
            [
                { text: "NO", style: "cancel" },
                { 
                    text: "SÍ, BORRAR", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteOrder(item._id);
                            Alert.alert("ELIMINADO", "El pedido desapareció de tu historial.");
                        } catch (error) {
                            Alert.alert("ERROR", error.toString());
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
                    <Text style={styles.orderDate}>FECHA: {new Date(item.date).toLocaleDateString()}</Text>
                    <Text style={[styles.orderStatus, { color: isCancelado ? '#FF784A' : '#000000' }]}>
                        {item.status ? item.status.toUpperCase() : 'PENDIENTE'}
                    </Text>
                </View>
                
                <Text style={styles.orderTotal}>TOTAL: ${item.total.toFixed(2)}</Text>
                
                <View style={styles.orderActions}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('OrderDetail', { order: item })} 
                        style={[styles.actionBtn, styles.actionBtnDark]}
                    >
                        <Text style={styles.actionTextLight}>DETALLES</Text>
                    </TouchableOpacity>

                    {!isCancelado && (
                        <TouchableOpacity onPress={() => handleCancelOrder(item._id)} style={styles.actionBtn}>
                            <Text style={styles.actionTextDark}>CANCELAR</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                        onPress={() => handleDeleteOrder(item)} 
                        style={[
                            styles.actionBtn, 
                            { borderColor: isCancelado ? '#FF784A' : '#000000', opacity: isCancelado ? 1 : 0.5 }
                        ]}
                        disabled={!isCancelado}
                    >
                        <Text style={[styles.actionTextDark, { color: isCancelado ? '#FF784A' : '#000000' }]}>BORRAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || '?'}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.name}>{user?.name || 'USUARIO'}</Text>
                        <Text style={styles.roleLabel}>MIEMBRO VINIA</Text>
                    </View>
                </View>
                
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={styles.editBtnText}>EDITAR PERFIL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutBtnText}>SALIR</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>HISTORIAL DE PEDIDOS</Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={renderOrder}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.empty}>NO HAY PEDIDOS REGISTRADOS.</Text>
                        <Text style={styles.emptySub}>ES HORA DE ARMAR TU COLECCIÓN.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFBE0' 
    },
    header: { 
        backgroundColor: '#000000', 
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 4,
        borderBottomColor: '#FF784A' // Línea naranja vibrante
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    avatar: { 
        width: 70, 
        height: 70, 
        backgroundColor: '#000000', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#8CFF66', // Borde neón
        borderRadius: 0, // Cuadrado crudo
        shadowColor: '#8CFF66',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0
    },
    avatarText: { 
        color: '#8CFF66', 
        fontSize: 32, 
        fontWeight: '900' 
    },
    userInfo: {
        marginLeft: 15,
        flex: 1
    },
    name: { 
        fontSize: 24, 
        fontWeight: '900', 
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    roleLabel: {
        color: '#A3A095',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginTop: 4
    },
    headerButtons: { 
        flexDirection: 'row', 
        gap: 10 
    },
    editBtn: { 
        flex: 1,
        paddingVertical: 12, 
        backgroundColor: '#8CFF66', // Verde Neón
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#8CFF66'
    },
    editBtnText: { 
        fontSize: 14, 
        fontWeight: '900', 
        color: '#000000',
        letterSpacing: 1 
    },
    logoutBtn: { 
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        backgroundColor: '#FFFFFF', 
        borderWidth: 2, 
        borderColor: '#000000', 
        alignItems: 'center'
    },
    logoutBtnText: { 
        fontSize: 14, 
        fontWeight: '900', 
        color: '#FF784A', // Naranja vibrante
        letterSpacing: 1 
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        backgroundColor: '#FFFBE0'
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: '900', 
        color: '#000000',
        letterSpacing: 1
    },
    listContainer: {
        padding: 20,
        paddingBottom: 40
    },
    orderCard: { 
        backgroundColor: '#FFFFFF', 
        padding: 15, 
        marginBottom: 20, 
        // Estilo Brutalista
        borderWidth: 2, 
        borderColor: '#000000',
        borderRadius: 0,
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5
    },
    orderHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        paddingBottom: 10,
        marginBottom: 10
    },
    orderDate: { 
        fontSize: 12, 
        color: '#000000',
        fontWeight: '900'
    },
    orderStatus: { 
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1
    },
    orderTotal: { 
        fontSize: 22, 
        fontWeight: '900', 
        color: '#000000', 
        marginBottom: 15 
    },
    orderActions: { 
        flexDirection: 'row', 
        gap: 10 
    },
    actionBtn: { 
        flex: 1,
        paddingVertical: 10, 
        borderWidth: 2, 
        borderColor: '#000000',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    actionBtnDark: {
        backgroundColor: '#000000'
    },
    actionTextLight: { 
        fontSize: 12, 
        fontWeight: '900',
        color: '#8CFF66', // Letra verde neón en fondo negro
        letterSpacing: 0.5
    },
    actionTextDark: { 
        fontSize: 12, 
        fontWeight: '900',
        color: '#000000',
        letterSpacing: 0.5
    },
    emptyContainer: {
        marginTop: 40,
        alignItems: 'center'
    },
    empty: { 
        textAlign: 'center', 
        color: '#000000',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase'
    },
    emptySub: {
        textAlign: 'center',
        color: '#FF784A',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5
    }
});