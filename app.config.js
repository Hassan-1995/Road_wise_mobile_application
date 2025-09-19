// export default {
//   expo: {
//     name: "road_wise_02",
//     slug: "road_wise_02",
//     version: "1.0.0",
//     orientation: "portrait",
//     icon: "./assets/images/icon.png",
//     scheme: "roadwise02",
//     userInterfaceStyle: "automatic",
//     newArchEnabled: true,
//     ios: {
//       supportsTablet: true,
//     },
//     android: {
//       adaptiveIcon: {
//         foregroundImage: "./assets/images/adaptive-icon.png",
//         backgroundColor: "#ffffff",
//       },
//       edgeToEdgeEnabled: true,
//       package: "com.hassan1995.road_wise_02",
//     },
//     web: {
//       bundler: "metro",
//       output: "static",
//       favicon: "./assets/images/favicon.png",
//     },
//     plugins: [
//       "expo-router",
//       [
//         "expo-splash-screen",
//         {
//           image: "./assets/images/roadWise.png",
//           imageWidth: 200,
//           resizeMode: "contain",
//           backgroundColor: "#ffffff",
//         },
//       ],
//       [
//         "@rnmapbox/maps",
//         {
//           RNMapboxMapsVersion: "10.1.44",
//           //   "RNMapboxMapsDownloadToken": "sk.eyJ1IjoibWhhbW1hZGFobWVkIiwiYSI6ImNtZnA5MzByeDA4bjgyaXM3NThvazJiMTQifQ.dmYz84O54jjWltyASU-Nrw"
//           RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN,
//         },
//       ],
//       "expo-build-properties",
//     ],
//     experiments: {
//       typedRoutes: true,
//     },
//     extra: {
//       router: {},
//       eas: {
//         projectId: "215b90db-e743-4eca-a16c-d6458ef0aa45",
//       },
//     },
//   },
// };

// export default ({ config }) => ({
//   ...config,
//   name: "road_wise_02",
//   slug: "road_wise_02",
//   version: "1.0.0",
//   orientation: "portrait",
//   icon: "./assets/images/icon.png",
//   scheme: "roadwise02",
//   userInterfaceStyle: "automatic",
//   newArchEnabled: true,

//   ios: {
//     supportsTablet: true,
//   },

//   android: {
//     adaptiveIcon: {
//       foregroundImage: "./assets/images/adaptive-icon.png",
//       backgroundColor: "#ffffff",
//     },
//     edgeToEdgeEnabled: true,
//     package: "com.hassan1995.road_wise_02",
//   },

//   web: {
//     bundler: "metro",
//     output: "static",
//     favicon: "./assets/images/favicon.png",
//   },

//   plugins: [
//     "expo-router",
//     [
//       "expo-splash-screen",
//       {
//         image: "./assets/images/roadWise.png",
//         imageWidth: 200,
//         resizeMode: "contain",
//         backgroundColor: "#ffffff",
//       },
//     ],
//     [
//       "@rnmapbox/maps",
//       {
//         RNMapboxMapsVersion: "10.1.44",
//         RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN,
//       },
//     ],
//     "expo-build-properties",
//   ],

//   experiments: {
//     typedRoutes: true,
//   },

//   extra: {
//     router: {},
//     eas: {
//       projectId: "215b90db-e743-4eca-a16c-d6458ef0aa45",
//     },
//   },
// });

//

// export default ({ config }) => ({
//   ...config,
//   name: "road_wise_02",
//   slug: "road_wise_02",
//   version: "1.0.0",
//   orientation: "portrait",
//   icon: "./assets/images/icon.png",
//   scheme: "roadwise02",
//   userInterfaceStyle: "automatic",
//   newArchEnabled: true,

//   ios: {
//     supportsTablet: true,
//   },

//   android: {
//     adaptiveIcon: {
//       foregroundImage: "./assets/images/adaptive-icon.png",
//       backgroundColor: "#ffffff",
//     },
//     edgeToEdgeEnabled: true,
//     package: "com.hassan1995.road_wise_02",
//   },

//   web: {
//     bundler: "metro",
//     output: "static",
//     favicon: "./assets/images/favicon.png",
//   },

//   plugins: [
//     "expo-router",
//     [
//       "expo-splash-screen",
//       {
//         image: "./assets/images/roadWise.png",
//         imageWidth: 200,
//         resizeMode: "contain",
//         backgroundColor: "#ffffff",
//       },
//     ],
//     [
//       "@rnmapbox/maps",
//       {
//         RNMapboxMapsVersion: "10.1.44",
//         RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN, // <-- notice the variable name
//       },
//     ],
//     [
//       "expo-build-properties",
//       {
//         android: {
//           extraMavenRepos: [
//             {
//               url: "https://api.mapbox.com/downloads/v2/releases/maven",
//               //   authentication: "basic",
//               //   username: "mapbox",
//               //   password: process.env.MAPBOX_DOWNLOADS_TOKEN,
//             },
//           ],
//         },
//       },
//     ],
//   ],

//   experiments: {
//     typedRoutes: true,
//   },

//   extra: {
//     router: {},
//     eas: {
//       projectId: "215b90db-e743-4eca-a16c-d6458ef0aa45",
//     },
//   },
// });

//

export default ({ config }) => ({
  ...config,
  name: "road_wise_02",
  slug: "road_wise_02",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "roadwise02",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.hassan1995.road_wise_02",
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/roadWise.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "@rnmapbox/maps",
      {
        // RNMapboxMapsVersion: "10.1.39",
        RNMapboxMapsVersion: "11.13.4",
        RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN,
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: [
            // "https://api.mapbox.com/downloads/v2/releases/maven",
            {
              url: "https://api.mapbox.com/downloads/v2/releases/maven",
            },
          ],
        },
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
  },

  extra: {
    router: {},
    eas: {
      projectId: "215b90db-e743-4eca-a16c-d6458ef0aa45",
    },
  },
});
