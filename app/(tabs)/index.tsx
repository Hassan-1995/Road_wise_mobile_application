import { getDropoutAssignmentsByDriver } from "@/api/dropoutAssignmentByDriver";
import { IconSymbol } from "@/components/IconSymbol";
import Screen from "@/components/Screen";
import TripCard from "@/components/TripCard";
import { COLORS } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type DropoutAssignment = {
  assignedAt: string;
  address: string;
  driverId: number;
  id: number;
  latitude: string;
  longitude: string;
  status: "Pending" | "Completed" | "Cancelled";
  storeId: number;
  storename: string;
  tripId: number;
};

// Utility function to group the fetchedData by tripId
const groupByTripId = (
  data: DropoutAssignment[]
): Record<number, DropoutAssignment[]> => {
  return data.reduce((groups, item) => {
    if (!groups[item.tripId]) {
      groups[item.tripId] = [];
    }
    groups[item.tripId].push(item);
    return groups;
  }, {} as Record<number, DropoutAssignment[]>);
};

const Trip = () => {
  const [data, setData] = useState<Record<number, DropoutAssignment[]> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState(0);

  const fetchDropoutAssignment = async () => {
    //
    const driverId = 13;
    //
    try {
      const fetchedData = await getDropoutAssignmentsByDriver(driverId);
      const groupedData = groupByTripId(fetchedData as DropoutAssignment[]);
      setData(groupedData);
      setTrips(Object.keys(groupedData).length);
    } catch (error) {
      if (error instanceof Error) {
        console.error("API error:", error.message, error);
      } else {
        console.error("API error:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDropoutAssignment();
  }, []);

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
              <Text style={styles.totalTripsCount}>{trips}</Text>
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
          {loading && (
            <ActivityIndicator
              size={50}
              color={COLORS.primary}
              style={{
                marginTop: 60,
              }}
            />
          )}
          {data &&
            Object.entries(data).map(([tripId, tripGroup]) => (
              <TripCard key={tripId} tripData={tripGroup} />
            ))}
          {/* {data && <TripCard tripData={data} />} */}
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
