import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';

export default function AdminAddProductScreen({ navigation }) {
    const { addProduct } = useContext(GlobalContext);
    
    // Estados originales
    const [albumName, setAlbumName] = useState('');
    const [artistName, setArtistName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    
    // Nuevos estados para completar la información
    const [releaseDate, setReleaseDate] = useState('');
    const [seller, setSeller] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = async () => {
        // Ahora validamos que todos los campos estén llenos
        if (!albumName || !artistName || !price || !imageUrl || !releaseDate || !seller || !description) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        const newProduct = {
            id: Date.now().toString(),
            albumName,
            artistName,
            price: parseFloat(price),
            imageUrl,
            releaseDate, // Se agrega fecha
            seller,      // Se agrega vendedor
            description, // Se agrega descripción
            type: 'vinilo', 
            category: 'General'
        };

        if (addProduct) {
            await addProduct(newProduct);
            Alert.alert("¡Éxito!", "El disco se ha agregado al catálogo.");
            
            // Limpiamos el formulario completo
            setAlbumName('');
            setArtistName('');
            setPrice('');
            setImageUrl('');
            setReleaseDate('');
            setSeller('');
            setDescription('');
            
            navigation.navigate('Tienda');
        } else {
            Alert.alert("Aviso", "Falta actualizar el GlobalContext para guardar el disco.");
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Subir Nueva Música</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Álbum</Text>
                <TextInput style={styles.input} value={albumName} onChangeText={setAlbumName} placeholder="Ej. Donda" />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Artista</Text>
                <TextInput style={styles.input} value={artistName} onChangeText={setArtistName} placeholder="Ej. Kanye West" />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Precio ($)</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="Ej. 650.00" />
            </View>

            {/* NUEVOS CAMPOS */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha de Lanzamiento</Text>
                <TextInput style={styles.input} value={releaseDate} onChangeText={setReleaseDate} placeholder="Ej. 2021-11-14" />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Vendido por</Text>
                <TextInput style={styles.input} value={seller} onChangeText={setSeller} placeholder="Ej. VINIA Distribución" />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>URL de la Portada</Text>
                <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." autoCapitalize="none" />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput 
                    style={[styles.input, styles.textArea]} 
                    value={description} 
                    onChangeText={setDescription} 
                    placeholder="Escribe una breve reseña del álbum..." 
                    multiline={true} // Permite saltos de línea
                    numberOfLines={4}
                />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Agregar al Catálogo</Text>
            </TouchableOpacity>
            
            <View style={{ height: 40 }} /> 
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 20, marginTop: 30 },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' }, // Hace que el texto empiece arriba y no centrado
    saveBtn: { backgroundColor: '#e63946', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 20 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});