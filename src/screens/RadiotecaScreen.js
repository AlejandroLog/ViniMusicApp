import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, Keyboard, Platform, StatusBar } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function RadiotecaScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(GlobalContext);
    const DISCOGS_TOKEN = 'NBcYWdXFSqQHxXgKLPCDVGitzYuPfWgioScWTpDE';

    useEffect(() => {
        const loadInitialAlbums = async () => {
            const genres = ['shoegaze', 'stoner rock', 'post-punk', 'grunge', 'psychedelic rock'];
            const randomGenre = genres[Math.floor(Math.random() * genres.length)];
            setIsLoading(true);
            try {
                const url = `https://api.discogs.com/database/search?q=${encodeURIComponent(randomGenre)}&type=release&format=vinyl&token=${DISCOGS_TOKEN}&per_page=15`;
                const response = await fetch(url);
                if (!response.ok) throw new Error("Error de conexión");
                const data = await response.json();
                if (data.results) {
                    setResults(data.results);
                }
            } catch (err) {
                setError("Hubo un problema cargando las recomendaciones.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialAlbums();
    }, []);

    const searchDiscogs = async () => {
        if (!query.trim()) return;
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        try {
            const url = `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&format=vinyl&token=${DISCOGS_TOKEN}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error al conectar con Discogs");
            const data = await response.json();
            if (data.results.length === 0) {
                setError("No se encontraron vinilos para esta búsqueda.");
            } else {
                setResults(data.results);
            }
        } catch (err) {
            setError("Hubo un problema buscando la música. Revisa tu conexión.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = (apiItem) => {
        const titleParts = apiItem.title.split(' - ');
        const artistName = titleParts.length > 1 ? titleParts[0] : 'Artista Desconocido';
        const albumName = titleParts.length > 1 ? titleParts[1] : apiItem.title;
        const productToCart = {
            id: apiItem.id.toString(),
            albumName: albumName.trim(),
            artistName: artistName.trim(),
            price: 450.00, 
            imageUrl: apiItem.thumb || 'https://via.placeholder.com/150',
            type: 'vinilo'
        };
        addToCart(productToCart, 1);
        Alert.alert("¡Añadido a la colección!", `Se agregó "${productToCart.albumName}" a tu carrito.`);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('RadiotecaDetail', { apiItem: item })}
            activeOpacity={0.9}
        >
            <Image 
                source={{ uri: item.thumb || 'https://via.placeholder.com/150' }} 
                style={styles.image} 
            />
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.year}>AÑO: {item.year || 'N/A'}</Text>
                <Text style={styles.country}>PAÍS: {item.country || 'N/A'}</Text>

                <TouchableOpacity 
                    style={styles.addBtn} 
                    onPress={() => handleAddToCart(item)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.addBtnText}>+ AGREGAR $450</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>RADIOTECA</Text>
                <Text style={styles.headerSub}>BUSCADOR GLOBAL DISCOGS</Text>
            </View>
            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Buscar artista, álbum..."
                    placeholderTextColor="#A3A095"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={searchDiscogs}
                />
                <TouchableOpacity style={styles.searchBtn} onPress={searchDiscogs}>
                    <Text style={styles.searchBtnText}>BUSCAR</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#FF784A" style={styles.loader} />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList 
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    headerTitle: { 
        fontSize: 26, 
        fontWeight: '900', 
        color: '#8CFF66',
        letterSpacing: 2,
        textTransform: 'uppercase'
    },
    headerSub: { 
        fontSize: 12, 
        color: '#FFFFFF', 
        marginTop: 5,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    searchContainer: { 
        flexDirection: 'row', 
        padding: 15, 
        backgroundColor: '#FFFBE0', 
        borderBottomWidth: 2,
        borderBottomColor: '#000000'
    },
    searchInput: { 
        flex: 1, 
        borderWidth: 2, 
        borderColor: '#FF784A', 
        borderRadius: 0, 
        paddingHorizontal: 15, 
        height: 50, 
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16
    },
    searchBtn: { 
        backgroundColor: '#000000', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        borderRadius: 0, 
        marginLeft: 10,
        borderWidth: 2,
        borderColor: '#000000'
    },
    searchBtnText: { 
        color: '#8CFF66', 
        fontWeight: '900',
        letterSpacing: 1 
    },
    loader: { 
        marginTop: 50 
    },
    errorText: { 
        textAlign: 'center', 
        color: '#000000', 
        marginTop: 30, 
        paddingHorizontal: 20,
        fontWeight: '900',
        fontSize: 16,
        textTransform: 'uppercase'
    },
    list: { 
        padding: 15, 
        paddingBottom: 40 
    },
    card: { 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 0, 
        padding: 12, 
        marginBottom: 20, 
        borderWidth: 2,
        borderColor: '#000000',
        shadowColor: '#000000', 
        shadowOffset: { width: 4, height: 4 }, 
        shadowOpacity: 1, 
        shadowRadius: 0, 
        elevation: 5
    },
    image: { 
        width: 100, 
        height: 100, 
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#000000',
        backgroundColor: '#eee'
    },
    infoContainer: { 
        flex: 1, 
        marginLeft: 15, 
        justifyContent: 'space-between' 
    },
    title: { 
        fontSize: 15, 
        fontWeight: '900', 
        color: '#000000',
        textTransform: 'uppercase',
        marginBottom: 4
    },
    year: { 
        fontSize: 12, 
        color: '#000000', 
        fontWeight: 'bold'
    },
    country: { 
        fontSize: 12, 
        color: '#000000',
        fontWeight: 'bold'
    },
    addBtn: { 
        marginTop: 10, 
        backgroundColor: '#FF784A', // Naranja vibrante
        paddingVertical: 10, 
        borderRadius: 0, 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000000',
        shadowColor: '#000000', 
        shadowOffset: { width: 2, height: 2 }, 
        shadowOpacity: 1, 
        shadowRadius: 0
    },
    addBtnText: { 
        color: '#000000', 
        fontWeight: '900', 
        fontSize: 13,
        letterSpacing: 0.5 
    }
});