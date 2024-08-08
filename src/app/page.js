'use client';

import { useEffect, Suspense } from 'react';
import { useAppContext } from './context/AppContext';
import RestaurantList from './components/RestaurantList';

function HomeComponent() {
    return (
        <main className="flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 lg:p-24">
            <div className="w-full text-center mb-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Giuseppe&apos;s Pizzeria Collective</h1>
                <p className="text-md md:text-lg lg:text-xl text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
                </p>
            </div>
            <RestaurantList />
        </main>
    );
}

function GoogleAuthHandler() {
    const { fetchUserData } = useAppContext();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/v1/auth/check', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    await fetchUserData();
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        };

        checkAuth();
    }, [fetchUserData]);

    return null;
}

export default function Home() {
    const { user } = useAppContext();
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {!user && <GoogleAuthHandler />}
            <HomeComponent />
        </Suspense>
    );
}