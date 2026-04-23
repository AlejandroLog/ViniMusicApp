import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import productosData from '../data/productos.json';

export default function HomeScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [filter, setFilter] = useState('todo'); 

    useEffect(() => {
        const getUserData = async () => {
            const userData = await AsyncStorage.getItem('currentUser');
            if (userData) setUser(JSON.parse(userData));
        };
        getUserData();
    }, []);

    const filteredProducts = productosData.filter(item => {
        if (filter === 'todo') return true;
        return item.type.toLowerCase() === filter.toLowerCase();
    });

    const renderProduct = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('ProductDetail', { producto: item })}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <Text style={styles.albumName} numberOfLines={1}>{item.albumName}</Text>
            <Text style={styles.artistName}>{item.artistName}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Catálogo VINIA</Text>
            </View>
            
            <View style={styles.filterContainer}>
                <Text style={styles.pickerLabel}>Filtrar por:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    <TouchableOpacity 
                        style={[styles.chip, filter === 'todo' && styles.chipActive]} 
                        onPress={() => setFilter('todo')}
                    >
                        <Text style={[styles.chipText, filter === 'todo' && styles.chipTextActive]}>Todos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.chip, filter === 'vinilo' && styles.chipActive]} 
                        onPress={() => setFilter('vinilo')}
                    >
                        <Text style={[styles.chipText, filter === 'vinilo' && styles.chipTextActive]}>Vinilos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.chip, filter === 'cd' && styles.chipActive]} 
                        onPress={() => setFilter('cd')}
                    >
                        <Text style={[styles.chipText, filter === 'cd' && styles.chipTextActive]}>CDs</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            
            <FlatList
                data={filteredProducts} 
                keyExtractor={(item) => item.id}
                renderItem={renderProduct}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.row}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f4' },
    header: { padding: 20, backgroundColor: '#111', paddingTop: 50 },
    welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    /*estilos para los chingados chips*/
    filterContainer: { paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    pickerLabel: { fontSize: 16, fontWeight: 'bold', paddingHorizontal: 15, marginBottom: 10 },
    chipScroll: { paddingHorizontal: 15, flexDirection: 'row' },
    chip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#eee', marginRight: 10 },
    chipActive: { backgroundColor: '#111' },
    chipText: { fontSize: 14, color: '#333', fontWeight: '600' },
    chipTextActive: { color: '#fff' },
    
    listContainer: { padding: 10, paddingBottom: 20 },
    row: { justifyContent: 'space-between' },
    card: { backgroundColor: '#fff', width: '48%', borderRadius: 8, padding: 10, marginBottom: 15, elevation: 3 },
    productImage: { width: '100%', height: 140, borderRadius: 5, marginBottom: 10 },
    albumName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
    artistName: { fontSize: 14, color: '#666', marginBottom: 5 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#e63946' },
    badge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, borderRadius: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});