import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function RadiotecaDetailScreen({ route, navigation }) {
    const { apiItem } = route.params;
    const { addToCart } = useContext(GlobalContext);

    const titleParts = apiItem.title.split(' - ');
    const artistName = titleParts.length > 1 ? titleParts[0] : 'Artista Desconocido';
    const albumName = titleParts.length > 1 ? titleParts[1] : apiItem.title;

    const handleAddToCart = () => {
        const productToCart = {
            id: apiItem.id.toString(),
            albumName: albumName.trim(),
            artistName: artistName.trim(),
            price: 450.00,
            imageUrl: apiItem.cover_image || apiItem.thumb || 'https://via.placeholder.com/150',
            type: 'vinilo'
        };

        addToCart(productToCart, 1);
        Alert.alert("¡Añadido a la colección!", `Se agregó "${productToCart.albumName}" a tu carrito.`);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: apiItem.cover_image || apiItem.thumb || 'https://via.placeholder.com/150' }} style={styles.image} />
            
            <View style={styles.detailsContainer}>
                <View style={styles.rowTitle}>
                    <Text style={styles.title} numberOfLines={2}>{albumName}</Text>
                    <Text style={styles.price}>$450.00</Text>
                </View>
                
                <Text style={styles.artist}>{artistName}</Text>
                
                <View style={styles.infoBox}>
                    <Text style={styles.sectionTitle}>Ficha Técnica de Discogs</Text>
                    <Text style={styles.infoText}>Año de lanzamiento: <Text style={styles.bold}>{apiItem.year || 'Desconocido'}</Text></Text>
                    <Text style={styles.infoText}>País de edición: <Text style={styles.bold}>{apiItem.country || 'No especificado'}</Text></Text>
                    <Text style={styles.infoText}>Sello discográfico: <Text style={styles.bold}>{apiItem.label?.[0] || 'Independiente'}</Text></Text>
                    <Text style={styles.infoText}>Géneros: <Text style={styles.bold}>{apiItem.genre?.join(', ') || 'N/A'}</Text></Text>
                    <Text style={styles.infoText}>Estilos: <Text style={styles.bold}>{apiItem.style?.join(', ') || 'N/A'}</Text></Text>
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
    rowTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111', flex: 1, marginRight: 10 },
    price: { fontSize: 24, fontWeight: 'bold', color: '#e63946' },
    artist: { fontSize: 18, color: '#555', marginBottom: 20 },
    infoBox: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 30, borderWidth: 1, borderColor: '#eee' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#111' },
    infoText: { fontSize: 14, color: '#444', marginBottom: 8 },
    bold: { fontWeight: 'bold', color: '#222' },
    addToCartBtn: { backgroundColor: '#111', padding: 15, borderRadius: 8, alignItems: 'center' },
    addToCartText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});