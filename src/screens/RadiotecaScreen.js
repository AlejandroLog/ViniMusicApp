import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, Keyboard } from 'react-native';
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
        >
            <Image 
                source={{ uri: item.thumb || 'https://via.placeholder.com/150' }} 
                style={styles.image} 
            />
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.year}>Año: {item.year || 'Desconocido'}</Text>
                <Text style={styles.country}>País: {item.country || 'N/A'}</Text>

                <TouchableOpacity 
                    style={styles.addBtn} 
                    onPress={() => handleAddToCart(item)}
                >
                    <Text style={styles.addBtnText}>+ Agregar por $450.00</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Radioteca Global</Text>
                <Text style={styles.headerSub}>Descubre y busca cualquier disco</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Buscar artista, álbum..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={searchDiscogs}
                />
                <TouchableOpacity style={styles.searchBtn} onPress={searchDiscogs}>
                    <Text style={styles.searchBtnText}>Buscar</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#111" style={styles.loader} />
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
    container: { flex: 1, backgroundColor: '#f4f4f4' },
    header: { padding: 20, backgroundColor: '#111', paddingTop: 50 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    headerSub: { fontSize: 14, color: '#aaa', marginTop: 5 },
    searchContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', elevation: 2 },
    searchInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, height: 45, backgroundColor: '#fafafa' },
    searchBtn: { backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
    searchBtnText: { color: '#fff', fontWeight: 'bold' },
    loader: { marginTop: 50 },
    errorText: { textAlign: 'center', color: 'red', marginTop: 30, paddingHorizontal: 20 },
    list: { padding: 15, paddingBottom: 30 },
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 15, elevation: 2 },
    image: { width: 90, height: 90, borderRadius: 5 },
    infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#222' },
    year: { fontSize: 13, color: '#666', marginTop: 4 },
    country: { fontSize: 13, color: '#666' },
    addBtn: { marginTop: 10, backgroundColor: '#e63946', paddingVertical: 8, borderRadius: 5, alignItems: 'center' },
    addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 }
});