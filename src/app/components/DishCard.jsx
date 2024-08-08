import React from 'react';
import { useAppContext } from '../context/AppContext';
import { usePathname } from "next/navigation";
import Image from 'next/image';

const DishCard = ({ dish }) => {
    const { addToCart, showCart, setShowCart } = useAppContext();
    const pathname = usePathname();

    const handleAddItem = () => {
        addToCart(dish);
        if (pathname !== '/checkout' && !showCart) {
            setShowCart(true);
        }
    };

    return (
        <div className="w-full p-4">
            <div className="h-full bg-gray-100 rounded-2xl shadow-lg overflow-hidden flex flex-col">
                <div className="relative w-full h-48">
                    <Image
                        className="object-cover"
                        src={dish.imageUrl}
                        alt={dish.name}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                        <h3 className="font-heading text-xl text-gray-900 hover:text-gray-700 font-bold">
                            {dish.name}
                        </h3>
                        <p className="text-gray-900">${(dish.price / 100).toFixed(2)}</p>
                        <p className="text-sm text-gray-500 mb-4">
                            {dish.description}
                        </p>
                    </div>
                    <div className="flex justify-center mt-auto">
                        <button
                            className="block w-full px-8 py-2 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
                            onClick={handleAddItem}
                        >
                            + Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DishCard;