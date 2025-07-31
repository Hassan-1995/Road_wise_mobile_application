// stores/useTripStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type DropPoint = { latitude: string; longitude: string; label: string };
type Coords = { latitude: number; longitude: number };

type TripStore = {
  trip: string;
  dropPoints: DropPoint[] | null;
  //   routeCoords: Coords[] | null;
  routeCoords: never[];

  setTripData: (
    trip: string,
    dropPoints: DropPoint[],
    routeCoords: never[]
  ) => void;
  resetTrip: () => void;
};

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      trip: "000",
      dropPoints: null,
      routeCoords: null,

      setTripData: (trip, dropPoints, routeCoords) =>
        set({ trip, dropPoints, routeCoords }),

      resetTrip: () =>
        set({ trip: "000", dropPoints: null, routeCoords: null }),
    }),
    {
      name: "trip-storage", // key in AsyncStorage
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ?? null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, value);
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
