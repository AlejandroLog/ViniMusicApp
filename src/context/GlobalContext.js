import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const savedCart = await AsyncStorage.getItem('cart');
            const savedOrders = await AsyncStorage.getItem('orders');
            const savedUser = await AsyncStorage.getItem('currentUser');
            if (savedCart) setCart(JSON.parse(savedCart));
            if (savedOrders) setOrders(JSON.parse(savedOrders));
            if (savedUser) setUser(JSON.parse(savedUser));
        };
        loadData();
    }, []);

    const addToCart = async (producto, cantidad) => {
        let newCart = [...cart];
        const exist = newCart.find(item => item.id === producto.id);
        
        if (exist) {
            exist.cantidad += cantidad;
        } else {
            newCart.push({ ...producto, cantidad });
        }
        
        setCart(newCart);
        await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    };

    const updateQuantity = async (id, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;
        const newCart = cart.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item);
        setCart(newCart);
        await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeFromCart = async (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    };

    const clearCart = async () => {
        setCart([]);
        await AsyncStorage.removeItem('cart');
    };


    const updateUser = async (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
        
        const allUsers = JSON.parse(await AsyncStorage.getItem('users') || '[]');
        const updatedUsers = allUsers.map(u => u.email === user.email ? newUser : u);
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const deleteUser = async () => {
        const allUsers = JSON.parse(await AsyncStorage.getItem('users') || '[]');
        const updatedUsers = allUsers.filter(u => u.email !== user.email);
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
        await AsyncStorage.removeItem('currentUser');
        setUser(null);
    };

    const createOrder = async (total) => {
        const newOrder = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            items: [...cart],
            total: total,
            status: 'Pendiente'
        };
        const newOrders = [newOrder, ...orders];
        setOrders(newOrders);
        await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
        await clearCart();
    };

    const deleteOrder = async (id) => {
        const newOrders = orders.filter(o => o.id !== id);
        setOrders(newOrders);
        await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
    };

    const updateOrder = async (id, newStatus) => {
        const newOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
        setOrders(newOrders);
        await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
    };

    return (
        <GlobalContext.Provider value={{
            cart, orders, user, setUser,
            addToCart, updateQuantity, removeFromCart, clearCart,
            updateUser, deleteUser,
            createOrder, deleteOrder, updateOrder
        }}>
            {children}
        </GlobalContext.Provider>
    );
};