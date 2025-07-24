import { COLORS } from "@/constants/theme";
import React, { ReactNode } from "react";
import { View } from "react-native";

type ScreenProps = {
  children: ReactNode;
};

const Screen: React.FC<ScreenProps> = ({ children }) => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {children}
    </View>
  );
};

export default Screen;
