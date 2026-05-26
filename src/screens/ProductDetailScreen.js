import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, StatusBar } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function ProductDetailScreen({ route, navigation }) {
    const { producto } = route.params;
    const [cantidad, setCantidad] = useState(1);
    const { addToCart } = useContext(GlobalContext);
    
    const handleAddToCart = () => {
        addToCart(producto, cantidad);
        Alert.alert("¡AL CARRITO!", `${cantidad}x ${producto.albumName} te está esperando.`);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            
            <View style={styles.imageContainer}>
                <Image source={{ uri: producto.imageUrl }} style={styles.image} />
            </View>
            
            <View style={styles.detailsContainer}>
                {/* Etiqueta del artista tipo sticker */}
                <View style={styles.artistSticker}>
                    <Text style={styles.artist}>{producto.artistName}</Text>
                </View>

                <View style={styles.rowTitle}>
                    <Text style={styles.title}>{producto.albumName}</Text>
                    <Text style={styles.price}>${producto.price.toFixed(2)}</Text>
                </View>
                
                <View style={styles.metaContainer}>
                    <Text style={styles.infoText}>LANZAMIENTO: <Text style={styles.infoHighlight}>{producto.releaseDate || 'N/A'}</Text></Text>
                    <Text style={styles.infoText}>DISTRIBUYE: <Text style={styles.infoHighlight}>{producto.seller || 'VINIA'}</Text></Text>
                </View>
                
                <Text style={styles.sectionTitle}>SOBRE ESTE DISCO</Text>
                <Text style={styles.description}>{producto.description || 'Sin descripción disponible. Solo dale play.'}</Text>

                <View style={styles.actionSection}>
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>CANTIDAD:</Text>
                        <View style={styles.qtyControls}>
                            <TouchableOpacity onPress={() => setCantidad(Math.max(1, cantidad - 1))} style={styles.btnQty}>
                                <Text style={styles.btnQtyText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{cantidad}</Text>
                            <TouchableOpacity onPress={() => setCantidad(cantidad + 1)} style={styles.btnQty}>
                                <Text style={styles.btnQtyText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart} activeOpacity={0.8}>
                        <Text style={styles.addToCartText}>AGREGAR AL CARRITO</Text>
                    </TouchableOpacity>
                </View>
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
        opacity: 0.95 // Le da un ligero toque analógico
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
        transform: [{ rotate: '-2deg' }] // Rotación sutil para que parezca pegado a mano
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
        marginBottom: 20,
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
        fontSize: 28, 
        fontWeight: '900', 
        color: '#FF784A', // Naranja vibrante
        backgroundColor: '#000000', // Fondo negro para hacer estallar el naranja
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: '#000000'
    },
    metaContainer: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000000',
        paddingVertical: 10,
        marginBottom: 25
    },
    infoText: { 
        fontSize: 12, 
        color: '#000000', 
        marginBottom: 5,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    infoHighlight: {
        color: '#FF784A',
        fontWeight: '900'
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: '900', 
        color: '#000000',
        marginBottom: 10,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        letterSpacing: 1
    },
    description: { 
        fontSize: 16, 
        color: '#000000', 
        lineHeight: 24,
        fontWeight: '500',
        marginBottom: 30
    },
    actionSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderWidth: 2,
        borderColor: '#000000',
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5
    },
    quantityContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 20 
    },
    quantityLabel: { 
        fontSize: 18, 
        fontWeight: '900',
        color: '#000000',
        letterSpacing: 1
    },
    qtyControls: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnQty: { 
        backgroundColor: '#000000', 
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000000'
    },
    btnQtyText: { 
        fontSize: 24, 
        fontWeight: '900',
        color: '#8CFF66',
        lineHeight: 28
    },
    quantity: { 
        fontSize: 22, 
        fontWeight: '900', 
        marginHorizontal: 20,
        color: '#000000'
    },
    addToCartBtn: { 
        backgroundColor: '#8CFF66', // Verde Neón
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