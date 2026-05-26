import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Platform, StatusBar } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';
import NetInfo from "@react-native-community/netinfo";

export default function CartScreen({ navigation }) {
    const { cart, updateQuantity, removeFromCart, createOrder } = useContext(GlobalContext);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const newTotal = cart.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
        setTotal(newTotal);
    }, [cart]);

    const handleCheckout = () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Alert.alert("Error de Conexión", "No puedes realizar la compra sin internet.");
                return;
            }
            if (cart.length === 0) {
                Alert.alert("Carrito Vacío", "Agrega algunos discos antes de finalizar el pedido.");
                return;
            }
            Alert.alert(
                "Confirmar Pedido",
                `¿Deseas finalizar tu compra por $${total.toFixed(2)}?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Confirmar", onPress: async () => {
                        try {
                            await createOrder(); 
                            Alert.alert("¡Éxito!", "Tu pedido ha sido generado y guardado en la base de datos.");
                            navigation.navigate('Perfil'); 
                        } catch (error) {
                            Alert.alert("Error en el Pedido", error.toString());
                        }
                    }}
                ]
            );
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.albumName}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                
                <View style={styles.actionsContainer}>
                    <View style={styles.qtyContainer}>
                        <TouchableOpacity onPress={() => updateQuantity(item._id, item.cantidad - 1)} style={styles.qtyBtn}>
                            <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.cantidad}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item._id, item.cantidad + 1)} style={styles.qtyBtn}>
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity onPress={() => removeFromCart(item._id)} style={styles.removeBtn}>
                        <Text style={styles.removeText}>ELIMINAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <Text style={styles.title}>CARRITO</Text>
            </View>
            <FlatList
                data={cart}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.empty}>Tu caja de discos está vacía.</Text>
                        <Text style={styles.emptySub}>¡Ve a buscar algo de ruido!</Text>
                    </View>
                }
            />
            
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>TOTAL:</Text>
                    <Text style={styles.totalText}>${total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                    <Text style={styles.checkoutText}>FINALIZAR COMPRA</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFBE0' 
    },
    header: { 
        padding: 20, 
        backgroundColor: '#000000', 
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        borderBottomWidth: 4,
        borderBottomColor: '#FF784A', 
        alignItems: 'center'
    },
    title: { 
        fontSize: 26, 
        fontWeight: '900', 
        color: '#8CFF66', 
        letterSpacing: 2, 
        textTransform: 'uppercase'
    },
    listContainer: {
        padding: 15,
        paddingTop: 20,
        paddingBottom: 30
    },
    cartItem: { 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        padding: 12, 
        marginBottom: 20, 
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 0,
        shadowColor: '#000000', 
        shadowOffset: { width: 4, height: 4 }, 
        shadowOpacity: 1, 
        shadowRadius: 0, 
        elevation: 5
    },
    itemImage: { 
        width: 85, 
        height: 85, 
        borderWidth: 2,
        borderColor: '#000000',
        backgroundColor: '#eee' 
    },
    itemDetails: { 
        flex: 1, 
        marginLeft: 15,
        justifyContent: 'space-between'
    },
    itemName: { 
        fontSize: 16, 
        fontWeight: '900',
        color: '#000000',
        textTransform: 'uppercase',
        lineHeight: 18
    },
    itemPrice: { 
        color: '#FF784A', 
        fontWeight: '900',
        fontSize: 18,
        marginTop: 5
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 10
    },
    qtyContainer: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    qtyBtn: { 
        backgroundColor: '#000000', 
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000000'
    },
    qtyBtnText: {
        color: '#8CFF66', 
        fontSize: 18,
        fontWeight: '900'
    },
    qtyText: { 
        marginHorizontal: 12, 
        fontWeight: '900',
        fontSize: 16,
        color: '#000000'
    },
    removeBtn: { 
        borderBottomWidth: 2,
        borderBottomColor: '#FF784A',
        paddingBottom: 2
    },
    removeText: { 
        color: '#FF784A', 
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1
    },
    footer: { 
        backgroundColor: '#FFFFFF',
        borderTopWidth: 4, 
        borderTopColor: '#000000', 
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: '#000000',
        letterSpacing: 1
    },
    totalText: { 
        fontSize: 28, 
        fontWeight: '900', 
        color: '#000000' 
    },
    checkoutBtn: { 
        backgroundColor: '#8CFF66',
        paddingVertical: 18, 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000000',
        shadowColor: '#000000', 
        shadowOffset: { width: 4, height: 4 }, 
        shadowOpacity: 1, 
        shadowRadius: 0, 
        elevation: 5
    },
    checkoutText: { 
        color: '#000000', 
        fontSize: 18, 
        fontWeight: '900',
        letterSpacing: 1 
    },
    emptyContainer: {
        marginTop: 60,
        alignItems: 'center'
    },
    empty: { 
        fontSize: 18,
        fontWeight: '900',
        color: '#000000',
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    emptySub: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF784A'
    }
});