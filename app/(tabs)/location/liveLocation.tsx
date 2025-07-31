import Map from "@/components/Map";
import Screen from "@/components/Screen";
import { useTripStore } from "@/stores/useTripStore";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const LiveLocation = () => {
  const { trip, dropPoints, routeCoords } = useTripStore();

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

  return (
    <Screen>
      <View style={{ width: "100%", height: "95%" }}>
        {/* Map container with overlay inside */}
        <View style={{ flex: 1 }}>
          <Map dropPoints={dropPoints} routeCoords={routeCoords} trip={trip} />

          {/* Overlay on top of the Map */}
          <View
            style={{
              position: "absolute",
              bottom: 30,
              left: 10,
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              {currentTime}
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default LiveLocation;

const styles = StyleSheet.create({});
