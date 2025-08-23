// before implementation
import { getDropoutAssignmentsByDriver } from "@/api/dropoutAssignmentByDriver";
import { getDriverID } from "@/api/getDriverID";
import { IconSymbol } from "@/components/IconSymbol";
import Screen from "@/components/Screen";
import TripCard from "@/components/TripCard";
import { COLORS } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
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

const Trip = () => {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<Record<number, DropoutAssignment[]> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState(0);

  const [showPicker, setShowPicker] = useState(false);
  const [displayedDate, setDisplayedDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // "July 28, 2025"
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
    return formatted;
  }); // e.g. "2025-07-22"

  useEffect(() => {
    const fetchDropoutAssignment = async () => {
      // const driverId = 1; //static driver_id
      const driverId = (await getDriverID(user?.id || 0)) as { id: number };
      setLoading(true);
      try {
        const fetchedData = await getDropoutAssignmentsByDriver(driverId.id);
        const filtered = selectedDate
          ? filterByDate(fetchedData as DropoutAssignment[], selectedDate)
          : fetchedData;
        const groupedData = groupByTripId(filtered as DropoutAssignment[]);
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
    fetchDropoutAssignment();
  }, [selectedDate]);

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
  const filterByDate = (allData: DropoutAssignment[], date: string) => {
    return allData.filter((item) => item.assignedAt.startsWith(date));
  };
  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0]; // "2025-07-22"
      const display = selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setSelectedDate(formatted); // For filtering
      setDisplayedDate(display); // For showing
      setLoading(true);
    }
  };

  return (
    <Screen>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>My Trips</Text>
            <Pressable onPress={() => setShowPicker(true)}>
              <View style={styles.datePickerButton}>
                <Text style={styles.datePickerText}>{displayedDate}</Text>
              </View>
            </Pressable>

            <IconSymbol size={28} name={"car.fill"} color={COLORS.white} />
          </View>
          {showPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()} // optional
            />
          )}
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
          {!loading &&
            data &&
            Object.entries(data).map(([tripId, tripGroup]) => (
              <TripCard key={tripId} tripData={tripGroup} />
            ))}
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
  datePickerButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  datePickerText: {
    color: COLORS.grey,
    fontWeight: "600",
  },
});
