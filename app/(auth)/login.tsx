// import AppButton from "@/components/AppButton";
// import Screen from "@/components/Screen";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authStore";
// import { router } from "expo-router";
// import { useState } from "react";
// import {
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";

// const LoginScreen = () => {
//   const login = useAuthStore((s) => s.login);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onLogin = () => {
//     // no API yet: just mark as logged in
//     login({ email });
//     router.replace("/(tabs)");
//   };
//   return (
//     <Screen>
//       <KeyboardAvoidingView
//         // style={{ flex: 1 }}
//         // behavior={Platform.OS === "ios" ? "padding" : undefined}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
//       >
//         <ScrollView>
//           <View style={styles.container}>
//             <Image
//               source={require("@/assets/images/roadWise.png")}
//               style={{
//                 width: 150,
//                 height: 150,
//                 alignSelf: "center",
//                 borderRadius: 75,
//                 borderWidth: 1,
//                 borderColor: COLORS.primary,
//               }}
//               resizeMode="contain"
//             />
//             <Text style={styles.title}>Welcome Back</Text>
//             <Text style={styles.subtitle}>Login to continue</Text>

//             <View style={styles.form}>
//               <TextInput
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="Enter your email"
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//                 style={styles.input}
//               />

//               <TextInput
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="Enter your password"
//                 secureTextEntry
//                 style={styles.input}
//               />

//               <AppButton title="Login" onPress={onLogin} />

//               <View style={styles.linkContainer}>
//                 <Text style={styles.linkText}>
//                   Don’t have an account?{" "}
//                   <Text
//                     style={styles.registerLink}
//                     onPress={() => router.push("/register")}
//                   >
//                     Register
//                   </Text>
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </Screen>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     paddingTop: 50,
//     paddingHorizontal: 24,
//     backgroundColor: COLORS.background,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 8,
//     color: COLORS.primary,
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 24,
//     color: COLORS.secondary,
//   },
//   form: {
//     gap: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.grey,
//     borderRadius: 8,
//     fontSize: 18,
//     backgroundColor: COLORS.white,
//     padding: 15,
//     // justifyContent: "center",
//     // alignItems: "center",
//   },
//   // linkContainer: {
//   //   marginTop: 16,
//   //   alignItems: "center",
//   // },
//   // linkText: {
//   //   color: COLORS.secondary,
//   //   fontSize: 14,
//   //   fontWeight: "500",
//   // },
//   linkContainer: {
//     marginTop: 16,
//     alignItems: "center",
//   },
//   linkText: {
//     fontSize: 14,
//     color: COLORS.surface,
//   },
//   registerLink: {
//     color: COLORS.secondary,
//     fontWeight: "600",
//   },
// });

import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";

import { loginDriver } from "@/api/loginUser";
import AppButton from "@/components/AppButton";
import { useAuthStore } from "@/stores/authStore";
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
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

const LoginScreen = () => {
  const login = useAuthStore((s) => s.login);

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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  // const response = await createDriver(values);
                  const response = await loginDriver(values);

                  const user = response?.user ?? { email: values.email };
                  // data?.user ?? { email: values.email };
                  login(user); // save to zustand + AsyncStorage

                  // console.log("Response:", response);
                  Alert.alert("Success", "Logged in successfully!");
                  router.replace("/(tabs)"); // redirect to main app
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

                  <AppButton title="Login" onPress={() => handleSubmit()} />

                  {/* <Button title="TEST" onPress={() => handleSubmit()} /> */}

                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>
                      Don`&apos;`t have an account?{" "}
                      <Text
                        style={styles.registerLink}
                        onPress={() => router.push("/register")}
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

export default LoginScreen;

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
