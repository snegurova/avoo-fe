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


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const setIsAuthenticated = useAuthStore(state => state.setIsAuthenticated);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleLogin = () => {
        setIsAuthenticated(true);
    }

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
                        <TextInput
                            style={[styles.input, styles.formItem]}
                            placeholder="Email"
                            placeholderTextColor="#94A3B8"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <TextInputCustom
                            style={styles.inputText}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            rightIcon={showPassword ? <FontAwesome name="eye" size={24} color="black" /> : <FontAwesome name="eye-slash" size={24} color="black" />}
                            onRightIconPress={() => setShowPassword(!showPassword)}
                        />

                        <Button
                            style={styles.formItem}
                            onPress={handleLogin}
                            title="Log in"
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
                            >
                                <Text style={styles.signInLink}>Sign up</Text>
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
    },
    formItem: {
        marginBottom: 16,
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
    inputText: {
        color: '#0F172A',
        fontSize: 18,
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
});