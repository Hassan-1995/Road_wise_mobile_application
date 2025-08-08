// app/(tabs)/home/_layout.tsx
import { IconSymbol } from "@/components/IconSymbol";
import { COLORS } from "@/constants/theme";
import { Stack } from "expo-router";
import { View } from "react-native";

const STACKS = [
  {
    name: "index",
    header: "Drop Points",
    headerIcon: "location.fill",
    showHeader: true,
  },
  {
    name: "liveLocation",
    header: "Live Location",
    headerIcon: "point.topleft.down.curvedto.point.bottomright.up",
    showHeader: true,
  },
  {
    name: "updateStore",
    header: "Update",
    headerIcon: "square.and.pencil",
    showHeader: true,
  },
  {
    name: "tripUpdate",
    header: "Update",
    headerIcon: "square.and.pencil",
    showHeader: true,
  },
];

export default function HomeStackLayout() {
  return (
    <Stack>
      {STACKS.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          options={{
            headerShown: screen.showHeader,
            headerTitle: screen.header,
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: COLORS.white,
            headerRight: () => (
              <View>
                <IconSymbol
                  name={screen.headerIcon}
                  size={24}
                  color={COLORS.white}
                />
              </View>
            ),
          }}
        />
      ))}
    </Stack>
  );
}
