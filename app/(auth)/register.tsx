import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

const RegisterScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Register</Text>
      {/* build your form here; for now just link back */}
      <Button
        title="Back to Login"
        onPress={() => router.replace("/(auth)/login")}
      />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
