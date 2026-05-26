import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Platform, StatusBar } from 'react-native';

export default function OrderDetailScreen({ route }) {
    const { order } = route.params;
    const isCancelado = order.status === 'Cancelado';

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.albumName}</Text>
                <Text style={styles.productArtist}>{item.artistName}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>
                        ${item.price.toFixed(2)} <Text style={styles.qtyText}>x {item.cantidad}</Text>
                    </Text>
                </View>
            </View>
            <View style={styles.totalBlock}>
                <Text style={styles.productTotal}>
                    ${(item.price * item.cantidad).toFixed(2)}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            
            <View style={styles.header}>
                <Text style={styles.orderIdLabel}>ORDEN NO.</Text>
                <Text style={styles.orderId}>{order?._id?.slice(-6).toUpperCase() || 'N/A'}</Text>
                
                <Text style={styles.orderDate}>EMITIDA: {new Date(order.date).toLocaleDateString()}</Text>
                
                <View style={[styles.statusBadge, { backgroundColor: isCancelado ? '#FF784A' : '#8CFF66' }]}>
                    <Text style={styles.orderStatus}>
                        ESTADO: {order.status ? order.status.toUpperCase() : 'PENDIENTE'}
                    </Text>
                </View>
            </View>

            <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>MANIFIESTO DE DISCOS</Text>
            </View>
            
            <FlatList
                data={order.items}
                keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <Text style={styles.totalLabel}>TOTAL FACTURADO:</Text>
                <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
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
        backgroundColor: '#000000', 
        padding: 20, 
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        borderBottomWidth: 4, 
        borderBottomColor: '#FF784A' 
    },
    orderIdLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '900',
        letterSpacing: 2
    },
    orderId: { 
        fontSize: 32, 
        fontWeight: '900', 
        color: '#8CFF66', // Verde Neón
        marginBottom: 10,
        letterSpacing: 1
    },
    orderDate: { 
        fontSize: 14, 
        color: '#FFFFFF', 
        fontWeight: 'bold',
        marginBottom: 15,
        letterSpacing: 1
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 2,
        borderColor: '#000000',
        transform: [{ rotate: '-1deg' }] // Estilo sello estampado
    },
    orderStatus: { 
        fontSize: 14, 
        fontWeight: '900', 
        color: '#000000',
        letterSpacing: 1
    },
    sectionTitleContainer: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 15,
        backgroundColor: '#FFFBE0',
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        marginBottom: 20
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: '900', 
        color: '#000000',
        letterSpacing: 1
    },
    list: { 
        paddingHorizontal: 20, 
        paddingBottom: 30 
    },
    productCard: { 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        padding: 12, 
        marginBottom: 20, 
        alignItems: 'center', 
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
    image: { 
        width: 65, 
        height: 65, 
        borderWidth: 2,
        borderColor: '#000000',
        backgroundColor: '#eee' 
    },
    productInfo: { 
        flex: 1, 
        marginLeft: 15,
        justifyContent: 'center'
    },
    productName: { 
        fontSize: 14, 
        fontWeight: '900', 
        color: '#000000',
        textTransform: 'uppercase',
        marginBottom: 2
    },
    productArtist: { 
        fontSize: 12, 
        color: '#FF784A', // Naranja vibrante
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 6
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    productPrice: { 
        fontSize: 14, 
        color: '#000000', 
        fontWeight: '900' 
    },
    qtyText: {
        fontSize: 14,
        color: '#A3A095', // Gris para diferenciar la cantidad
        fontWeight: 'bold'
    },
    totalBlock: {
        backgroundColor: '#000000',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginLeft: 10,
        borderWidth: 2,
        borderColor: '#000000'
    },
    productTotal: { 
        fontSize: 16, 
        fontWeight: '900', 
        color: '#8CFF66' // Verde neón para el subtotal del ítem
    },
    footer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        backgroundColor: '#000000', 
        borderTopWidth: 4, 
        borderTopColor: '#FF784A' 
    },    
    totalLabel: { 
        fontSize: 16, 
        fontWeight: '900', 
        color: '#FFFFFF',
        letterSpacing: 1
    },
    totalAmount: { 
        fontSize: 28, 
        fontWeight: '900', 
        color: '#8CFF66', // Verde Neón
        letterSpacing: -0.5
    }
});