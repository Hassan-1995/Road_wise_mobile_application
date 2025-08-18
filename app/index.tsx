// import { Redirect } from "expo-router";

// export default function Index() {
//   return <Redirect href="/(tabs)" />;
// }

// import useAuth from "@/hooks/useAuth";
// import { Redirect } from "expo-router";
// import { ActivityIndicator, View } from "react-native";

// export default function Index() {
//   const { loading, userToken } = useAuth();

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!userToken) {
//     return <Redirect href="/auth/login" />;
//   }

//   return <Redirect href="/(tabs)" />;
// }

import { useAuthStore } from "@/stores/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return <Redirect href={isLoggedIn ? "/(tabs)" : "/login"} />;
}
