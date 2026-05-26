import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function HomeScreen({ navigation }) {
    const [filter, setFilter] = useState('todo'); 
    
    const { products, loading } = useContext(GlobalContext);

    const filteredProducts = products.filter(item => {
        if (filter === 'todo') return true;
        return item.type && item.type.toLowerCase() === filter.toLowerCase();
    });

    const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { producto: item })}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.type ? item.type.toUpperCase() : 'N/A'}</Text>
            </View>
            <Text style={styles.albumName} numberOfLines={1}>{item.albumName}</Text>
            <Text style={styles.artistName} numberOfLines={1}>{item.artistName}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFBE0" />
                <ActivityIndicator size="large" color="#FF784A" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Catálogo VINIA</Text>
            </View>
            
            <View style={styles.filterContainer}>
                <Text style={styles.pickerLabel}>Explorar formato:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    <TouchableOpacity style={[styles.chip, filter === 'todo' && styles.chipActive]} onPress={() => setFilter('todo')}>
                        <Text style={[styles.chipText, filter === 'todo' && styles.chipTextActive]}>TODO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chip, filter === 'vinilo' && styles.chipActive]} onPress={() => setFilter('vinilo')}>
                        <Text style={[styles.chipText, filter === 'vinilo' && styles.chipTextActive]}>VINILOS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chip, filter === 'cd' && styles.chipActive]} onPress={() => setFilter('cd')}>
                        <Text style={[styles.chipText, filter === 'cd' && styles.chipTextActive]}>CDs</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            
            <FlatList 
                data={filteredProducts} 
                keyExtractor={(item) => item._id} 
                renderItem={renderProduct} 
                numColumns={2} 
                contentContainerStyle={styles.listContainer} 
                columnWrapperStyle={styles.row} 
                showsVerticalScrollIndicator={false}
            />
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
    welcomeText: { 
        fontSize: 24, 
        fontWeight: '900', 
        color: '#8CFF66',
        letterSpacing: 2,
        textTransform: 'uppercase'
    },
    filterContainer: { 
        paddingVertical: 15, 
        backgroundColor: '#FFFBE0', 
        borderBottomWidth: 2, 
        borderBottomColor: '#000000' 
    },
    pickerLabel: { 
        fontSize: 14, 
        fontWeight: '900', 
        paddingHorizontal: 15, 
        marginBottom: 10,
        color: '#000000',
        textTransform: 'uppercase'
    },
    chipScroll: { 
        paddingHorizontal: 15, 
        flexDirection: 'row' 
    },
    chip: { 
        paddingHorizontal: 18, 
        paddingVertical: 8, 
        backgroundColor: '#FFFFFF', 
        borderWidth: 2,
        borderColor: '#FF784A', 
        marginRight: 10,
        borderRadius: 0 
    },
    chipActive: { 
        backgroundColor: '#000000', 
        borderColor: '#000000' 
    },
    chipText: { 
        fontSize: 13, 
        color: '#000000', 
        fontWeight: '900',
        letterSpacing: 1
    },
    chipTextActive: { 
        color: '#8CFF66' 
    },
    listContainer: { 
        padding: 15, 
        paddingBottom: 30 
    },
    row: { 
        justifyContent: 'space-between' 
    },
    card: { 
        backgroundColor: '#FFFFFF', 
        width: '48%', 
        padding: 10, 
        marginBottom: 20, 
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 0,
        shadowColor: '#000000', 
        shadowOffset: { width: 4, height: 4 }, 
        shadowOpacity: 1, 
        shadowRadius: 0, 
        elevation: 5 
    },
    productImage: { 
        width: '100%', 
        height: 150, 
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#eee' 
    },
    albumName: { 
        fontSize: 16, 
        fontWeight: '900', 
        color: '#000000',
        textTransform: 'uppercase',
        marginBottom: 2
    },
    artistName: { 
        fontSize: 14, 
        color: '#FF784A',
        fontWeight: 'bold', 
        marginBottom: 8
    },
    price: { 
        fontSize: 18, 
        fontWeight: '900', 
        color: '#000000' 
    },
    badge: { 
        position: 'absolute', 
        top: -5, 
        right: -5, 
        backgroundColor: '#8CFF66',
        paddingHorizontal: 8, 
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: '#000000',
        zIndex: 1 
    },
    badgeText: { 
        color: '#000000', 
        fontSize: 11, 
        fontWeight: '900',
        letterSpacing: 1
    }
});