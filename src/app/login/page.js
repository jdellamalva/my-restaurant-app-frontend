'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Form from '../components/Form';
import { useAppContext } from '../context/AppContext';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const { login } = useAppContext();
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
        setError(null);
        await login(formData.email, formData.password, setError);
    };

    return (
        <div className="pt-4 flex items-center justify-center">
            <Form
                title="Log In"
                buttonText="Log In"
                formData={formData}
                setFormData={setFormData}
                callback={handleSubmit}
                error={error}
                mode="login"
            />
        </div>
    );
}