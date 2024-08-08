'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import CheckoutCart from "../components/CheckoutCart";
import { useAppContext } from "../context/AppContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
    const { user } = useAppContext();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.cart.length > 0) {
            setIsLoading(false);
        } else {
            router.push('/');
        }
    }, [user, router]);

    if (isLoading) return null;

    return (
        <section className="container mx-auto py-24">
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                    <CheckoutCart />
                </div>
                <div className="col-span-3">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
            </div>
        </section>
    );
}