import { updatingStatusByDriver } from "@/api/updatingStatus";
import AppButton from "@/components/AppButton";
import Screen from "@/components/Screen";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const StoreUpdate = () => {
  const { store, address, status, storeId, tripId } = useLocalSearchParams();
  const [updateStatus, setUpdateStatus] = useState(status);

  const handleUpdateStatus = async () => {
    // You can trigger an API call here
    alert(`Status updated to: ${updateStatus}`);
    try {
      const updateData = await updatingStatusByDriver(
        11, // Replace with actual driverId if dynamic
        Number(storeId),
        Number(tripId),
        String(updateStatus)
      );

      console.log("Status updated successfully:", updateData);
      alert(`Status updated to: ${updateStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  };
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Drop-off Details</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Store</Text>
          <Text style={styles.value}>{store}</Text>

          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{address}</Text>

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={updateStatus}
              onValueChange={(itemValue) => setUpdateStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Completed" value="Completed" />
              <Picker.Item label="Cancelled" value="Cancelled" />
            </Picker>
          </View>

          <AppButton title="Update Status" onPress={handleUpdateStatus} />
        </View>
      </View>
    </Screen>
  );
};

export default StoreUpdate;

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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    marginTop: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  picker: {
    width: "100%",
  },
});
