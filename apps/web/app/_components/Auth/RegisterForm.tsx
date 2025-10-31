'use client';

import { useRouter } from "next/navigation";
import { authHooks } from "@avoo/hooks";
import { Button, ButtonFit, ButtonIntent } from "../Button/Button";
import Link from "next/link";
import { useState } from "react";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const router = useRouter();

    const { register, handleSubmit, errors, isSubmitting } = authHooks.useRegisterForm({
        onSuccess: () => {
            router.push('/');
        },
    });

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

            <form onSubmit={handleSubmit} className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
                <div>
                    <input
                        {...register("name")}
                        type="text"
                        placeholder="Full Name"
                        className={`block w-full rounded-lg border ${
                            errors.name ? 'border-red-500' : 'border-gray-200'
                        } bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        className={`block w-full rounded-lg border ${
                            errors.email ? 'border-red-500' : 'border-gray-200'
                        } bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="relative">
                    <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`block w-full rounded-lg border ${
                            errors.password ? 'border-red-500' : 'border-gray-200'
                        } bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showPassword ? <p>👁️</p> : <p>🫣</p>}
                    </button>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="relative">
                    <input
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className={`block w-full rounded-lg border ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                        } bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showConfirmPassword ? <p>👁️</p> : <p>🫣</p>}
                    </button>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                {...register("agreeToTerms")}
                                type="checkbox"
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                            />
                        </div>
                        <label className="ml-2 text-sm text-gray-600">
                            I agree to the Privacy Policy, Terms of Service and Terms of Business.
                        </label>
                    </div>
                    {errors.agreeToTerms && <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms.message}</p>}
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    loading={isSubmitting}
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
            </form>
        </div>
    );
}