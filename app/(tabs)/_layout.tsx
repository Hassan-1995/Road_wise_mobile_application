import { IconSymbol } from "@/components/IconSymbol";
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const activeTintColor = colorScheme === "dark" ? "#1E40AF" : "#1E3A8A";
  const inactiveTintColor = colorScheme === "dark" ? "#94A3B8" : "#64748B";

  const screenOptions = {
    headerShown: false,
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
    { name: "index", icon: "mappin.and.ellipse" },
    { name: "history", icon: "clock.arrow.circlepath" },
    { name: "location", icon: "map" },
    { name: "activity", icon: "speedometer" },
    { name: "user", icon: "person.circle" },
  ];

  return (
    <Tabs screenOptions={screenOptions}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name={tab.icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
