import { getDriverID } from "@/api/getDriverID";
import { getTripByDriver } from "@/api/tripByDriver";
import LogCard from "@/components/LogCard";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

type TripWithVehicle = {
  id: number;
  vehicleId: number;
  driverId: number;
  startTime: string;
  endTime: string | null;
  distanceKm: string;
  storeName: string;
  notes: string;
  status: "In_Progress" | "Completed" | "Cancelled";
  dropstatus: "Pending" | "Completed" | "Cancelled";
  createdAt: string; // ISO 8601 datetime string
  makeModel: string;
};

const DeliveryLog = () => {
  const user = useAuthStore((s) => s.user);

  const [data, setData] = useState<TripWithVehicle[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripsByDriver = async () => {
      const driverId = (await getDriverID(user?.id || 0)) as { id: number };
      setLoading(true);
      try {
        const fetchedData = (await getTripByDriver(
          driverId.id
        )) as TripWithVehicle[];
        const filterData = fetchedData.filter(
          (item) => item.dropstatus !== "Pending"
        );
        setData(filterData.sort((a, b) => b.id - a.id));
      } catch (error) {
        if (error instanceof Error) {
          console.error("API error:", error.message, error);
        } else {
          console.error("API error:", error);
        }
      }
      setLoading(false);
    };
    fetchTripsByDriver();
  }, [user?.id]);

  return (
    <Screen>
      <ScrollView>
        <View style={styles.container}>
          {loading && (
            <ActivityIndicator
              size={50}
              color={COLORS.primary}
              style={{
                marginTop: 60,
              }}
            />
          )}
          {data?.map((trip, idx) => <LogCard key={idx} tripData={trip} />) || (
            <></>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default DeliveryLog;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
});
