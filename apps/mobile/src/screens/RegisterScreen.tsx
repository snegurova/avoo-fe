import { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, Pressable } from "react-native";
import Button from "../shared/Button";
import { useAuthStore } from "@avoo/store";
import { TextInputCustom } from "../shared/TextInputCustom";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Layout } from "../shared/Layout";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import CheckBox from "../shared/CheckBox";
import { authApi } from "@avoo/axios";


export default function RegisterScreen() {
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
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
            setLoading(true)
            await authApi.register({
                email,
                password,
                name
            })
            setIsAuthenticated(true)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }

    };

    return (
        <Layout centerContent={true} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>
                        AVOO App
                    </Text>
                    <Text style={styles.subtitle}>
                        Create a professional account
                    </Text>
                    <Text style={styles.subtitle}>
                        Create an account or login in your busines
                    </Text>

                    <View style={styles.form}>
                        <View>
                            <TextInput
                                style={[styles.input, nameError && styles.inputError]}
                                placeholder="Full Name"
                                placeholderTextColor="#94A3B8"
                                value={name ?? ""}
                                onChangeText={setName}
                                autoCapitalize="words"
                                keyboardType="default"
                            />
                            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                        </View>

                        <View>
                            <TextInput
                                style={[styles.input, emailError && styles.inputError]}
                                placeholder="Email"
                                placeholderTextColor="#94A3B8"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                        </View>

                        <View>
                            <TextInputCustom
                                style={passwordError && styles.inputError}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                rightIcon={showPassword ? <FontAwesome name="eye" size={24} color="black" /> : <FontAwesome name="eye-slash" size={24} color="black" />}
                                onRightIconPress={() => setShowPassword(!showPassword)}
                            />
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        </View>

                        <View>
                            <TextInputCustom
                                style={confirmPasswordError && styles.inputError}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                rightIcon={showConfirmPassword ? <FontAwesome name="eye" size={24} color="black" /> : <FontAwesome name="eye-slash" size={24} color="black" />}
                                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                        </View>

                        <View>
                            <CheckBox
                                label="I agree to the Privacy Policy, Terms of Service and Terms of Business."
                                isChecked={agreeToTerms}
                                errors={termsError !== ""}
                                onValueChange={setAgreeToTerms}
                            />
                            {termsError && !agreeToTerms ? <Text style={styles.errorText}>{termsError}</Text> : null}
                        </View>

                        <Button
                            onPress={handleRegister}
                            title="Create Account"
                            loading={loading}
                            disabled={loading}
                        />


                        <View style={styles.signUpContainer}>
                            <Text style={styles.navigateToSignIn}>Having account?</Text>
                            <Pressable
                                onPress={() => navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'LoginScreen' }],
                                })}
                                accessibilityRole="button"
                                accessibilityLabel="Sign up for a new account"
                                accessibilityHint="Navigates to registration screen"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Text style={styles.signInLink}>Log in</Text>
                            </Pressable>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.copyright}>© 2025 Avoo</Text>
                            <Text
                                style={styles.privacyLink}
                            >
                                Privacy Policy
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
        backgroundColor: '#FFFFFF'
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: "center",
        marginBottom: 8,
        color: '#0F172A',
    },
    subtitle: {
        fontSize: 18,
        color: '#64748B',
        textAlign: "center",
        marginBottom: 48,
    },
    wrapper: {
        width: '100%',
    },
    form: {
        width: '100%',
        gap: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 16,
        fontSize: 18,
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        gap: 4,
    },
    navigateToSignIn: {
        fontSize: 16,
        color: '#64748B',
    },
    signInLink: {
        fontSize: 16,
        color: '#2563EB',
        textDecorationLine: 'underline',
        padding: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    copyright: {
        fontSize: 14,
        color: '#64748B',
    },
    privacyLink: {
        fontSize: 14,
        color: '#2563EB',
    },
});