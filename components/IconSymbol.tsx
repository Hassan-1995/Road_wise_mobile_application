// import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { ComponentProps } from "react";
import { StyleProp, TextStyle } from "react-native";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type IconMapping = Record<
  string,
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * You can expand as needed.
 */
// map-marker-path
const MAPPING = {
  "mappin.and.ellipse": "map-marker-multiple-outline",
  "clock.arrow.circlepath": "history",
  map: "map-marker-path",
  speedometer: "speedometer",
  "person.circle": "account-circle-outline",
  "mappin.circle.fill": "map-marker-outline",
  "exclamationmark.circle": "progress-alert",
  "clock.circle": "clock-outline",
  "xmark.circle.fill": "selection-ellipse-remove",
  "checkmark.circle.fill": "check-circle-outline",
  "car.fill": "car-clock",
  "location.fill": "map-marker-check",
  "clipboard.fill": "clipboard-text",
  "person.fill": "account-details",
  "box.truck.fill": "truck-check",
  "flag.checkered": "flag-variant-outline",
  "location.north.line": "map-marker-distance",
  "point.topleft.down.curvedto.point.bottomright.up":
    "navigation-variant-outline",
  "square.and.pencil": "pencil-outline",
  "person.crop.circle": "steering",
  "person.text.rectangle": "card-account-details-outline",
  "figure.stand.line.dotted.figure.stand": "gender-non-binary",
  "house.circle": "home-city-outline",
  "car.circle": "license",
  "calendar.circle": "calendar-account-outline",
  "calendar.badge.plus": "calendar-plus",
  "phone.circle.fill": "phone",
  "car.side": "car-cog",
  "fuelpump.fill": "gas-station",
  "plus.circle.fill": "notebook-plus",
  "wrench.and.screwdriver": "tools",
  "gearshape.2.fill": "auto-fix",
  "chart.bar.doc.horizontal": "chart-bar",
} as IconMapping;
// const;

/**
 * Cross-platform IconSymbol component using react-native-vector-icons.
 * Uses SF Symbol-like names mapped to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  const iconName = MAPPING[name];

  if (!iconName) {
    console.warn(`IconSymbol: No mapping found for "${name}"`);
    return null;
  }

  return (
    <MaterialCommunityIcons
      name={iconName}
      size={size}
      color={color}
      style={style}
    />
  );
}
