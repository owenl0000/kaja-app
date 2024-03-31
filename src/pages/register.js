// pages/register.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline"; // Assuming you're using Heroicons

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        // Reset specific error messages as the user types
        if (name === "password" || name === "confirmPassword") setPasswordError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setErrorMessage("");
        const res = await fetch("/api/Users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const response = await res.json();
            setErrorMessage(response.message);
        } else {
            router.push("/auth/signin");
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex h-screen justify-center items-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg border border-gray-200">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register your account</h2>
                <form className="mt-8" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input id="name" name="name" type="text" placeholder="John Doe" onChange={handleChange} required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input id="email" name="email" type="email" placeholder="you@example.com" onChange={handleChange} required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm" />
                        </div>
                        <div className="relative items-center">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" onChange={handleChange} required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm" />
                            <div className="absolute right-3 top-8 flex items-center">
                                {showPassword ? (
                                    <EyeOffIcon className="h-5 w-5 text-gray-700 cursor-pointer" onClick={toggleShowPassword} />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-700 cursor-pointer" onClick={toggleShowPassword} />
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="" onChange={handleChange} required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm" />
                            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                        </div>
                    </div>
                    <button type="submit" className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-coral hover:bg-[#EE5656] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral">
                        Register
                    </button>
                    {errorMessage && <p className="text-red-500 text-center mt-3">{errorMessage}</p>}
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="#" onClick={() => router.push('/auth/signin')} className="font-medium text-coral hover:text-[#EE5656]">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
