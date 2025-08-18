// import { Stack } from "expo-router";
// import { SafeAreaView } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={{ flex: 1 }}>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         />
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

import { useAuthStore } from "@/stores/authStore";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  // (optional) tiny guard so we don't flash the wrong stack while reading storage
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    // if already hydrated (hot reload), mark ready
    if (useAuthStore.persist.hasHydrated?.()) setHydrated(true);
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
