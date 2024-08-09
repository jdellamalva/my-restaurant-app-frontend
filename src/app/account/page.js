"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import OrdersTable from '../components/OrdersTable';

export default function Account() {
    const { user, setUser, fetchUserData } = useAppContext();
    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUserData();
            if (data && data.user) {
                setUser(data.user);
            } else {
                router.push('/login');
            }
        };

        if (!user) {
            fetchData();
        }
    }, [user, setUser, fetchUserData, router]);

    const handleLogout = async () => {
        try {
            await fetch(`${apiUrl}/api/v1/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <main className="flex flex-col items-center justify-start p-8 bg-black text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Account Page</h1>
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
                <p className="mb-4"><strong>Email:</strong> {user.email}</p>
                <p className="mb-4"><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                <button
                    className="inline-block py-2 px-4 text-sm leading-5 text-red-50 bg-red-500 hover:bg-red-600 font-medium focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-md"
                    onClick={handleLogout}
                >
                    Log Out
                </button>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-4xl mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
                <OrdersTable userId={user._id} />
            </div>
        </main>
    );
}