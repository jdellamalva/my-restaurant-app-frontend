'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/image';

export default function Form({
    title,
    buttonText,
    formData,
    setFormData,
    callback,
    mode,
    error,
}) {
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        if (error) {
            setValidationError(error);
        }
    }, [error]);

    const validateForm = (updatedFormData) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(updatedFormData.email)) {
            return 'Invalid email format';
        }
        if (updatedFormData.password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        if (mode === 'signup' && updatedFormData.password !== updatedFormData.confirmPassword) {
            return 'Passwords do not match';
        }
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        const validationError = validateForm(updatedFormData);
        setValidationError(validationError);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validateForm(formData);
        if (validationError) {
            setValidationError(validationError);
            return;
        }
        callback(e);
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3001/api/v1/auth/google';
    };

    return (
        <section className="py-24 md:py-32">
            <div className="container px-4 mx-auto">
                <div className="max-w-sm mx-auto">
                    <div className="mb-6 text-center">
                        <h3 className="mb-4 text-2xl md:text-3xl font-bold">{title}</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label
                                className="block mb-2 text-coolGray-800 font-medium"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                autoComplete="email"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block mb-2 text-coolGray-800 font-medium"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                type="password"
                                name="password"
                                placeholder="************"
                                value={formData.password}
                                onChange={handleInputChange}
                                autoComplete={mode === 'signup' ? "new-password" : "current-password"}
                            />
                        </div>
                        {mode === 'signup' && (
                            <div className="mb-4">
                                <label
                                    className="block mb-2 text-coolGray-800 font-medium"
                                    htmlFor="confirmPassword"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="************"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    autoComplete="new-password"
                                />
                            </div>
                        )}
                        {validationError && (
                            <div className="text-center my-4 text-red-600">
                                {validationError}
                            </div>
                        )}
                        {error && !validationError && (
                            <div className="text-center my-4 text-red-600">
                                {error}
                            </div>
                        )}
                        <button
                            className="inline-block py-3 px-7 mb-6 w-full text-base text-green-50 font-medium text-center leading-6 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm"
                            type="submit"
                        >
                            {buttonText}
                        </button>
                        <div className="text-center">
                            <button
                                className="flex items-center justify-center py-3 px-7 mb-6 w-full text-base font-medium text-center leading-6 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm"
                                type="button"
                                onClick={handleGoogleLogin}
                            >
                                <Image
                                    src="/g-logo.png"
                                    alt="Google logo"
                                    width={24}
                                    height={24}
                                />
                                <span className="text-gray-700">Continue with Google</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}