import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function ProductDetailScreen({ route, navigation }) {
    const { producto } = route.params;
    const [cantidad, setCantidad] = useState(1);
    
    // Traemos la función de nuestro Contexto Global
    const { addToCart } = useContext(GlobalContext);

    const handleAddToCart = () => {
        addToCart(producto, cantidad);
        Alert.alert("Éxito", `${cantidad}x ${producto.albumName} añadido al carrito.`);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: producto.imageUrl }} style={styles.image} />
            
            <View style={styles.detailsContainer}>
                <View style={styles.rowTitle}>
                    <Text style={styles.title}>{producto.albumName}</Text>
                    <Text style={styles.price}>${producto.price.toFixed(2)}</Text>
                </View>
                
                <Text style={styles.artist}>{producto.artistName}</Text>
                <Text style={styles.infoText}>Lanzamiento: {producto.releaseDate}</Text>
                <Text style={styles.infoText}>Vendido por: {producto.seller}</Text>
                
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>{producto.description}</Text>

                <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Cantidad:</Text>
                    <TouchableOpacity onPress={() => setCantidad(Math.max(1, cantidad - 1))} style={styles.btnQty}>
                        <Text style={styles.btnQtyText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{cantidad}</Text>
                    <TouchableOpacity onPress={() => setCantidad(cantidad + 1)} style={styles.btnQty}>
                        <Text style={styles.btnQtyText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
                    <Text style={styles.addToCartText}>Agregar al Carrito</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    image: { width: '100%', height: 350, resizeMode: 'cover' },
    detailsContainer: { padding: 20 },
    rowTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111', flex: 1 },
    price: { fontSize: 24, fontWeight: 'bold', color: '#e63946' },
    artist: { fontSize: 18, color: '#555', marginBottom: 10 },
    infoText: { fontSize: 14, color: '#888', marginBottom: 5 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    description: { fontSize: 16, color: '#444', lineHeight: 24 },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20 },
    quantityLabel: { fontSize: 16, marginRight: 15 },
    btnQty: { backgroundColor: '#eee', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 },
    btnQtyText: { fontSize: 20, fontWeight: 'bold' },
    quantity: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15 },
    addToCartBtn: { backgroundColor: '#111', padding: 15, borderRadius: 8, alignItems: 'center' },
    addToCartText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});