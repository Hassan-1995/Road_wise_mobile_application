import { IconSymbol } from "@/components/IconSymbol";
import Screen from "@/components/Screen";
import TripCard from "@/components/TripCard";
import { COLORS } from "@/constants/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Trip = () => {
  return (
    <Screen>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>My Trips</Text>
            <IconSymbol size={28} name={"car.fill"} color={COLORS.white} />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.totalTripsCount}>3</Text>
              <Text style={styles.label}>Total Trips</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.activeCount}>2</Text>
              <Text style={styles.label}>Active</Text>
            </View>
          </View>
        </View>
        <View
          style={{ marginTop: -10, paddingHorizontal: 15, paddingBottom: 6 }}
        >
          <TripCard />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Trip;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 24,
  },
  infoContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 0,
  },
  infoBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  totalTripsCount: {
    color: COLORS.blue,
    fontSize: 30,
    fontWeight: "700",
  },
  activeCount: {
    color: COLORS.amber,
    fontSize: 30,
    fontWeight: "700",
  },
  label: {
    color: COLORS.grey,
    fontSize: 14,
  },
});
