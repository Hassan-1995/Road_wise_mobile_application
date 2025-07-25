import { COLORS } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "./IconSymbol";

const LogCard = () => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              backgroundColor: COLORS.primary,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              marginRight: 5,
              padding: 7,
            }}
          >
            <IconSymbol
              size={24}
              name={"box.truck.fill"}
              color={COLORS.white}
            />
          </View>
          <View>
            <Text style={{ fontWeight: 500, color: COLORS.primary }}>
              24-02-2025
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconSymbol
                size={15}
                name={"clock.circle"}
                color={COLORS.secondary}
              />
              <Text
                style={{
                  color: COLORS.surface,
                  marginLeft: 5,
                }}
              >
                11:20
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View>Status</View>
        </View>
      </View>
    </View>
  );
};

export default LogCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    shadowColor: COLORS.black,
    padding: 20,
  },
});
