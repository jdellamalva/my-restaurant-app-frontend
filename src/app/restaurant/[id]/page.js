'use client';

import { useParams } from 'next/navigation';
import { useQuery, useQueries, QueryClient, QueryClientProvider } from 'react-query';
import { useAppContext } from '../../context/AppContext';
import DishCard from '../../components/DishCard';
import Loader from '../../components/Loader';

// Initialize a new query client
const queryClient = new QueryClient();

// Function to fetch restaurant data
const fetchRestaurantData = async (id) => {
    const restaurantResponse = await fetch(`api/v1/restaurants/${id}`);
    if (!restaurantResponse.ok) {
        throw new Error('Failed to fetch restaurant data');
    }
    const restaurantData = await restaurantResponse.json();
    return restaurantData;
};

// Function to fetch individual dish data
const fetchDishData = async (restaurantId, dishId) => {
    const dishResponse = await fetch(`/api/v1/restaurants/${restaurantId}/dishes/${dishId}`);
    if (!dishResponse.ok) {
        throw new Error('Failed to fetch dish data');
    }
    const dishData = await dishResponse.json();
    return dishData;
};

const RestaurantPage = () => {
    const { id } = useParams();
    const { searchTerm } = useAppContext();

    const { data: restaurant, error: restaurantError, isLoading: restaurantLoading } = useQuery(['restaurant', id], () => fetchRestaurantData(id), {
        cacheTime: 1000 * 60 * 5, // Cache for 5 minutes
        staleTime: 1000 * 60, // Data is fresh for 1 minute
    });

    const dishQueries = useQueries(
        restaurant?.dishes?.map(dishId => {
        return {
            queryKey: ['dish', dishId],
            queryFn: () => fetchDishData(id, dishId),
            cacheTime: 1000 * 60 * 5, // Cache for 5 minutes
            staleTime: 1000 * 60, // Data is fresh for 1 minute
            enabled: !!restaurant, // Only run this query if restaurant data is available
        };
        }) || []
    );

    const isLoading = restaurantLoading || dishQueries.some(query => query.isLoading);
    const isError = restaurantError || dishQueries.some(query => query.error);
    const dishData = dishQueries.map(query => query.data);

    // Filter dishes based on the searchTerm
    const filteredDishes = dishData.filter(dish =>
        dish && (
            dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dish.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <div>Failed to load restaurant data.</div>;
    }

    return (
        <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
        <p className="mb-8">{restaurant.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDishes.map((dish) => (
                dish && <DishCard key={dish._id} dish={dish} />
            ))}
        </div>
        </main>
    );
};

// Wrap the component with QueryClientProvider
const RestaurantPageWithProvider = () => (
    <QueryClientProvider client={queryClient}>
        <RestaurantPage />
    </QueryClientProvider>
);

export default RestaurantPageWithProvider;