import { COLORS } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "./IconSymbol";

type DropoutAssignment = {
  assignedAt: string;
  address: string;
  driverId: number;
  id: number;
  latitude: string;
  longitude: string;
  status: "Pending" | "Completed" | "Cancelled";
  storeId: number;
  storename: string;
  tripId: number;
};

type TripCardProps = {
  tripData: DropoutAssignment[];
};

const TripCard = ({ tripData }: TripCardProps) => {
  const getStatusStyles = (status: "Pending" | "Completed" | "Cancelled") => {
    switch (status) {
      case "Pending":
        return {
          backgroundColor: COLORS.blue,
          iconName: "clock.circle",
        };
      case "Completed":
        return {
          backgroundColor: COLORS.green,
          iconName: "checkmark.circle.fill",
        };
      case "Cancelled":
        return { backgroundColor: COLORS.red, iconName: "xmark.circle.fill" };
      default:
        return {
          backgroundColor: COLORS.grey,
          iconName: "questionmark.circle.fill",
        };
    }
  };
  const statusStyles = getStatusStyles(tripData[0].status);
  return (
    <View style={styles.card}>
      {/* TRIP HEADER */}
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <IconSymbol
              size={24}
              name={"mappin.circle.fill"}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.tripId}>TRP-{tripData[0].tripId}</Text>
        </View>
        <View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyles.backgroundColor },
            ]}
          >
            <IconSymbol
              size={15}
              name={statusStyles.iconName}
              color={COLORS.white}
            />
            <Text style={styles.statusText}>{tripData[0].status}</Text>
          </View>
        </View>
      </View>

      {/* TRIP SUB-HEADER */}
      <View style={styles.subHeaderContainer}>
        <View style={styles.badge}>
          <IconSymbol
            size={24}
            name={"mappin.circle.fill"}
            color={COLORS.secondary}
          />
          <Text style={styles.badgeText}>{tripData.length} Stops</Text>
        </View>
        <View style={styles.badge}>
          <IconSymbol
            size={24}
            name={"clock.circle"}
            color={COLORS.secondary}
          />
          <Text style={styles.badgeText}>3h 45m</Text>
        </View>
      </View>

      <View style={styles.dropOffContainer}>
        <Text style={styles.dropOffLabel}>Drop-off Points:</Text>
      </View>

      {/* TRIP DETAIL INFORMATION */}
      {tripData.map((trip, index) => (
        <View style={styles.detailContainer} key={trip.id}>
          <View style={styles.numberCircleContainer}>
            <Text style={styles.numberCircleText}>{index + 1}</Text>
          </View>
          <View>
            <Text style={styles.storeName}>{trip.storename}</Text>
            <Text style={styles.storeAddress}>{trip.address}</Text>
            <Text style={styles.storeTime}>TIME</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 15,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 5,
    padding: 7,
  },
  tripId: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: "500",
  },
  statusBadge: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 3,
    color: COLORS.white,
  },
  subHeaderContainer: {
    flexDirection: "row",
  },
  badge: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 5,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 12,
    marginLeft: 3,
    color: COLORS.secondary,
  },
  dropOffContainer: {
    marginVertical: 10,
  },
  dropOffLabel: {
    fontWeight: "500",
    color: COLORS.secondary,
  },
  detailContainer: {
    backgroundColor: COLORS.background,
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  numberCircleContainer: {
    backgroundColor: COLORS.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  numberCircleText: {
    color: COLORS.white,
    fontSize: 12,
  },
  storeName: {
    fontWeight: "500",
  },
  storeAddress: {
    color: COLORS.secondary,
  },
  storeTime: {
    color: COLORS.surfaceLight,
  },
});
