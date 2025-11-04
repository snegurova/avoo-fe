'use client';

import { useRouter } from "next/navigation";
import { authHooks } from "@avoo/hooks";
import { Button, ButtonFit, ButtonIntent } from "../Button/Button";
import { useState } from "react";
import FormInput from "../FormInput/FormInput";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    
    const router = useRouter();

    const { register, handleSubmit, errors, isSubmitting } = authHooks.useLoginForm({
        onSuccess: () => {
            router.push('/');
        },
    });

    return (
        <form onSubmit={handleSubmit} className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
            <FormInput
                {...register("email")}
                type="email"
                placeholder="Email"
                error={errors.email?.message}
            />

            <FormInput
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                error={errors.password?.message}
                accessoryRight={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <p>👁️</p> : <p>🫣</p>}
                    </button>
                }
            />

            <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
                fit={ButtonFit.Fill}
                intent={ButtonIntent.Primary}
            >
                Log in
            </Button>
        </form>
    );
}

