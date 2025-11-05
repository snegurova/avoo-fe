import { StyleSheet, View } from "react-native";
import { FormTextInput } from "../shared/FormTextInput";
import { useState } from "react";
import { FormCheckBox } from "../shared/FormCheckBox";
import Button from "../shared/Button";
import { authHooks } from "packages/hooks/src";
import FontAwesome from '@expo/vector-icons/FontAwesome';




export default function RegistrationForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { control, handleSubmit, errors, isSubmitting } = authHooks.useRegisterForm();


    return (
        <View style={styles.form}>
            <FormTextInput 
                name="name"
                control={control}
                placeholder="Full Name"
                error={errors.name?.message}
                autoCapitalize="words"
                keyboardType="default"
            />
            <FormTextInput
                name="email"
                control={control}
                placeholder="Email"
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <FormTextInput
                name="password"
                control={control}
                placeholder="Password"
                error={errors.password?.message}
                secureTextEntry={!showPassword}
                accessoryRight={showPassword ? <FontAwesome name="eye" size={24} color="black" /> : <FontAwesome name="eye-slash" size={24} color="black" />}
                onAccessoryRightPress={() => setShowPassword(!showPassword)}
                textContentType="newPassword"
                autoComplete="off"
                autoCorrect={false}
            />
            <FormTextInput
                name="confirmPassword"
                control={control}
                placeholder="Confirm Password"
                error={errors.confirmPassword?.message}
                secureTextEntry={!showConfirmPassword}
                accessoryRight={showConfirmPassword ? <FontAwesome name="eye" size={24} color="black" /> : <FontAwesome name="eye-slash" size={24} color="black" />}
                onAccessoryRightPress={() => setShowConfirmPassword(!showConfirmPassword)}
                textContentType="newPassword"
                autoComplete="off"
                autoCorrect={false}
            />
            <FormCheckBox
                name="agreeToTerms"
                control={control}
                label="I agree to the Privacy Policy, Terms of Service and Terms of Business."
                error={errors.agreeToTerms?.message}
            />
            <Button
                onPress={handleSubmit}
                title="Create Account"
                loading={isSubmitting}
                disabled={isSubmitting}
            />
        </View>
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
  

});