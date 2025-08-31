// // import axios from "axios";
// import { getDriverID } from "@/api/getDriverID";
// import { insertActualPoints } from "@/api/insertActualPointPath";
// import { useAuthStore } from "@/stores/authStore";
// import { useTripStore } from "@/stores/useTripStore";
// import * as Location from "expo-location";
// import * as TaskManager from "expo-task-manager";

// const LOCATION_TASK_NAME = "background-location-task";

// // Define background location update structure
// type BackgroundLocationData = {
//   locations: Location.LocationObject[];
// };

// // Define the task for background location updates
// TaskManager.defineTask(
//   LOCATION_TASK_NAME,
//   async ({
//     data,
//     error,
//   }: {
//     data?: BackgroundLocationData;
//     error?: TaskManager.TaskManagerError | null;
//   }) => {
//     const user = useAuthStore((s) => s.user);
//     if (error) {
//       console.error("Background location task error:", error);
//       return;
//     }
//     if (data) {
//       const location = data.locations[0];
//       if (!location) return;

//       const { trip } = useTripStore.getState();
//       const driverId = (await getDriverID(user?.id || 0)) as {
//         id: number;
//       };

//       console.log(
//         "Background location:",
//         location.coords.latitude,
//         location.coords.longitude
//       );

//       try {
//         const newData = {
//           tripId: Number(trip),

//           driverId: Number(driverId.id), // static
//           // driverId: 1, // static
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           recordedAt: new Date().toISOString(),
//         };
//         const insertedData = await insertActualPoints(newData);
//         console.log("Status updated successfully:", insertedData);
//       } catch (error) {
//         console.error("Failed to insert points:", error);
//         // alert("Failed to insert points. Please try again.");
//       }

//       //   try {
//       //     await axios.post("https://your-api.com/location", {
//       //       driverID: "driver123", // replace with actual value
//       //       tripID: "trip456", // replace with actual value
//       //       latitude: location.coords.latitude,
//       //       longitude: location.coords.longitude,
//       //       recordedAt: new Date().toISOString(),
//       //     });
//       //   } catch (err) {
//       //     console.error("Error sending location to backend:", err);
//       //   }
//     }
//   }
// );

// // Function to start background tracking
// export async function startBackgroundLocationTracking(
//   driverID: string,
//   tripID: string
// ) {
//   const { status: fgStatus } =
//     await Location.requestForegroundPermissionsAsync();
//   if (fgStatus !== "granted") {
//     console.log("Foreground location permission denied");
//     return;
//   }

//   const { status: bgStatus } =
//     await Location.requestBackgroundPermissionsAsync();
//   if (bgStatus !== "granted") {
//     console.log("Background location permission denied");
//     return;
//   }

//   await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//     accuracy: Location.Accuracy.Highest,
//     distanceInterval: 1, // meters before update triggers
//     deferredUpdatesInterval: 60000, // every 60 sec
//     showsBackgroundLocationIndicator: true,
//     foregroundService: {
//       notificationTitle: "Tracking location",
//       notificationBody: "We are recording your trip location.",
//     },
//   });

//   console.log(
//     "Background location tracking started for driver:",
//     driverID,
//     "trip:",
//     tripID
//   );
// }

// // Function to stop background tracking
// export async function stopBackgroundLocationTracking() {
//   await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
//   console.log("Background location tracking stopped");
// }

import { getDriverID } from "@/api/getDriverID";
import { insertActualPoints } from "@/api/insertActualPointPath";
import { useAuthStore } from "@/stores/authStore";
import { useTripStore } from "@/stores/useTripStore";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";

// We'll keep driverId cached here once fetched
let cachedDriverId: number | null = null;

type BackgroundLocationData = {
  locations: Location.LocationObject[];
};

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

      try {
        // Ensure we have driverId cached
        if (!cachedDriverId) {
          const user = useAuthStore.getState().user;
          if (user?.id) {
            const driver = (await getDriverID(user.id)) as { id: number };
            cachedDriverId = Number(driver.id);
          } else {
            console.warn("No user found in auth store");
            return;
          }
        }

        const newData = {
          tripId: Number(trip),
          driverId: cachedDriverId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          recordedAt: new Date().toISOString(),
        };

        const insertedData = await insertActualPoints(newData);
        console.log("Status updated successfully:", insertedData);
      } catch (err) {
        console.error("Failed to insert points:", err);
      }
    }
  }
);

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

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK_NAME
  );
  if (hasStarted) {
    console.log("Background tracking already running");
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 10,
    deferredUpdatesInterval: 30000,
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

export async function stopBackgroundLocationTracking() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  cachedDriverId = null; // reset cache
  console.log("Background location tracking stopped");
}
