import { COLORS } from "@/constants/theme";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

type DropPoints = {
  latitude: string;
  longitude: string;
  label: string;
}[];

type MapProps = {
  dropPoints: DropPoints | null;
  routeCoords: never[];
  trip: string;
};

const Map = ({ dropPoints, routeCoords, trip }: MapProps) => {
  const { location, region } = useCurrentLocation();

  if (!location || !region) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size={50}
          color={COLORS.primary}
          style={styles.loader}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          ...region,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25,
        }}
        showsUserLocation={true}
      >
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

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={COLORS.secondary}
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.tripContainer}>
          <Text style={styles.tripText}>TRP-{trip.padStart(3, "0")}</Text>
        </View>
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create<{
  container: ViewStyle;
  map: ViewStyle;
  loaderContainer: ViewStyle;
  loader: ViewStyle;
  overlay: ViewStyle;
  tripContainer: ViewStyle;
  tripText: TextStyle;
}>({
  container: {
    flex: 1,
    shadowColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    marginTop: 60,
  },
  overlay: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  tripContainer: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
  },
  tripText: {
    color: "white",
  },
});
