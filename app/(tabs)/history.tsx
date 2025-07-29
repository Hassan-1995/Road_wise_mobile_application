import { getTripByDriver } from "@/api/tripByDriver";
import LogCard from "@/components/LogCard";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

type TripWithVehicle = {
  id: number;
  vehicleId: number;
  driverId: number;
  startTime: string;
  endTime: string | null;
  distanceKm: string;
  notes: string;
  status: "In_Progress" | "Completed" | "Cancelled";
  createdAt: string; // ISO 8601 datetime string
  makeModel: string;
};

const DeliveryLog = () => {
  const [data, setData] = useState<TripWithVehicle[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTripsByDriver = async () => {
    const driverId = 13; //static driver_id
    setLoading(true);
    try {
      const fetchedData = await getTripByDriver(driverId);
      setData(fetchedData as TripWithVehicle[]);
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
    fetchTripsByDriver();
  }, []);

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
          {data?.map((trip) => <LogCard key={trip.id} tripData={trip} />) || (
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
