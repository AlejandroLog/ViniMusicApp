import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

export default function OrderDetailScreen({ route }) {
    const { order } = route.params;

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.albumName}</Text>
                <Text style={styles.productArtist}>{item.artistName}</Text>
                <Text style={styles.productPrice}>
                    ${item.price.toFixed(2)} x {item.cantidad}
                </Text>
            </View>
            <Text style={styles.productTotal}>
                ${(item.price * item.cantidad).toFixed(2)}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.orderId}>Detalles del Pedido: #{order.id.slice(-6)}</Text>
                <Text style={styles.orderDate}>Fecha de compra: {order.date}</Text>
                <Text style={[styles.orderStatus, { color: order.status === 'Cancelado' ? 'red' : '#28a745' }]}>
                    Estado: {order.status}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Productos adquiridos:</Text>
            
            <FlatList
                data={order.items}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <Text style={styles.totalLabel}>Total Pagado:</Text>
                <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f4' },
    header: { backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    orderId: { fontSize: 18, fontWeight: 'bold', color: '#111' },
    orderDate: { fontSize: 14, color: '#666', marginTop: 5 },
    orderStatus: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', margin: 20, color: '#333' },
    list: { paddingHorizontal: 20, paddingBottom: 20 },
    productCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center', elevation: 2 },
    image: { width: 60, height: 60, borderRadius: 5 },
    productInfo: { flex: 1, marginLeft: 15 },
    productName: { fontSize: 15, fontWeight: 'bold', color: '#111' },
    productArtist: { fontSize: 13, color: '#666' },
    productPrice: { fontSize: 14, color: '#e63946', marginTop: 5, fontWeight: '500' },
    productTotal: { fontSize: 16, fontWeight: 'bold', color: '#111', marginLeft: 10 },
footer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: 15,
        paddingBottom: 40,
        backgroundColor: '#fff', 
        borderTopWidth: 1, 
        borderTopColor: '#ddd' 
    },    totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#e63946' }
});