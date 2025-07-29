import { getDropoutAssignmentsByDriver } from "@/api/dropoutAssignmentByDriver";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MapView, { Marker, Polyline, Region } from "react-native-maps";

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
type DropPoints = {
  latitude: string;
  longitude: string;
  label: string;
}[];

const MapLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [region, setRegion] = useState<Region | null>(null);
  const [data, setData] = useState<Record<number, DropoutAssignment[]> | null>(
    null
  );
  const [trip, setTrip] = useState<string>("000");
  const [dropPoints, setDropPoints] = useState<DropPoints | null>(null);

  useEffect(() => {
    const fetchDropoutAssignment = async () => {
      const driverId = 11; //static driver_id
      try {
        const fetchedData = await getDropoutAssignmentsByDriver(driverId);
        const filtered = filterByDate(
          fetchedData as DropoutAssignment[],
          "2025-07-28"
          // new Date().toISOString().slice(0, 10)
        );
        const groupedData = groupByTripId(filtered as DropoutAssignment[]);
        setData(groupedData);
        console.log("Trips: ", data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("API error:", error.message, error);
        } else {
          console.error("API error:", error);
        }
      }
    };
    fetchDropoutAssignment();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (locUpdate) => {
          setLocation(locUpdate);
          setRegion((prev) =>
            prev
              ? {
                  ...prev,
                  latitude: locUpdate.coords.latitude,
                  longitude: locUpdate.coords.longitude,
                }
              : null
          );
        }
      );

      return () => {
        subscription.remove(); // Clean up
      };
    })();
  }, []);

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

  if (!location || !region) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size={50}
          color={COLORS.primary}
          style={{
            marginTop: 60,
          }}
        />
      </View>
    );
  }
  return (
    <Screen>
      <ScrollView>
        <View
          style={{
            width: "100%",
            aspectRatio: 0.7,
            shadowColor: COLORS.black,
            borderWidth: 1,
            borderColor: COLORS.primary,
          }}
        >
          <MapView style={styles.map} region={region} showsUserLocation={true}>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              pinColor={COLORS.primary}
            />

            {dropPoints?.map((points) => (
              <Marker
                key={points.label}
                coordinate={{
                  latitude: Number(points.latitude),
                  longitude: Number(points.longitude),
                }}
                title={points.label}
                pinColor={COLORS.red}
              />
            ))}

            {dropPoints && (
              <Polyline
                coordinates={dropPoints.map((point) => ({
                  latitude: Number(point.latitude),
                  longitude: Number(point.longitude),
                }))}
                strokeColor="#FF0000"
                strokeWidth={4}
              />
            )}
          </MapView>
          <View style={styles.overlay}>
            <View
              style={{
                backgroundColor: COLORS.primary,
                padding: 10,
                borderRadius: 8,
                flexDirection: "row",
              }}
            >
              <Text style={{ color: "white" }}>
                TRP-{trip.padStart(3, "0")}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data &&
            Object.entries(data).map(([tripId, assignments]) => (
              <View
                key={tripId}
                style={{ marginVertical: 16, marginHorizontal: 10 }}
              >
                <Pressable
                  onPress={() => {
                    // Do something on press, e.g., navigate or show details
                    console.log("Pressed assignments:", assignments);
                    setTrip(tripId);
                    const simplifiedData = assignments.map(
                      ({ latitude, longitude, storename }) => ({
                        latitude,
                        longitude,
                        label: storename,
                      })
                    );
                    setDropPoints(simplifiedData);
                    console.log(simplifiedData);
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? COLORS.grey
                        : COLORS.surfaceLight,
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                      // marginRight: 8,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 8,
                    }}
                  >
                    Trip ID: {tripId}
                  </Text>

                  {assignments.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        // Do something on press, e.g., navigate or show details
                        console.log("Pressed store:", item.storename);
                      }}
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed ? "#d9e3f0" : "#f0f4f7",
                          borderRadius: 12,
                          padding: 12,
                          marginBottom: 10,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 2,
                          marginRight: 8,
                        },
                      ]}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                        📍 {item.storename}
                      </Text>
                      <Text style={{ color: "gray", fontSize: 12 }}>
                        {item.address}
                      </Text>
                      <Text style={{ fontSize: 12, marginTop: 4 }}>
                        Status:{" "}
                        <Text
                          style={{
                            color:
                              item.status === "Pending" ? "orange" : "green",
                          }}
                        >
                          {item.status}
                        </Text>
                      </Text>
                    </Pressable>
                  ))}
                </Pressable>
              </View>
            ))}
        </ScrollView>
      </ScrollView>
    </Screen>
  );
};

export default MapLocation;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 20, // Adjust for placement
    left: 20,
    backgroundColor: "transparent",
    zIndex: 10,
  },
});
