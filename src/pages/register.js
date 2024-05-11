// pages/register.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import SuccessMessage from "@/utils/SuccessMessage";

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [passwordStrengthMessage, setPasswordStrengthMessage] = useState("");
    const [passwordMismatchError, setPasswordMismatchError] = useState("");

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        const isValidLength = password.length >= 8;
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isValidLength;
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength; // Return a value between 0 and 5
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        // Reset specific error messages as the user types
        if (name === "email" && !validateEmail(value)) {
            setErrorMessage("Please enter a valid email address.");
        } else if (name === "password") {
            const strength = getPasswordStrength(value);
            if (strength <= 2) {
                setPasswordStrengthMessage("Weak password.");
            } else if (strength === 3) {
                setPasswordStrengthMessage("Medium password.");
            } else {
                setPasswordStrengthMessage("Strong password.");
            }
            setFormData(prev => ({
                ...prev,
                passwordStrength: strength,
            }));
        } else if (name === "confirmPassword") {
            setPasswordMismatchError(value !== formData.password ? "Passwords do not match." : "");
        } else {
            setErrorMessage("");
        }
    };

    const PasswordRequirements = ({ password }) => {
        const requirements = [
            { label: "At least 8 characters", test: (password) => password.length >= 8 },
            { label: "At least one uppercase letter (A-Z)", test: (password) => /[A-Z]/.test(password) },
            { label: "At least one lowercase letter (a-z)", test: (password) => /[a-z]/.test(password) },
            { label: "At least one number (0-9)", test: (password) => /[0-9]/.test(password) },
            { label: "At least one special character (!@#$%^&*)", test: (password) => /[^A-Za-z0-9]/.test(password) },
        ];
    
        return (
            <ul className="list-disc pl-5 text-sm text-gray-700">
                {requirements.map((req, index) => (
                    <li key={index} className={req.test(password) ? "text-green-500" : "text-red-500"}>
                        {req.label}
                    </li>
                ))}
            </ul>
        );
    };
    

    const getPasswordStrengthColor = (strength) => {
        switch (strength) {
            case 1:
            case 2:
                return "text-red-500";
            case 3:
                return "text-yellow-500";
            case 4:
            case 5:
                return "text-green-500";
            default:
                return "text-gray-500";
        }
    };

    const PasswordStrengthBar = ({ strength }) => {
        const getColor = (strength) => {
            switch (strength) {
                case 1:
                case 2:
                    return "bg-red-500"; // Weak
                case 3:
                    return "bg-yellow-500"; // Medium
                case 4:
                case 5:
                    return "bg-green-500"; // Strong
                default:
                    return "bg-gray-300"; // No password entered
            }
        };

        const width = `${(strength / 5) * 100}%`; // Calculate width percentage based on strength level

        return (
            <div className="w-full bg-gray-200 h-1.5">
                <div className={`h-1.5 ${getColor(strength)}`} style={{ width }}></div>
            </div>
        );
    };

    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(formData.password)) {
            setPasswordStrengthMessage("Please ensure your password meets all the requirements.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setPasswordMismatchError("Passwords do not match.");
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
            switch (response.errorCode) {
                case 'EmailInUse':
                    setErrorMessage("This email is already in use. Please use a different email or sign in.");
                    break;
                case 'InvalidInput':
                    setErrorMessage("Your input is invalid. Please check all fields and try again.");
                    break;
                default:
                    setErrorMessage(response.message || "An unexpected error occurred. Please try again.");
            }
        } else {
            
            setIsRegistered(true);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex h-screen justify-center items-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg border border-gray-200">
                {isRegistered ? (
                    <SuccessMessage message="Registration successful! You can now sign in." />
                ) : (
                    <>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register your account</h2>
                        <form className="mt-8" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input id="name" name="name" type="text" autoComplete="name" placeholder="John Doe" onChange={handleChange} required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" onChange={handleChange} required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm" />
                                </div>
                                <div className="relative">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm"
                                    />
                                    <div className="absolute top-8 right-3 flex pt-[1px] items-center">
                                        {showPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-700 cursor-pointer" onClick={toggleShowPassword} />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-700 cursor-pointer" onClick={toggleShowPassword} />
                                        )}
                                    </div>
                                    <div className="bg-white p-2 border border-gray-300 mt-2">
                                        <PasswordStrengthBar strength={formData.passwordStrength || 0} />
                                        <p className={`text-xs mt-1 ${getPasswordStrengthColor(formData.passwordStrength)}`}>{passwordStrengthMessage}</p>
                                        <details className="group">
                                            <summary className="text-sm pt-2 text-gray-500 cursor-pointer">Password Requirements</summary>
                                            <PasswordRequirements password={formData.password || ""} />
                                        </details>
                                    </div>
                                </div>
                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="" onChange={handleChange} required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm" />
                                    {passwordMismatchError && <p className="text-red-500 text-xs mt-1">{passwordMismatchError}</p>}
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
                    </>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
