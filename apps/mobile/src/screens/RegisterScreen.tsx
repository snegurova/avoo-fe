import { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, Pressable, Alert } from "react-native";
import Button from "../shared/Button";
import { useAuthStore } from "@avoo/store";
import { TextInputCustom } from "../shared/TextInputCustom";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Layout } from "../shared/Layout";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import CheckBox from "../shared/CheckBox";
import { authHooks } from "@avoo/hooks";
import { Controller } from "react-hook-form";




export default function RegisterScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { control, handleSubmit, errors, isSubmitting } = authHooks.useRegisterForm();


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Layout style={styles.container} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
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
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <TextInputCustom
                                        placeholder="Full Name"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        style={errors.name && styles.inputError}
                                        autoCapitalize="words"
                                        keyboardType="default"
                                    />
                                    {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <TextInputCustom
                                        placeholder="Email"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        style={errors.email && styles.inputError}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <TextInputCustom
                                        placeholder="Password"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        style={errors.password && styles.inputError}
                                        secureTextEntry={!showPassword}
                                        rightIcon={showPassword ? <FontAwesome name="eye" size={24} color="black" /> : <FontAwesome name="eye-slash" size={24} color="black" />}
                                        onRightIconPress={() => setShowPassword(!showPassword)}
                                        textContentType="newPassword"
                                        autoComplete="off"
                                        autoCorrect={false}
                                    />
                                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <TextInputCustom
                                        placeholder="Confirm Password"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        style={errors.confirmPassword && styles.inputError}
                                        secureTextEntry={!showConfirmPassword}
                                        rightIcon={showConfirmPassword ? <FontAwesome name="eye" size={24} color="black" /> : <FontAwesome name="eye-slash" size={24} color="black" />}
                                        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        textContentType="newPassword"
                                        autoComplete="off"
                                        autoCorrect={false}
                                    />
                                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="agreeToTerms"
                            render={({ field: { onChange, value } }) => (
                                <View>
                                    <CheckBox
                                        label="I agree to the Privacy Policy, Terms of Service and Terms of Business."
                                        isChecked={value}
                                        errors={!!errors.agreeToTerms}
                                        onValueChange={onChange}
                                    />
                                    {errors.agreeToTerms && <Text style={styles.errorText}>{errors.agreeToTerms.message}</Text>}
                                </View>
                            )}
                        />

                        <Button
                            onPress={handleSubmit}
                            title="Create Account"
                            loading={isSubmitting}
                            disabled={isSubmitting}
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