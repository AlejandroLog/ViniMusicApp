import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native';
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
        Alert.alert("¡AÑADIDO!", `Se agregó "${productToCart.albumName}" a tu carrito.`);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: apiItem.cover_image || apiItem.thumb || 'https://via.placeholder.com/150' }} 
                    style={styles.image} 
                />
            </View>
            
            <View style={styles.detailsContainer}>
                {/* Etiqueta del artista tipo sticker */}
                <View style={styles.artistSticker}>
                    <Text style={styles.artist}>{artistName}</Text>
                </View>

                <View style={styles.rowTitle}>
                    <Text style={styles.title} numberOfLines={3}>{albumName}</Text>
                    <Text style={styles.price}>$450.00</Text>
                </View>
                
                <View style={styles.infoBox}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>FICHA DISCOGS</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>AÑO:</Text>
                        <Text style={styles.infoValue}>{apiItem.year || 'N/A'}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>PAÍS:</Text>
                        <Text style={styles.infoValue}>{apiItem.country || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>SELLO:</Text>
                        <Text style={styles.infoValue}>{apiItem.label?.[0] || 'INDEPENDIENTE'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>GÉNERO:</Text>
                        <Text style={styles.infoValue}>{apiItem.genre?.join(', ') || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>ESTILO:</Text>
                        <Text style={styles.infoValue}>{apiItem.style?.join(', ') || 'N/A'}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart} activeOpacity={0.8}>
                    <Text style={styles.addToCartText}>AGREGAR AL CARRITO</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFBE0' // Amarillo pálido base
    },
    imageContainer: {
        borderBottomWidth: 6,
        borderBottomColor: '#000000',
        backgroundColor: '#000000'
    },
    image: { 
        width: '100%', 
        height: 380, 
        resizeMode: 'cover',
        opacity: 0.95
    },
    detailsContainer: { 
        padding: 20,
        paddingBottom: 40
    },
    artistSticker: {
        backgroundColor: '#8CFF66', // Verde Neón
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 2,
        borderColor: '#000000',
        marginBottom: 15,
        transform: [{ rotate: '-2deg' }]
    },
    artist: { 
        fontSize: 16, 
        fontWeight: '900',
        color: '#000000',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    rowTitle: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: 25,
        gap: 15
    },
    title: { 
        fontSize: 32, 
        fontWeight: '900', 
        color: '#000000', 
        flex: 1, 
        textTransform: 'uppercase',
        lineHeight: 34,
        letterSpacing: -1
    },
    price: { 
        fontSize: 24, 
        fontWeight: '900', 
        color: '#FF784A', 
        backgroundColor: '#000000',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: '#000000'
    },
    infoBox: { 
        backgroundColor: '#FFFFFF', 
        padding: 15, 
        marginBottom: 30, 
        // Estilo Brutalista para la Ficha
        borderWidth: 2, 
        borderColor: '#000000',
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5
    },
    sectionTitleContainer: {
        backgroundColor: '#000000',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginBottom: 15,
        transform: [{ rotate: '1deg' }] // Rotación muy sutil para la etiqueta
    },
    sectionTitle: { 
        fontSize: 16, 
        fontWeight: '900', 
        color: '#FFFFFF',
        letterSpacing: 1
    },
    infoRow: {
        flexDirection: 'column', // Apilado para lectura rápida tipo reporte
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0DDD0',
        paddingBottom: 5
    },
    infoLabel: { 
        fontSize: 12, 
        color: '#A3A095', // Gris cálido
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 2
    },
    infoValue: { 
        fontSize: 15,
        fontWeight: '900', 
        color: '#000000',
        textTransform: 'uppercase'
    },
    addToCartBtn: { 
        backgroundColor: '#8CFF66', // Verde Neón masivo
        padding: 16, 
        borderWidth: 2,
        borderColor: '#000000',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0
    },
    addToCartText: { 
        color: '#000000', 
        fontSize: 18, 
        fontWeight: '900',
        letterSpacing: 1
    }
});