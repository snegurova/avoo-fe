import { Metadata } from "next";
import RegisterForm from "../_components/Auth/RegisterForm";

export const metadata: Metadata = {
    title: "Sign Up - AVOO App",
    description: "Create your professional account on AVOO App",
};

export default function SignUpPage() {
    return <RegisterForm />;
}
