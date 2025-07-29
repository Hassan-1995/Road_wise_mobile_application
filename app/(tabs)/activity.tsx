import AppButton from "@/components/AppButton";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Maintenance = () => {
  return (
    <View>
      <Text>Maintenance</Text>
      <View style={{ marginHorizontal: 20 }}>
        <AppButton title="hello" onPress={() => console.log("Hello")} />
      </View>
    </View>
  );
};

export default Maintenance;

const styles = StyleSheet.create({});
