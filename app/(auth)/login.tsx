import AppButton from "@/components/AppButton";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const LoginScreen = () => {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = () => {
    // no API yet: just mark as logged in
    login({ email });
    router.replace("/(tabs)");
  };
  return (
    <Screen>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/roadWise.png")}
            style={{
              width: 150,
              height: 150,
              alignSelf: "center",
              borderRadius: 75,
              borderWidth: 1,
              borderColor: COLORS.primary,
            }}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              style={styles.input}
            />

            <AppButton title="Login" onPress={onLogin} />

            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>
                Don’t have an account?{" "}
                <Text
                  style={styles.registerLink}
                  onPress={() => router.push("/register")}
                >
                  Register
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 50,
    paddingHorizontal: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: COLORS.secondary,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    fontSize: 18,
    backgroundColor: COLORS.white,
    padding: 15,
    // justifyContent: "center",
    // alignItems: "center",
  },
  // linkContainer: {
  //   marginTop: 16,
  //   alignItems: "center",
  // },
  // linkText: {
  //   color: COLORS.secondary,
  //   fontSize: 14,
  //   fontWeight: "500",
  // },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: COLORS.surface,
  },
  registerLink: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
});
