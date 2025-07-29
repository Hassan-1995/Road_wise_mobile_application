import { getDropoutAssignmentsByDriver } from "@/api/dropoutAssignmentByDriver";
import { GetOptimisedPolyline } from "@/components/GetOptimisedPolyline";
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
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [region, setRegion] = useState<Region | null>(null);
  const [data, setData] = useState<Record<number, DropoutAssignment[]> | null>(
    null
  );
  const [trip, setTrip] = useState<string>("000");
  const [dropPoints, setDropPoints] = useState<DropPoints | null>(null);
  const [polyline, setPolyline] = useState<PolyPoints | null>(null);

  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);

  const driverId = 11; //static driver_id
  // gets trips + store from back-end
  useEffect(() => {
    const fetchDropoutAssignment = async () => {
      try {
        const fetchedData = await getDropoutAssignmentsByDriver(driverId);
        const filtered = filterByDate(
          fetchedData as DropoutAssignment[],
          "2025-07-28"
          // new Date().toISOString().slice(0, 10)
        );
        const groupedData = groupByTripId(filtered as DropoutAssignment[]);
        setData(groupedData);
        // console.log("Trips: ", data);
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
      try {
        // Convert points to [lng, lat] as required by ORS
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
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [polyline, dropPoints]);
  // gets persmission from user's location
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

  // console.log("location:", location);
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

            {/* {dropPoints && (
              <Polyline
                coordinates={dropPoints.map((point) => ({
                  latitude: Number(point.latitude),
                  longitude: Number(point.longitude),
                }))}
                strokeColor="#FF0000"
                strokeWidth={4}
              />
            )} */}
            {routeCoords.length > 0 && (
              <Polyline
                coordinates={routeCoords}
                strokeColor={COLORS.secondary}
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
                    // console.log("Pressed assignments:", assignments);
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

// App.js or any screen component

// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, StyleSheet, View } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";

// const ORS_API_KEY = "5b3ce3597851110001cf62489b22075f804e47e2a1d832098c272920"; // Replace with your actual ORS key

// export default function App() {
//   const [routeCoords, setRouteCoords] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Example coordinates (Karachi)
//   const origin = [67.034, 24.9389]; // lng, lat
//   const destination = [67.1152, 24.8296]; // lng, lat

//   useEffect(() => {
//     fetchRoute();
//   }, []);

//   const fetchRoute = async () => {
//     try {
//       const response = await fetch(
//         "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
//         {
//           method: "POST",
//           headers: {
//             Authorization: ORS_API_KEY,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             coordinates: [origin, destination],
//           }),
//         }
//       );

//       const data = await response.json();

//       const coords = data.features[0].geometry.coordinates.map(
//         ([lng, lat]) => ({
//           latitude: lat,
//           longitude: lng,
//         })
//       );

//       setRouteCoords(coords);
//     } catch (error) {
//       console.error("Error fetching route:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={StyleSheet.absoluteFillObject}
//         initialRegion={{
//           latitude: (origin[1] + destination[1]) / 2,
//           longitude: (origin[0] + destination[0]) / 2,
//           latitudeDelta: 0.1,
//           longitudeDelta: 0.1,
//         }}
//       >
//         <Marker
//           coordinate={{ latitude: origin[1], longitude: origin[0] }}
//           title="Origin"
//         />
//         <Marker
//           coordinate={{ latitude: destination[1], longitude: destination[0] }}
//           title="Destination"
//         />

//         {routeCoords.length > 0 && (
//           <Polyline
//             coordinates={routeCoords}
//             strokeColor="#FF0000"
//             strokeWidth={4}
//           />
//         )}
//       </MapView>

//       {loading && (
//         <View style={styles.loading}>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loading: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     marginLeft: -25,
//     marginTop: -25,
//   },
// });

// multiple points

// import * as Location from "expo-location";
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, StyleSheet, View } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";

// type LocationType = {
//   latitude: number;
//   longitude: number;
// };

// type DropPoint = {
//   place: string;
//   location: {
//     lat: number;
//     lng: number;
//   };
// };

// const dropoutLocations: DropPoint[] = [
//   { place: "VSP Store", location: { lat: 24.86267, lng: 67.079995 } },
//   {
//     place: "North Karachi Warehouse",
//     location: { lat: 24.98022, lng: 67.06467 },
//   },
//   { place: "DHA Drop Point", location: { lat: 24.81383, lng: 67.04345 } },
// ];

// const OptimisedRoute = () => {
//   const [currentLocation, setCurrentLocation] =
//     useState<Location.LocationObject | null>(null);
//   const [routeCoords, setRouteCoords] = useState<LocationType[]>([]);
//   const [optimizedOrder, setOptimizedOrder] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getLocation();
//   }, []);

//   useEffect(() => {
//     if (currentLocation) {
//       fetchOptimizedRoute();
//     }
//   }, [currentLocation]);

//   const getLocation = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       setCurrentLocation(null);
//       setLoading(false);
//       return;
//     }
//     const location = await Location.getCurrentPositionAsync({});
//     setCurrentLocation(location);
//   };

//   const fetchOptimizedRoute = async () => {
//     try {
//       const allPoints = [
//         {
//           lat: currentLocation!.coords.latitude,
//           lng: currentLocation!.coords.longitude,
//         },
//         ...dropoutLocations.map((d) => d.location),
//       ];

//       const coordString = allPoints.map((p) => `${p.lng},${p.lat}`).join(";");

//       const url = `https://router.project-osrm.org/trip/v1/driving/${coordString}?source=first&roundtrip=false&overview=full&geometries=geojson`;

//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.code === "Ok") {
//         const coords = data.trips[0].geometry.coordinates.map(
//           ([lng, lat]: [number, number]) => ({
//             latitude: lat,
//             longitude: lng,
//           })
//         );
//         setRouteCoords(coords);
//         setOptimizedOrder(data.waypoints.map((wp) => wp.waypoint_index));
//       } else {
//         console.error("OSRM Trip Error:", data);
//       }
//     } catch (error) {
//       console.error("Error fetching optimized route:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading || !currentLocation) {
//     return (
//       <View style={styles.loadingScreen}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: currentLocation.coords.latitude,
//           longitude: currentLocation.coords.longitude,
//           latitudeDelta: 0.5,
//           longitudeDelta: 0.5,
//         }}
//       >
//         <Marker
//           coordinate={{
//             latitude: currentLocation.coords.latitude,
//             longitude: currentLocation.coords.longitude,
//           }}
//           pinColor="green"
//           title="Start (You)"
//         />

//         {optimizedOrder.slice(1).map((index, i) => {
//           const loc = dropoutLocations[index - 1];
//           return (
//             <Marker
//               key={i}
//               coordinate={{
//                 latitude: loc.location.lat,
//                 longitude: loc.location.lng,
//               }}
//               pinColor="blue"
//               title={`Stop ${i + 1}: ${loc.place}`}
//             />
//           );
//         })}

//         {routeCoords.length > 0 && (
//           <Polyline
//             coordinates={routeCoords}
//             strokeColor="#1565C0"
//             strokeWidth={4}
//           />
//         )}
//       </MapView>
//     </>
//   );
// };

// export default OptimisedRoute;

// const styles = StyleSheet.create({
//   map: {
//     width: "100%",
//     height: "100%",
//   },
//   loadingScreen: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
