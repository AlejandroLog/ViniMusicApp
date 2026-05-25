import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Configuración directa con la IP de tu computadora para Expo en dispositivo físico
const API_URL = 'http://192.168.1.75:3000/api';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- CARGA INICIAL ---
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('@user_session');
                if (storedUser) setUser(JSON.parse(storedUser));
                await fetchProducts(); 
            } catch (error) {
                console.error('Error cargando datos iniciales:', error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // ==========================================
    // MÓDULO DE USUARIOS (Auth y Perfil)
    // ==========================================
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, { email, password });
            const userData = response.data;
            setUser(userData);
            await AsyncStorage.setItem('@user_session', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw error.response?.data?.message || 'Error de conexión en el login';
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/users/register`, { name, email, password });
            const userData = response.data;
            setUser(userData);
            await AsyncStorage.setItem('@user_session', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw error.response?.data?.message || 'Error de conexión en el registro';
        }
    };

    const logout = async () => {
        setUser(null);
        setOrders([]);
        await AsyncStorage.removeItem('@user_session');
    };

    const updateUser = async (userId, data) => {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}`, data);
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            await AsyncStorage.setItem('@user_session', JSON.stringify(updatedUser));
        } catch (error) {
            throw error.response?.data?.message || 'Error actualizando perfil';
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`${API_URL}/users/${userId}`);
            await logout();
        } catch (error) {
            throw error.response?.data?.message || 'Error eliminando cuenta';
        }
    };

    // ==========================================
    // MÓDULO DE PRODUCTOS
    // ==========================================
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addProduct = async (productData) => {
        try {
            const response = await axios.post(`${API_URL}/products`, productData);
            setProducts([...products, response.data]); 
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error agregando producto';
        }
    };

    // ==========================================
    // MÓDULO DE CARRITO (Estado Local)
    // ==========================================
    const addToCart = (product) => {
        const existing = cart.find(item => item._id === product._id);
        if (existing) {
            setCart(cart.map(item => item._id === product._id ? { ...item, cantidad: item.cantidad + 1 } : item));
        } else {
            setCart([...cart, { ...product, cantidad: 1 }]);
        }
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(cart.map(item => item._id === id ? { ...item, cantidad: newQuantity } : item));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
    };

    const clearCart = () => setCart([]);

    // ==========================================
    // MÓDULO DE PEDIDOS
    // ==========================================
    const createOrder = async () => {
        if (!user) throw new Error('Debes iniciar sesión para comprar');
        try {
            const total = cart.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
            const orderData = {
                userId: user._id,
                items: cart,
                total: total,
                status: 'Pendiente',
                date: new Date().toISOString()
            };
            await axios.post(`${API_URL}/orders`, orderData);
            clearCart();
            await fetchUserOrders(user._id);
        } catch (error) {
            throw error.response?.data?.message || 'Error creando el pedido';
        }
    };

    const fetchUserOrders = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/orders/user/${userId}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'Cancelado' });
            await fetchUserOrders(user._id); 
        } catch (error) {
            throw error.response?.data?.message || 'Error al cancelar';
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            await axios.delete(`${API_URL}/orders/${orderId}`);
            await fetchUserOrders(user._id); 
        } catch (error) {
            throw error.response?.data?.message || 'Error al eliminar pedido';
        }
    };

    return (
        <GlobalContext.Provider value={{
            user, products, cart, orders, loading,
            login, register, logout, updateUser, deleteUser,
            fetchProducts, addProduct,
            addToCart, updateQuantity, removeFromCart, clearCart,
            createOrder, fetchUserOrders, cancelOrder, deleteOrder
        }}>
            {children}
        </GlobalContext.Provider>
    );
};