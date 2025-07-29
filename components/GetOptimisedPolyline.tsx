// utils/getOptimizedPolyline.ts

interface Point {
  label: string;
  latitude: string;
  longitude: string;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

const ORS_API_KEY = "5b3ce3597851110001cf62489b22075f804e47e2a1d832098c272920"; // Replace with your actual API Key

export const GetOptimisedPolyline = async (
  startingPoint: Point,
  dropOffPoints: Point[]
): Promise<LatLng[]> => {
  try {
    // Convert string lat/lng to numbers
    const startCoord = [
      parseFloat(startingPoint.longitude),
      parseFloat(startingPoint.latitude),
    ];

    const jobs = dropOffPoints.map((point, index) => ({
      id: index + 1,
      location: [parseFloat(point.longitude), parseFloat(point.latitude)],
    }));

    const vehicle = {
      id: 1,
      start: startCoord,
      capacity: [100],
      profile: "driving-car",
    };

    const body = {
      jobs: jobs,
      vehicles: [vehicle],
    };

    const response = await fetch(
      "https://api.openrouteservice.org/optimization",
      {
        method: "POST",
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();

    const steps = result.routes[0].steps;

    // Collect coordinates in optimized order
    const orderedCoords: LatLng[] = steps.map((step: any) => {
      const job = step.location;
      return {
        latitude: job[1],
        longitude: job[0],
      };
    });

    return orderedCoords;
  } catch (error: any) {
    console.error("Error fetching optimized polyline:", error.message);
    return [];
  }
};
