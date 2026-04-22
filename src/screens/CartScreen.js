import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
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
                Alert.alert("Error de Conexión", "No puedes realizar la compra sin internet. Por favor verifica tu red.");
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
                    { text: "Confirmar", onPress: () => {
                        createOrder(total);
                        Alert.alert("¡Éxito!", "Tu pedido ha sido generado y el carrito se ha vaciado.");
                    }}
                ]
            );
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.albumName}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                
                <View style={styles.qtyContainer}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, item.cantidad - 1)} style={styles.qtyBtn}>
                        <Text>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.cantidad}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, item.cantidad + 1)} style={styles.qtyBtn}>
                        <Text>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
                <Text style={styles.removeText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tu Carrito</Text>
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>El carrito está vacío</Text>}
            />
            
            <View style={styles.footer}>
                <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
                <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                    <Text style={styles.checkoutText}>Finalizar Compra</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 30 },
    cartItem: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 },
    itemImage: { width: 70, height: 70, borderRadius: 5 },
    itemDetails: { flex: 1, marginLeft: 15 },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    itemPrice: { color: '#e63946', fontWeight: 'bold' },
    qtyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    qtyBtn: { backgroundColor: '#ddd', paddingHorizontal: 10, borderRadius: 5 },
    qtyText: { marginHorizontal: 10, fontWeight: 'bold' },
    removeBtn: { justifyContent: 'center' },
    removeText: { color: 'red', fontSize: 12 },
    footer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20 },
    totalText: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginBottom: 15 },
    checkoutBtn: { backgroundColor: '#111', padding: 15, borderRadius: 8, alignItems: 'center' },
    checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    empty: { textAlign: 'center', marginTop: 50, color: '#888' }
});