import { updateTripStatusOrEndTime } from "@/api/optimisedPath_statusOrEndtime"; // your backend API
import { setTripTime } from "@/api/tripTime";
import AppButton from "@/components/AppButton";
import { stopBackgroundLocationTracking } from "@/components/LocationTask";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import { useTripStore } from "@/stores/useTripStore";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";

const TripUpdateScreen = () => {
  const { trip } = useTripStore();

  const [status, setStatus] = useState<
    "Ongoing" | "Pending" | "Completed" | "Cancelled" | undefined
  >(undefined);
  const [endTrip, setEndTrip] = useState(false);

  const handleConfirm = async () => {
    try {
      const payload = {
        tripId: Number(trip),
        status,
        updateEndTime: endTrip,
      };

      const result = await updateTripStatusOrEndTime(payload);
      console.log("Update response:", result);

      Alert.alert(
        "Success",
        `Trip ${endTrip ? "ended" : "updated"} with status: ${status}`
      );
    } catch (error) {
      console.error("Error updating trip:", error);
      Alert.alert("Error", "Failed to update trip. Please try again.");
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Update Trip</Text>

        {/* Status Picker */}
        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={status}
            onValueChange={(value) => setStatus(value)}
            style={styles.picker}
          >
            <Picker.Item label="Pick a value" value="undefined" />
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Ongoing" value="Ongoing" />
            <Picker.Item label="Completed" value="Completed" />
            <Picker.Item label="Cancelled" value="Cancelled" />
          </Picker>
        </View>

        {/* End Trip Toggle */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>End Trip</Text>
          <Switch
            value={endTrip}
            onValueChange={async () => {
              setEndTrip((prev) => !prev);
              stopBackgroundLocationTracking();

              try {
                await setTripTime({
                  tripId: Number(trip),
                  endTime: new Date().toISOString(),
                });
                alert("Trip time ended successfully");
              } catch (error) {
                console.error("Failed to stop trip end time:", error);
                alert("Failed to stop trip end time:" + error);
              }
            }}
            trackColor={{ false: COLORS.green, true: COLORS.red }}
            thumbColor={endTrip ? COLORS.primary : COLORS.primary}
          />
        </View>

        {/* Confirm Button */}
        <AppButton title="Confirm" onPress={handleConfirm} />
      </View>
    </Screen>
  );
};

export default TripUpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 24,
  },
  picker: {
    width: "100%",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
});
