// import MapboxGL from "@rnmapbox/maps";
// import * as Location from "expo-location";
// import React, { useEffect, useState } from "react";
// import { StyleSheet, View } from "react-native";

// // MapboxGL.setAccessToken("YOUR_MAPBOX_ACCESS_TOKEN");
// MapboxGL.setAccessToken(
//   "pk.eyJ1IjoibWhhbW1hZGFobWVkIiwiYSI6ImNtZnAyMTdkNjA1OWYybHNjbnp1YWgzMnAifQ.kN2hvJpdtQyfuczOU5X-BQ"
// );

// const MapBox = () => {
//   const [location, setLocation] = useState<number[] | null>(null);

//   // Example drop-off points (lat, lng)
//   const dropOffs = [
//     [67.0011, 24.8607], // Karachi
//     [74.3587, 31.5204], // Lahore
//   ];

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission denied");
//         return;
//       }
//       let loc = await Location.getCurrentPositionAsync({});
//       setLocation([loc.coords.longitude, loc.coords.latitude]);
//     })();
//   }, []);

//   if (!location) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

//   return (
//     <View style={styles.container}>
//       <MapboxGL.MapView style={styles.map}>
//         {/* Camera position */}
//         <MapboxGL.Camera zoomLevel={10} centerCoordinate={location} />

//         {/* Marker for current location */}
//         <MapboxGL.PointAnnotation id="current" coordinate={location}>
//           <></>
//         </MapboxGL.PointAnnotation>

//         {/* Drop-off markers */}
//         {dropOffs.map((point, index) => (
//           <MapboxGL.PointAnnotation
//             key={`drop-${index}`}
//             id={`drop-${index}`}
//             coordinate={point}
//           >
//             <></>
//           </MapboxGL.PointAnnotation>
//         ))}

//         {/* Polyline: current location + drop-offs */}
//         <MapboxGL.ShapeSource
//           id="routeSource"
//           shape={{
//             type: "Feature",
//             geometry: {
//               type: "LineString",
//               coordinates: [location, ...dropOffs],
//             },
//             properties: {},
//           }}
//         >
//           <MapboxGL.LineLayer
//             id="routeLine"
//             style={{ lineColor: "blue", lineWidth: 3 }}
//           />
//         </MapboxGL.ShapeSource>
//       </MapboxGL.MapView>
//     </View>
//   );
// };

// export default MapBox;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// import MapboxGL from "@rnmapbox/maps";
// import * as Location from "expo-location";
// import React, { useEffect, useState } from "react";
// import { StyleSheet, View } from "react-native";

// // ✅ Use env variable instead of hardcoding
// MapboxGL.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN ?? null);

// const MapBox = () => {
//   const [location, setLocation] = useState<number[] | null>(null);

//   // Example drop-off points (lng, lat)
//   const dropOffs = [
//     [67.0011, 24.8607], // Karachi
//     [74.3587, 31.5204], // Lahore
//   ];

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission denied");
//         return;
//       }
//       let loc = await Location.getCurrentPositionAsync({});
//       setLocation([loc.coords.longitude, loc.coords.latitude]);
//     })();
//   }, []);

//   if (!location) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

//   return (
//     <View style={styles.container}>
//       <MapboxGL.MapView style={styles.map}>
//         {/* Camera position */}
//         <MapboxGL.Camera zoomLevel={10} centerCoordinate={location} />

//         {/* Marker for current location */}
//         <MapboxGL.PointAnnotation id="current" coordinate={location}>
//           <></>
//         </MapboxGL.PointAnnotation>

//         {/* Drop-off markers */}
//         {dropOffs.map((point, index) => (
//           <MapboxGL.PointAnnotation
//             key={`drop-${index}`}
//             id={`drop-${index}`}
//             coordinate={point}
//           >
//             <></>
//           </MapboxGL.PointAnnotation>
//         ))}

//         {/* Polyline: current location + drop-offs */}
//         <MapboxGL.ShapeSource
//           id="routeSource"
//           shape={{
//             type: "Feature",
//             geometry: {
//               type: "LineString",
//               coordinates: [location, ...dropOffs],
//             },
//             properties: {},
//           }}
//         >
//           <MapboxGL.LineLayer
//             id="routeLine"
//             style={{ lineColor: "blue", lineWidth: 3 }}
//           />
//         </MapboxGL.ShapeSource>
//       </MapboxGL.MapView>
//     </View>
//   );
// };

// export default MapBox;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

import Mapbox from "@rnmapbox/maps";
import React from "react";
import { StyleSheet, View } from "react-native";

Mapbox.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN ?? null);
// Mapbox.setAccessToken(
//   "pk.eyJ1IjoibWhhbW1hZGFobWVkIiwiYSI6ImNtZnAyMTdkNjA1OWYybHNjbnp1YWgzMnAifQ.kN2hvJpdtQyfuczOU5X-BQ"
// );

const App = () => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1,
  },
});
