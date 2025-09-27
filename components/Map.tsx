import { COLORS } from "@/constants/theme";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { default as Mapbox, default as MapboxGL } from "@rnmapbox/maps";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type DropPoints = {
  latitude: string;
  longitude: string;
  label: string;
}[];

type MapProps = {
  dropPoints: DropPoints | null;
  routeCoords: { latitude: number; longitude: number }[];
  trip: string;
};
type Bounds = {
  ne: [number, number]; // [lng, lat]
  sw: [number, number];
};

// MapboxGL.setAccessToken("YOUR_MAPBOX_ACCESS_TOKEN");
MapboxGL.setAccessToken(
  "pk.eyJ1IjoibWhhbW1hZGFobWVkIiwiYSI6ImNtZnAyMTdkNjA1OWYybHNjbnp1YWgzMnAifQ.kN2hvJpdtQyfuczOU5X-BQ"
);

const Map = ({ dropPoints, routeCoords, trip }: MapProps) => {
  const { location, region } = useCurrentLocation();

  const [bounds, setBounds] = useState<Bounds | null>(null);

  useEffect(() => {
    if ((!dropPoints || dropPoints.length === 0) && location) {
      setBounds(null);
      return;
    }

    // Start with user's location as bounds
    let minLat =
      location?.coords.latitude ?? Number(dropPoints?.[0].latitude ?? 0);
    let maxLat = minLat;
    let minLng =
      location?.coords.longitude ?? Number(dropPoints?.[0].longitude ?? 0);
    let maxLng = minLng;

    // Expand bounds with dropPoints
    dropPoints?.forEach((p) => {
      const lat = Number(p.latitude);
      const lng = Number(p.longitude);

      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    setBounds({
      ne: [maxLng, maxLat],
      sw: [minLng, minLat],
    });
  }, [dropPoints, location]);

  console.log("Region:", bounds);

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
      <Mapbox.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street} // You can switch to Satellite etc.
      >
        {/* Camera (controls what part of the map to show) */}

        <Mapbox.Camera
          centerCoordinate={[region.longitude, region.latitude]}
          zoomLevel={10}
        />

        {bounds ? (
          <Mapbox.Camera
            bounds={{
              ne: bounds.ne,
              sw: bounds.sw,
              paddingTop: 50,
              paddingBottom: 50,
              paddingLeft: 50,
              paddingRight: 50,
            }}
            // zoomLevel={5}
            animationDuration={1000}
          />
        ) : (
          <Mapbox.Camera
            centerCoordinate={[region.longitude, region.latitude]}
            zoomLevel={10}
          />
        )}

        {/* User Location */}
        <Mapbox.UserLocation visible={true} showsUserHeadingIndicator={true} />

        {/* Drop Points Markers */}
        {dropPoints?.map((point) => (
          <Mapbox.PointAnnotation
            key={point.label}
            id={point.label}
            coordinate={[Number(point.longitude), Number(point.latitude)]}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: COLORS.red,
                borderWidth: 2,
                borderColor: "white",
              }}
            />
            <Mapbox.Callout title={point.label} />
          </Mapbox.PointAnnotation>
        ))}

        {/* Route Polyline */}
        {routeCoords.length > 0 && (
          <Mapbox.ShapeSource
            id="routeSource"
            shape={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: routeCoords.map((c) => [c.longitude, c.latitude]),
              },
              properties: {},
            }}
          >
            <Mapbox.LineLayer
              id="routeLine"
              style={{
                lineColor: COLORS.secondary,
                lineWidth: 4,
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>

      {/* Overlay trip info */}
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
