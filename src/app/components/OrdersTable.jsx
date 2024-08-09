import React, { useEffect, useState } from 'react';
import formatUSD from '../utils/formatUSD';

const OrdersTable = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/user/orders?page=${currentPage}&userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data.orders);
                    setTotalPages(data.totalPages);
                } else {
                    console.error('Failed to fetch orders:', data.message);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId, currentPage]);

    const onPageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const calculateTotalItems = (items) => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="w-full">
            <table className="min-w-full bg-gray-800 text-white">
                <thead>
                    <tr className="text-left">
                        <th className="py-2 px-4 border-b-2 border-gray-700">Timestamp</th>
                        <th className="py-2 px-4 border-b-2 border-gray-700">Status</th>
                        <th className="py-2 px-4 border-b-2 border-gray-700">Items</th>
                        <th className="py-2 px-4 border-b-2 border-gray-700">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-700 text-left">
                            <td className="py-2 px-4 border-b border-gray-700">{new Date(order.createdAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b border-gray-700">{order.status}</td>
                            <td className="py-2 px-4 border-b border-gray-700">{calculateTotalItems(order.items)}</td>
                            <td className="py-2 px-4 border-b border-gray-700">{formatUSD(order.amount / 100)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="flex justify-between mt-4">
                    {currentPage > 1 && (
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            Previous
                        </button>
                    )}
                    <span className="text-white">Page {currentPage} of {totalPages}</span>
                    {currentPage < totalPages && (
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            Next
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrdersTable;