'use client';

import { useRouter } from "next/navigation";
import { authHooks } from "@avoo/hooks";
import { Button, ButtonFit, ButtonIntent } from "../Button/Button";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    
    const router = useRouter();

    const { register, handleSubmit, errors, isSubmitting } = authHooks.useLoginForm({
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
                    Sign in to your AVOO account
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
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

                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    fit={ButtonFit.Fill}
                    intent={ButtonIntent.Primary}
                >
                    Log in
                </Button>

                <p className="mt-4 text-center text-gray-600">
                    No account?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:underline">
                        Sign up
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

