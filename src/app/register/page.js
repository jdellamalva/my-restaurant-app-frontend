'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Form from '../components/Form';
import { useAppContext } from '../context/AppContext';

export default function Signup() {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState(null);
    const { register } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorMessage = params.get('error');
        if (errorMessage) {
            setError(decodeURIComponent(errorMessage));
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.email, formData.password, setError);
        } catch (err) {
            console.error(err.message);
        }
    };    

    return (
        <div className="pt-4 flex items-center justify-center">
            <Form
                title="Sign Up"
                buttonText="Sign Up"
                formData={formData}
                setFormData={setFormData}
                callback={handleSubmit}
                error={error}
                mode="signup"
                router
            />
        </div>
    );
}