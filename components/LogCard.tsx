import { COLORS } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "./IconSymbol";

type DriverLog = {
  tripData: {
    id: number;
    startTime: string;
    endTime: string | null;
    distanceKm: string;
    notes: string;
    status: "In_Progress" | "Completed" | "Cancelled";
    createdAt: string;
  };
};

const LogCard = ({ tripData }: DriverLog) => {
  const getDate = (tripDate: string) => new Date(tripDate).toLocaleDateString();
  const getTime = (tripDate: string) =>
    new Date(tripDate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusStyles = (
    status: "In_Progress" | "Completed" | "Cancelled"
  ) => {
    switch (status) {
      case "In_Progress":
        return { color: COLORS.blue };
      case "Completed":
        return { color: COLORS.green };
      case "Cancelled":
        return { color: COLORS.red };
      default:
        return { color: COLORS.grey };
    }
  };
  const statusStyles = getStatusStyles(tripData.status);

  return (
    <View style={styles.container}>
      {/* Header Row: Icon + Date/Time + Status */}
      <View style={styles.headerRow}>
        <View style={styles.iconWithText}>
          <View style={styles.iconWrapper}>
            <IconSymbol
              size={24}
              name={"box.truck.fill"}
              color={COLORS.white}
            />
          </View>
          <View>
            <Text style={styles.dateText}>{getDate(tripData.createdAt)}</Text>
            <View style={styles.timeRow}>
              <IconSymbol
                size={15}
                name={"clock.circle"}
                color={COLORS.secondary}
              />
              <Text style={styles.timeText}>{getTime(tripData.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/*  */}

        <View>
          <Text style={[styles.statusText, { color: statusStyles.color }]}>
            {tripData.status === "In_Progress"
              ? "In Progress"
              : tripData.status}
          </Text>
        </View>
      </View>

      {/* Start-End Time Row */}
      <View style={styles.routeRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconSymbol size={20} name={"flag.checkered"} color={COLORS.green} />
          <Text style={styles.routeTime}>{getTime(tripData.startTime)}</Text>
          <View style={styles.routeDivider} />
          <IconSymbol size={20} name={"flag.checkered"} color={COLORS.red} />
          <Text style={styles.routeTime}>
            {tripData.endTime ? getTime(tripData.endTime) : "Waiting..."}
          </Text>
        </View>
        <View style={{}}>
          <Text style={styles.tripId}>TRP-{tripData.id}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.fullDivider} />

      {/* Distance */}
      <View style={styles.distanceRow}>
        <IconSymbol
          size={20}
          name={"location.north.line"}
          color={COLORS.primary}
        />
        <Text style={styles.distanceText}>
          {tripData.distanceKm ? tripData.distanceKm : "0"} km
        </Text>
      </View>
    </View>
  );
};

export default LogCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconWithText: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrapper: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 8,
    padding: 7,
  },
  dateText: {
    fontWeight: "500",
    color: COLORS.primary,
    fontSize: 14,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  timeText: {
    color: COLORS.surface,
    marginLeft: 5,
    fontSize: 12,
  },
  tripId: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 5,
    justifyContent: "space-between",
  },
  routeTime: {
    marginLeft: 5,
    fontSize: 12,
  },
  routeDivider: {
    height: 1,
    width: 30,
    backgroundColor: COLORS.surfaceLight,
    marginHorizontal: 8,
  },
  fullDivider: {
    height: 1,
    width: "100%",
    backgroundColor: COLORS.surfaceLight,
    marginTop: 5,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  distanceText: {
    fontSize: 13,
    color: COLORS.primary,
  },
});
