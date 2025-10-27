'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@avoo/axios";
import { useAuthStore } from "@avoo/store";
import { Button, ButtonFit, ButtonIntent } from "../Button/Button";
import Link from "next/link";

export default function RegisterForm() {
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [termsError, setTermsError] = useState("");

    const setIsAuthenticated = useAuthStore(state => state.setIsAuthenticated);
    const router = useRouter();

    const validateForm = () => {
        let isValid = true;

        if (!name?.trim()) {
            setNameError("Name is required");
            isValid = false;
        } else if (name?.trim().length < 2) {
            setNameError("Name must be at least 2 characters");
            isValid = false;
        } else {
            setNameError("");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password");
            isValid = false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError("Passwords do not match");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }

        if (!agreeToTerms) {
            setTermsError("You must agree to the terms");
            isValid = false;
        } else {
            setTermsError("");
        }

        return isValid;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;
        try {
            setLoading(true);
            await authApi.register({
                email,
                password,
                name
            });
            setIsAuthenticated(true);
            router.push('/'); 
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
                    AVOO App
                </h1>
                <h2 className="mt-2 text-center text-lg text-gray-600">
                    Create a professional account
                </h2>
                <p className="text-center text-lg text-gray-600">
                    Create an account or login in your business
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
                <div>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name ?? ""}
                        onChange={(e) => setName(e.target.value)}
                        className={`block w-full rounded-lg border ${
                            nameError ? 'border-red-500' : 'border-gray-200'
                        } bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full rounded-lg border ${
                            emailError ? 'border-red-500' : 'border-gray-200'
                        } bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full rounded-lg border ${
                            passwordError ? 'border-red-500' : 'border-gray-200'
                        } bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showPassword ? (
                            <p>👁️</p>
                        ) : (
                            <p>🫣</p>
                        )}
                    </button>
                    {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
                </div>

                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`block w-full rounded-lg border ${
                            confirmPasswordError ? 'border-red-500' : 'border-gray-200'
                        } bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showConfirmPassword ? (
                            <p>👁️</p>
                        ) : (
                            <p>🫣</p>
                        )}
                    </button>
                    {confirmPasswordError && <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>}
                </div>

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                        />
                    </div>
                    <label className="ml-2 text-sm text-gray-600">
                        I agree to the Privacy Policy, Terms of Service and Terms of Business.
                    </label>
                </div>
                {termsError && <p className="mt-1 text-sm text-red-500">{termsError}</p>}

                <Button
                    onClick={handleRegister}
                    disabled={loading}
                    loading={loading}
                    fit={ButtonFit.Fill}
                    intent={ButtonIntent.Primary}
                >
                    Create Account
                </Button>

                <p className="mt-4 text-center text-gray-600">
                    Having account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>

                <div className="flex justify-between items-center mt-8 text-sm text-gray-600">
                    <span>© 2025 Avoo</span>
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    );
}
