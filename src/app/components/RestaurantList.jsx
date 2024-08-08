'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { useAppContext } from '../context/AppContext';
import Loader from '../components/Loader';
import RestaurantCard from '../components/RestaurantCard';

// Initialize a new query client
const queryClient = new QueryClient();

// Function to fetch restaurants
const fetchRestaurants = async () => {
    const response = await fetch('/api/v1/restaurants');
    const data = await response.json();
    return data;
};

// RestaurantList component
const RestaurantList = () => {
    const { searchTerm } = useAppContext();
    const { data: restaurants, error, isLoading } = useQuery('restaurants', fetchRestaurants, {
        cacheTime: 1000 * 60 * 5,
        staleTime: 1000 * 60,
    });

    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    useEffect(() => {
        if (restaurants) {
            const filteredAndSorted = restaurants
                .filter(restaurant =>
                    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => a.name.localeCompare(b.name));

            setFilteredRestaurants(filteredAndSorted);
        }
    }, [searchTerm, restaurants]);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error fetching restaurants.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Restaurant List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))}
            </div>
        </div>
    );
};

// Wrap the component with QueryClientProvider
const RestaurantListWithProvider = () => (
    <QueryClientProvider client={queryClient}>
        <RestaurantList />
    </QueryClientProvider>
);

export default RestaurantListWithProvider;