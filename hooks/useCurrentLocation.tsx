import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Region } from "react-native-maps";

const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [region, setRegion] = useState<Region | null>(null);

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

      return () => subscription.remove();
    })();
  }, []);

  return { location, region };
};
export default useCurrentLocation;
