import { getDropoutAssignmentsByDriver } from "@/api/dropoutAssignmentByDriver";
import { getDriverID } from "@/api/getDriverID";
import { createOptimisedPathEntry } from "@/api/optimisedPath";
import { getTripDetail, Trip } from "@/api/tripByID";
import { setTripTime } from "@/api/tripTime";
import AppButton from "@/components/AppButton";
import { GetOptimisedPolyline } from "@/components/GetOptimisedPolyline";
import { startBackgroundLocationTracking } from "@/components/LocationTask";
import Map from "@/components/Map";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { useAuthStore } from "@/stores/authStore";
import { useTripStore } from "@/stores/useTripStore";
import polyline from "@mapbox/polyline";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
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
  const user = useAuthStore((s) => s.user);
  const { location, region } = useCurrentLocation();

  const [data, setData] = useState<Record<number, DropoutAssignment[]> | null>(
    null
  );
  const [trip, setTrip] = useState<string>("000");
  const [dropPoints, setDropPoints] = useState<DropPoints | null>(null);
  const [poly, setPoly] = useState<PolyPoints | null>(null);

  const [dist, setDist] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  const [routeCoords, setRouteCoords] = useState([]);
  const [polyString, setPolyString] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // const driverId = 1; //static driver_id

  // gets trips + store from back-end
  useFocusEffect(
    useCallback(() => {
      const fetchDropoutAssignment = async () => {
        try {
          const driverId = (await getDriverID(user?.id || 0)) as { id: number };
          setLoading(true);
          const fetchedData = await getDropoutAssignmentsByDriver(driverId.id);
          const filtered = filterByDate(
            fetchedData as DropoutAssignment[],
            new Date().toISOString().split("T")[0]
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
    }, [user?.id])
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
        setPoly(polylineCoords as PolyPoints);
      } catch (error) {
        console.error("Error getting polyline:", error);
      }
    };

    fetchOptimisedOrder();
  }, [dropPoints, location]);
  // gets polyline to display on the map
  useEffect(() => {
    const fetchRoute = async () => {
      if (!poly) {
        return;
      }
      try {
        const coordinates = poly?.map((pt) => [pt.longitude, pt.latitude]);

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

        const { distance, duration } = data.features[0].properties.summary;

        setDist(Math.round(distance / 1000));
        setTime(Math.round(duration / 60));

        const coords = data.features[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lng,
          })
        );

        setRouteCoords(coords);
        const encoded: string = polyline.encode(
          coords.map((p: { latitude: number; longitude: number }) => [
            p.latitude,
            p.longitude,
          ])
        );

        setPolyString(encoded);

        console.log("Route: ", encoded);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };
    fetchRoute();
  }, [dropPoints, poly]);

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
          {/* Map container */}
          <Map dropPoints={dropPoints} routeCoords={routeCoords} trip={trip} />

          {/* Overlay View */}
          {polyline && (
            <View
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                backgroundColor: "rgba(255, 255, 255, 0.95)", // slightly more opaque
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                minWidth: 140,
                alignItems: "flex-start",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 6, // Android shadow
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 14, color: "#333" }}>
                Approx. Distance: {dist} km
              </Text>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 13,
                  color: "#666",
                  marginTop: 2,
                }}
              >
                ETA: {time} minutes
              </Text>
            </View>
          )}
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
                            storeLocation: [item.latitude, item.longitude],
                            // location: [item.latitude, item.longitude],
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
            onPress={async () => {
              const { setTripData } = useTripStore.getState();

              if (!dropPoints || !routeCoords) return;

              setTripData(trip, dropPoints, routeCoords, dist || 0, time || 0);

              const driverId = (await getDriverID(user?.id || 0)) as {
                id: number;
              };
              // startBackgroundLocationTracking(String(driverId.id), trip);

              const hasStarted = await Location.hasStartedLocationUpdatesAsync(
                "background-location-task"
              );
              if (!hasStarted) {
                await startBackgroundLocationTracking(
                  String(driverId.id),
                  trip
                );
              } else {
                console.log(
                  "Background tracking already running — not restarting."
                );
              }
              try {
                await createOptimisedPathEntry({
                  tripId: Number(trip),
                  optimisedPath: polyString!,
                  distanceKm: String(dist || 0),
                  durationMinutes: String(time || 0),
                  startTime: new Date().toISOString(),
                  status: "Ongoing",
                });
                console.log("Trip entry created successfully");
              } catch (error) {
                console.error("Failed to create trip entry:", error);
              }

              try {
                const response = (await getTripDetail({
                  tripID: Number(trip),
                })) as Trip;
                if (response.startTime === null) {
                  await setTripTime({
                    tripId: Number(trip),
                    startTime: new Date().toISOString(),
                  });
                  alert("Trip time started successfully");
                } else {
                  alert(
                    "Trip time already started successfully at: " +
                      new Date(response.startTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                  );
                }
              } catch (error) {
                console.error("Failed to create trip start time:", error);
                alert("Failed to create trip start time:" + error);
              }

              // Optional: delay navigation to allow React to re-render
              setTimeout(() => {
                router.push("/location/liveLocation");
              }, 100);
            }}
          />
        </View>
      </ScrollView>
      <AppButton title="hello" onPress={() => router.push("/location/temp")} />
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
