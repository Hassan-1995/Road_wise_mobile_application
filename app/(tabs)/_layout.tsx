import { IconSymbol } from "@/components/IconSymbol";
import { COLORS } from "@/constants/theme";
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const activeTintColor = colorScheme === "dark" ? "#1E40AF" : "#1E3A8A";
  const inactiveTintColor = colorScheme === "dark" ? "#94A3B8" : "#64748B";

  const screenOptions = {
    // headerShown: false,
    tabBarShowLabel: false,
    tabBarActiveTintColor: activeTintColor,
    tabBarInactiveTintColor: inactiveTintColor,
    tabBarStyle: {
      backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF", // gray-800 / white
      borderTopWidth: 0,
      elevation: 10,
      height: 60,
    },
  } as const;

  const TABS = [
    {
      name: "index",
      icon: "mappin.and.ellipse",
      header: "My Trips",
      headerIcon: "",
    },
    {
      name: "history",
      icon: "clock.arrow.circlepath",
      header: "Trip HIstory",
      headerIcon: "car.fill",
    },
    {
      name: "location",
      icon: "map",
      header: "Drop Points",
      headerIcon: "location.fill",
    },
    {
      name: "activity",
      icon: "speedometer",
      header: "Log",
      headerIcon: "clipboard.fill",
    },
    {
      name: "user",
      icon: "person.circle",
      header: "Profile",
      headerIcon: "person.fill",
    },
  ];

  return (
    <Tabs screenOptions={screenOptions}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            //
            headerShown: tab.name === "index" ? false : true,
            headerTitle: tab.header,
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: COLORS.white,
            headerRight: () => (
              <View style={{ paddingRight: 20 }}>
                <IconSymbol
                  name={tab.headerIcon}
                  size={24}
                  color={COLORS.white}
                />
              </View>
            ),
            //
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name={tab.icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
