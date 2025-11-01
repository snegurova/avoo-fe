import { useState } from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, Pressable, Alert } from "react-native";
import Button from "../shared/Button";
import { TextInputCustom } from "../shared/TextInputCustom";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Layout } from "../shared/Layout";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { authHooks } from "@avoo/hooks";
import { Controller } from "react-hook-form";


export default function LoginScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    const { control, handleSubmit, errors, isSubmitting } = authHooks.useLoginForm();

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Layout centerContent={true} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>
                        AVOO App
                    </Text>
                    <Text style={styles.subtitle}>
                        Sign in to your AVOO account
                    </Text>

                    <View style={styles.form}>
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
                                        textContentType="password"
                                        autoComplete="off"
                                        autoCorrect={false}
                                    />
                                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                                </View>
                            )}
                        />

                        <Button
                            onPress={handleSubmit}
                            title="Log in"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        />
                     
                 
                        <View style={styles.signUpContainer}>
                            <Text style={styles.navigateToSignIn}>No account?</Text>
                            <Pressable
                                onPress={() => navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'RegisterScreen' }],
                                })}
                                accessibilityRole="button"
                                accessibilityLabel="Sign up for a new account"
                                accessibilityHint="Navigates to registration screen"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                disabled={isSubmitting}
                            >
                                <Text style={[styles.signInLink, isSubmitting && styles.disabledLink]}>Sign up</Text>
                            </Pressable>
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
    disabledLink: {
        opacity: 0.5,
    },
});