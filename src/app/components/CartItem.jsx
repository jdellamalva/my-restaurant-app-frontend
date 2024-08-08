import React from "react";
import { useAppContext } from "../context/AppContext";
import formatUSD from "../utils/formatUSD";

function CartItem({ data }) {
    const { addToCart, removeFromCart } = useAppContext();
    const { quantity, dish } = data;

    return (
        <div className="p-6 flex flex-wrap justify-between border-b border-blueGray-800">
            <div className="w-2/4">
                <div className="flex flex-col h-full">
                    <h6 className="font-bold text-white mb-1">{dish.name}</h6>
                    <span className="block pb-4 mb-auto font-medium text-gray-400">
                        {quantity} x {formatUSD(dish.price / 100)}
                    </span>
                </div>
            </div>
            <div className="w-1/4">
                <div className="flex flex-col items-end h-full">
                    <div className="flex justify-between">
                        <button
                            className="mr-2 inline-block mb-auto font-medium text-sm text-gray-400 hover:text-gray-200"
                            onClick={() => removeFromCart(dish)}
                        >
                            Remove
                        </button>
                        <button
                            className="inline-block mb-auto font-medium text-sm text-gray-400 hover:text-gray-200"
                            onClick={() => addToCart(dish)}
                        >
                            Add
                        </button>
                    </div>
                    <span className="block mt-2 text-sm font-bold text-white">
                        {formatUSD((dish.price * quantity) / 100)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
