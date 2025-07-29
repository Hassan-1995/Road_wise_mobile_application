import { COLORS } from "@/constants/theme";
import React, { ReactNode } from "react";
import { Platform, StatusBar, View } from "react-native";

type ScreenProps = {
  children: ReactNode;
};

const Screen: React.FC<ScreenProps> = ({ children }) => {
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight ?? 24 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Custom StatusBar background color */}
      <View
        style={{
          height: statusBarHeight,
          backgroundColor: COLORS.primary, // Customize here
        }}
      />
      {children}
    </View>
  );
};

export default Screen;
