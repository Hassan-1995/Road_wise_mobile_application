import { getDriverID } from "@/api/getDriverID";
import { updatingStatusByDriver } from "@/api/updatingStatus";
import AppButton from "@/components/AppButton";
import Screen from "@/components/Screen";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { useAuthStore } from "@/stores/authStore";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const StoreUpdate = () => {
  const user = useAuthStore((s) => s.user);
  const { location } = useCurrentLocation();
  const { store, address, status, storeLocation, storeId, tripId } =
    useLocalSearchParams();
  let lat = 0,
    lng = 0;
  if (typeof storeLocation === "string") {
    [lat, lng] = storeLocation.split(",").map(Number);
  } else if (Array.isArray(storeLocation) && storeLocation.length > 0) {
    [lat, lng] = storeLocation[0].split(",").map(Number);
  }

  const [updateStatus, setUpdateStatus] = useState(status);

  const handleUpdateStatus = async () => {
    if (updateStatus === "Completed") {
      const checkDistance = haversineDistance(
        location?.coords.latitude!,
        location?.coords.longitude!,
        lat,
        lng
      );
      if (checkDistance < 700) {
        alert("You are not arrived to your drop-off location.");
      }
      return;
    }
    try {
      const driverId = (await getDriverID(user?.id || 0)) as { id: number };

      console.log("updates status: ", status);
      const updateData = await updatingStatusByDriver(
        driverId.id,
        // 1, // Replace with actual driverId if dynamic
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

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // return Math.round(R * c); // distance in km
    const distance = R * c * 1000; // distance in m
    return parseFloat(distance.toFixed(2)); // returns two decimal place
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

          <Text>
            {haversineDistance(
              location?.coords.latitude!,
              location?.coords.longitude!,
              lat,
              lng
            )}
          </Text>

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
