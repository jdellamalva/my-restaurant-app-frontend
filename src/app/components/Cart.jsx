'use client';

import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter, usePathname } from "next/navigation";
import CartItem from "./CartItem";
import formatUSD from "../utils/formatUSD";

export default function Cart() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, cart, showCart, setShowCart, setCart, clearCart } = useAppContext();
    const total = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const displayTotal = formatUSD(total / 100);

    function loginRedirect() {
        router.push("/login");
    }

    function cartRedirect() {
        setShowCart(false);
        router.push("/checkout");
    }

    useEffect(() => {
        if (pathname === '/checkout') {
            setShowCart(false);
        }
    }, [pathname, setShowCart]);

    useEffect(() => {
        const handleStorageChange = () => {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        };

        if (user) {
            setCart(user.cart);
            localStorage.removeItem('cart');
        } else {
            handleStorageChange();
            window.addEventListener('storage', handleStorageChange);
        }

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [user, setCart]);

    return (
        <section className="fixed right-20 top-[242px] z-50">
            <div className="relative">
                {pathname !== '/checkout' && (
                    <button
                        onClick={() => setShowCart((prevState) => !prevState)}
                        className="absolute right-0 z-10 bg-green-500 text-white p-3 rounded-full hover:bg-yellow-500 items-center"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 16 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11.3334 8.16667V4.83333C11.3334 2.99238 9.84099 1.5 8.00004 1.5C6.15909 1.5 4.66671 2.99238 4.66671 4.83333V8.16667M2.16671 6.5H13.8334L14.6667 16.5H1.33337L2.16671 6.5Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    </button>
                )}
                {showCart && (
                    <div className="rounded-3xl co bg-gray-800">
                        <div className="max-w-lg pt-6 pb-8 px-8 mx-auto">
                            <div className="flex mb-10 items-center justify-between">
                                <h6 className="font-bold text-2xl text-white mb-0">
                                    Your Cart
                                </h6>
                            </div>
                            <div>
                                {cart.length > 0 ? (
                                    cart.map((item, index) => (
                                        <CartItem key={index} data={item} />
                                    ))
                                ) : (
                                    <p className="text-white">Your cart is empty</p>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex mb-6 content-center justify-between">
                                    <span className="font-bold text-white">Order total</span>
                                    <span className="text-sm font-bold text-white">
                                        {displayTotal}
                                    </span>
                                </div>
                                <button
                                    onClick={() => (user ? cartRedirect() : loginRedirect())}
                                    className="inline-block w-full px-6 py-3 text-center font-bold text-white bg-green-500 hover:bg-green-600 transition duration-200 rounded-full"
                                >
                                    {user ? "Continue To Pay" : "Login to Order"}
                                </button>
                                <button
                                    onClick={() => {
                                        clearCart();
                                    }}
                                    className="mt-4 inline-block w-full text-center font-bold text-gray-400 hover:text-gray-200 transition duration-200"
                                >
                                    Reset Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}