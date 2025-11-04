import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Layout } from "../shared/Layout";
import RegistrationForm from "../components/RegistrationForm";




export default function RegisterScreen() {
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

                    <RegistrationForm />

                    <View style={styles.footer}>
                        <Text style={styles.copyright}>© 2025 Avoo</Text>
                        <Text
                            style={styles.privacyLink}
                        >
                            Privacy Policy
                        </Text>
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