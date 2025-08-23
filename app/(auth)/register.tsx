import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";

import { createDriver } from "@/api/createAccount";
import AppButton from "@/components/AppButton";
import { router } from "expo-router";
import { Formik } from "formik";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(4).label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  confirmPassword: Yup.string().required().min(4).label("Confirm Password"),
  phone: Yup.string().required().min(11).max(12).label("Phone"),
});

const RegisterScreen = () => {
  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join in seconds</Text>

            <Formik
              initialValues={{
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                if (values.password !== values.confirmPassword) {
                  alert("Passwords do not match");
                  return;
                }

                try {
                  // const response = await createDriver(values);
                  await createDriver(values);

                  Alert.alert("Success", "New driver created successfully!");
                  router.push("/login");
                } catch (error) {
                  console.error("Submission error:", error);

                  if (
                    typeof error === "object" &&
                    error !== null &&
                    "response" in error &&
                    typeof (error as any).response?.data?.message === "string"
                  ) {
                    Alert.alert("Error", (error as any).response.data.message);
                  } else {
                    Alert.alert("Error", "Failed to create new driver.");
                  }
                }
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.form}>
                  <TextInput
                    placeholder="Enter your name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    style={styles.input}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.error}>{errors.name}</Text>
                  )}

                  <TextInput
                    placeholder="Enter your email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    keyboardType="email-address"
                    style={styles.input}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}

                  <TextInput
                    placeholder="Enter your password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    secureTextEntry
                    style={styles.input}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}

                  <TextInput
                    placeholder="Confirm your password"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    secureTextEntry
                    style={styles.input}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                  )}

                  <TextInput
                    placeholder="Enter your contact number"
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  {touched.phone && errors.phone && (
                    <Text style={styles.error}>{errors.phone}</Text>
                  )}

                  <AppButton title="Register" onPress={() => handleSubmit()} />

                  {/* <Button title="TEST" onPress={() => handleSubmit()} /> */}

                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>
                      Already have an account?{" "}
                      <Text
                        style={styles.registerLink}
                        onPress={() => router.push("/login")}
                      >
                        Login
                      </Text>
                    </Text>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
  error: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});
