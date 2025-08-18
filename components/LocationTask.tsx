// import axios from "axios";
import { insertActualPoints } from "@/api/insertActualPointPath";
import { useTripStore } from "@/stores/useTripStore";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";

// Define background location update structure
type BackgroundLocationData = {
  locations: Location.LocationObject[];
};

// Define the task for background location updates
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({
    data,
    error,
  }: {
    data?: BackgroundLocationData;
    error?: TaskManager.TaskManagerError | null;
  }) => {
    if (error) {
      console.error("Background location task error:", error);
      return;
    }
    if (data) {
      const location = data.locations[0];
      if (!location) return;

      const { trip } = useTripStore.getState();

      console.log(
        "Background location:",
        location.coords.latitude,
        location.coords.longitude
      );

      try {
        const newData = {
          tripId: Number(trip),
          driverId: 1, // static
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          recordedAt: new Date().toISOString(),
        };
        const insertedData = await insertActualPoints(newData);
        console.log("Status updated successfully:", insertedData);
      } catch (error) {
        console.error("Failed to insert points:", error);
        alert("Failed to insert points. Please try again.");
      }

      //   try {
      //     await axios.post("https://your-api.com/location", {
      //       driverID: "driver123", // replace with actual value
      //       tripID: "trip456", // replace with actual value
      //       latitude: location.coords.latitude,
      //       longitude: location.coords.longitude,
      //       recordedAt: new Date().toISOString(),
      //     });
      //   } catch (err) {
      //     console.error("Error sending location to backend:", err);
      //   }
    }
  }
);

// Function to start background tracking
export async function startBackgroundLocationTracking(
  driverID: string,
  tripID: string
) {
  const { status: fgStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== "granted") {
    console.log("Foreground location permission denied");
    return;
  }

  const { status: bgStatus } =
    await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== "granted") {
    console.log("Background location permission denied");
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 1, // meters before update triggers
    deferredUpdatesInterval: 60000, // every 60 sec
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Tracking location",
      notificationBody: "We are recording your trip location.",
    },
  });

  console.log(
    "Background location tracking started for driver:",
    driverID,
    "trip:",
    tripID
  );
}

// Function to stop background tracking
export async function stopBackgroundLocationTracking() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  console.log("Background location tracking stopped");
}
