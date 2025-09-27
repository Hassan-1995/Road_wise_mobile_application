import AppButton from "@/components/AppButton";
import Map from "@/components/Map";
import Screen from "@/components/Screen";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { useTripStore } from "@/stores/useTripStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const LiveLocation = () => {
  const { trip, dropPoints, routeCoords, dist, time } = useTripStore();
  const { location, region } = useCurrentLocation();

  const [currentTime, setCurrentTime] = useState("");


  
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const time = now.toLocaleTimeString(); // e.g. 10:34:21 AM
      setCurrentTime(time);
    };

    update(); // initialize immediately
    const interval = setInterval(update, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  if (!dropPoints || !routeCoords || !trip || trip === "000") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Missing trip data. Go back and select a trip.</Text>
      </View>
    );
  }

  // console.log(
  //   "Testing Data:",
  //   location?.coords.latitude,
  //   location?.coords.longitude
  // );

  return (
    <Screen>
      <View style={{ width: "100%", height: "95%" }}>
        {/* Map container with overlay inside */}
        <View style={{ flex: 1 }}>
          {/* <Map dropPoints={dropPoints} routeCoords={routeCoords} trip={trip} /> */}
          <Map dropPoints={dropPoints} routeCoords={routeCoords} trip={trip} />

          {/* Overlay on top of the Map */}
          <View
            style={{
              position: "absolute",
              bottom: 10,
              paddingHorizontal: 5,
              // left: 10,
              width: "100%",
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {currentTime}
              </Text>
            </View>
            {/* <View
              style={{
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
            </View> */}
            <View>
              <AppButton
                title="Finish & Update"
                onPress={() => router.push("/location/tripUpdate")}
              />
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default LiveLocation;

const styles = StyleSheet.create({});
