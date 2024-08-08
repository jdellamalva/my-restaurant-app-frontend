'use client';

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import formatUSD from "../utils/formatUSD";

const options = {
    style: {
        base: {
            fontSize: "32px",
            color: "#52a635",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#9e2521",
        },
    },
};

const INITIAL_STATE = {
    address: "",
    city: "",
    state: "",
    error: null,
};

export default function CheckoutForm() {
    const [data, setData] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    const { user, cart, clearCart } = useAppContext();

    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const amountInCents = cart.reduce((total, item) => total + item.quantity * item.dish.price, 0);
    const displayTotal = formatUSD(amountInCents / 100);

    function onChange(e) {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    async function submitOrder(e) {
        e.preventDefault();
    
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
    
        const cardElement = elements.getElement(CardElement);
    
        try {
            setLoading(true);
    
            // Create a short metadata object
            const shortMetadata = cart.map(item => ({
                name: item.dish.name,
                quantity: item.quantity,
                price: item.dish.price
            }));
    
            // Step 1: Create a PaymentIntent
            const paymentIntentResponse = await fetch('/api/v1/payment_intents', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    amount: amountInCents,
                    currency: 'usd',
                    metadata: {
                        address: data.address,
                        city: data.city,
                        state: data.state,
                        items: JSON.stringify(shortMetadata),
                    },
                }),
            });
    
            if (!paymentIntentResponse.ok) {
                const errorData = await paymentIntentResponse.json();
                throw new Error(errorData.error || "Failed to create PaymentIntent");
            }
    
            const paymentIntentData = await paymentIntentResponse.json();
        
            // Ensure client_secret is a valid string
            if (!paymentIntentData.client_secret) {
                throw new Error('Invalid client_secret received from Stripe');
            }
    
            // Step 2: Confirm the PaymentIntent
            const confirmResponse = await stripe.confirmCardPayment(paymentIntentData.client_secret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        address: {
                            city: data.city,
                            line1: data.address,
                            state: data.state,
                        },
                    },
                },
            });
    
            if (confirmResponse.error) {
                throw new Error(confirmResponse.error.message);
            }
    
            // Handle success
            if (confirmResponse.paymentIntent.status === 'succeeded') {
                // Step 3: Create an order in the backend
                const orderResponse = await fetch('/api/v1/orders', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        paymentIntentId: confirmResponse.paymentIntent.id,
                        items: cart,
                        userId: user._id,
                    }),
                });
    
                if (!orderResponse.ok) {
                    const errorData = await orderResponse.json();
                    throw new Error(errorData.error || "Failed to create order");
                }
    
                alert("Transaction Successful, continue your shopping");
                setData(INITIAL_STATE);
                clearCart();
                router.push("/");
            } else {
                throw new Error("Payment not successful");
            }
        } catch (error) {
            setData({ ...data, error: { message: error.message } });
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <form>
            <div className="bg-white shadow-md rounded-lg p-8">
                <h5 className="text-lg font-semibold text-black">Your information:</h5>
                <hr className="my-4" />
                <div className="flex mb-6">
                    <div className="flex-1">
                        <label className="block mb-2 text-gray-800 font-medium text-black" htmlFor="address">Address</label>
                        <input id="address" className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" type="text" name="address" onChange={onChange} placeholder="Enter your address" />
                    </div>
                </div>
                <div className="flex mb-6">
                    <div className="flex-1 mr-6">
                        <label htmlFor="city" className="block mb-2 text-gray-800 font-medium text-black">City</label>
                        <input type="text" name="city" id="city" onChange={onChange} className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" />
                    </div>
                    <div className="w-1/4">
                        <label htmlFor="state" className="block mb-2 text-gray-800 font-medium text-black">State</label>
                        <input type="text" name="state" id="state" onChange={onChange} className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" />
                    </div>
                </div>
                {cart && cart.length > 0 ? (
                    <div className="p-6 text-black">
                        <div>Credit or debit card</div>
                        <div className="my-4">
                            <CardElement options={options} />
                        </div>
                        <div className="flex mb-6 content-center justify-between">
                            <span className="font-bold text-black">Order total</span>
                            <span className="text-sm font-bold text-black">{displayTotal}</span>
                        </div>
                        <button className="inline-block w-full px-6 py-3 text-center font-bold text-white bg-green-500 hover:bg-green-600 transition duration-200 rounded-full" onClick={(e) => (user ? submitOrder(e) : router.push("/login"))} disabled={loading}>{loading ? "Submitting" : "Submit Order"}</button>
                    </div>
                ) : (
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
                        <p className="text-gray-500">Add some items to your cart to continue</p>
                    </div>
                )}
                {data.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Error!</strong> <span className="block sm:inline">{data.error.message}</span>
                    </div>
                )}
            </div>
        </form>
    );
}