'use client';

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

const AppProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const [showCart, setShowCart] = useState(true);
    const [cart, setCart] = useState(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });
    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, user]);

    const saveCart = useCallback(async (updatedCart) => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/user/cart`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ cart: updatedCart }),
            });
            const responseData = await response.json();
            if (!response.ok) { throw new Error(responseData.message || 'Failed to save cart') };
            if (user) {
                setUser({ ...user, cart: updatedCart });
            }
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }, [user]);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                if (data.user.cart.length === 0 && cart.length > 0) {
                    data.user.cart = cart;
                    await saveCart(cart);
                } else {
                    localStorage.removeItem('cart');
                }
                setUser(data.user);
                setCart(data.user.cart);
                return data;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            setUser(null);
            console.error('Error fetching user data:', error);
            return null;
        }
    }, [cart, saveCart]);

    const addToCart = useCallback((dish) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const existingItem = updatedCart.find((item) => item.dish._id === dish._id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                updatedCart.push({ dish, quantity: 1 });
            }
            saveCart(updatedCart);
            return updatedCart;
        });
    }, [saveCart]);

    const removeFromCart = useCallback((dish) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.dish._id === dish._id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter((item) => item.quantity > 0);
            saveCart(updatedCart);
            return updatedCart;
        });
    }, [saveCart]);

    const clearCart = useCallback(async () => {
        localStorage.removeItem('cart');
        setCart([]);
        if (user) {
            const updatedUser = { ...user, cart: [] };
            setUser(updatedUser);
            try {
                const response = await fetch(`${apiUrl}/api/v1/user/cart`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ cart: [] }),
                });
                const responseData = await response.json();
                if (!response.ok) { throw new Error(responseData.message || 'Failed to clear cart') };
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    }, [user]);

    const login = useCallback(async (email, password, setError) => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError('Invalid email/password combination.');
                throw new Error(data.message || 'Login failed');
            }
            await fetchUserData();
            router.push('/');
        } catch (err) {
            console.error('Error during login:', err.message);
            setError('Invalid email/password combination.');
        }
    }, [fetchUserData, router]);
    
    const register = useCallback(async (email, password, setError) => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError('A user with that email already exists.');
                throw new Error(data.message || 'Signup failed');
            }
            await fetchUserData();
            router.push('/');
        } catch (err) {
            console.error(err.message);
            setError('A user with that email already exists.');
        }
    }, [fetchUserData, router]);  

    const logout = useCallback(async () => {
        try {
            await fetch(`${apiUrl}/api/v1/auth/logout`, {
                method: 'GET',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            localStorage.removeItem('cart');
            setSearchTerm('');
            setUser(null);
            setCart([]);
            router.push('/');
        }
    }, [router]);
    
    const contextValue = {
        searchTerm,
        setSearchTerm,
        user,
        setUser,
        cart,
        setCart,
        showCart,
        saveCart,
        setShowCart,
        addToCart,
        removeFromCart,
        clearCart,
        logout,
        login,
        register,
        fetchUserData,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export { useAppContext, AppProvider };