import { getDropoutAssignmentsByDriver } from "@/api/dropoutAssignmentByDriver";
import AppButton from "@/components/AppButton";
import { GetOptimisedPolyline } from "@/components/GetOptimisedPolyline";
import Map from "@/components/Map";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { useTripStore } from "@/stores/useTripStore";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ORS_API_KEY = "5b3ce3597851110001cf62489b22075f804e47e2a1d832098c272920"; // Replace with your actual ORS key

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
type PolyPoints = {
  latitude: number;
  longitude: number;
}[];

const MapLocation = () => {
  const { location, region } = useCurrentLocation();

  const [data, setData] = useState<Record<number, DropoutAssignment[]> | null>(
    null
  );
  const [trip, setTrip] = useState<string>("000");
  const [dropPoints, setDropPoints] = useState<DropPoints | null>(null);
  const [polyline, setPolyline] = useState<PolyPoints | null>(null);

  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const driverId = 1; //static driver_id
  // gets trips + store from back-end
  useFocusEffect(
    useCallback(() => {
      const fetchDropoutAssignment = async () => {
        try {
          setLoading(true);
          const fetchedData = await getDropoutAssignmentsByDriver(driverId);
          const filtered = filterByDate(
            fetchedData as DropoutAssignment[],
            "2025-08-07"
          );
          const groupedData = groupByTripId(filtered as DropoutAssignment[]);
          setData(groupedData);
        } catch (error) {
          console.error("API error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDropoutAssignment();
    }, [])
  );
  // gets store + drop-offs in optimised order
  useEffect(() => {
    const fetchOptimisedOrder = async () => {
      if (!location || !dropPoints) return;

      const start = {
        label: "Live Location",
        latitude: String(location.coords.latitude),
        longitude: String(location.coords.longitude),
      };

      const dropoffs = dropPoints;

      try {
        const polylineCoords = await GetOptimisedPolyline(start, dropoffs);
        console.log("POLY-LINE: ", polylineCoords);
        setPolyline(polylineCoords as PolyPoints);
      } catch (error) {
        console.error("Error getting polyline:", error);
      }
    };

    fetchOptimisedOrder();
  }, [dropPoints, location]);
  // gets polyline to display on the map
  useEffect(() => {
    const fetchRoute = async () => {
      if (!polyline) {
        return;
      }
      try {
        const coordinates = polyline?.map((pt) => [pt.longitude, pt.latitude]);

        const response = await fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            method: "POST",
            headers: {
              Authorization: ORS_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ coordinates }),
          }
        );

        const data = await response.json();

        const coords = data.features[0].geometry.coordinates.map(
          ([lng, lat]) => ({
            latitude: lat,
            longitude: lng,
          })
        );

        setRouteCoords(coords);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };
    fetchRoute();
  }, [polyline, dropPoints]);

  // utility function
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

  if (!location || !region || loading) {
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
        <View style={{ width: "100%", aspectRatio: 1 }}>
          <Map dropPoints={dropPoints} routeCoords={routeCoords} trip={trip} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data &&
            Object.entries(data).map(([tripId, assignments]) => (
              <View
                key={tripId}
                style={{ marginTop: 16, marginHorizontal: 10 }}
              >
                <Pressable
                  onPress={() => {
                    setTrip(tripId);
                    const simplifiedData = assignments.map(
                      ({ latitude, longitude, storename }) => ({
                        latitude,
                        longitude,
                        label: storename,
                      })
                    );
                    setDropPoints(simplifiedData);
                    // console.log(simplifiedData);
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
                        // router.push("/location/updateStore")
                        router.push({
                          pathname: "/location/updateStore",
                          params: {
                            store: item.storename,
                            address: item.address,
                            status: item.status,
                            location: [item.latitude, item.longitude],
                            tripId: item.tripId,
                            storeId: item.storeId,
                            // key2: "value2",
                          },
                        });
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
                              item.status === "Pending"
                                ? COLORS.amber
                                : item.status === "Completed"
                                ? COLORS.green
                                : item.status === "Cancelled"
                                ? COLORS.red
                                : COLORS.secondary,
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
        <View style={{ marginHorizontal: 20 }}>
          <AppButton
            title={
              trip === "000" ? "Select a Trip" : `TRP-${trip.padStart(3, "0")}`
            }
            onPress={() => {
              const { setTripData } = useTripStore.getState();

              if (!dropPoints || !routeCoords) return;

              setTripData(trip, dropPoints, routeCoords);

              // Optional: delay navigation to allow React to re-render
              setTimeout(() => {
                router.push("/location/liveLocation");
              }, 100);
            }}
          />
        </View>
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
