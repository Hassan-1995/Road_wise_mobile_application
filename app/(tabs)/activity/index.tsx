import { getDriverID } from "@/api/getDriverID";
import { getVehicleInfo } from "@/api/vehicleInfo";
import { IconSymbol } from "@/components/IconSymbol";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type VehicleMaintenanceLog = {
  id: number;
  vehicleId: string;
  driverId: number;
  maintenanceDate: string;
  liters: number | null;
  serviceType: string | null;
  repairType: string | null;
  costRs: string;
  odometerKm: string;
  location: string;
  notes: string | null;
  createdAt: string;
  makeModel: string;
  registrationNumber: string;
}[];

const Maintenance = () => {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<VehicleMaintenanceLog | null>(null);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useFocusEffect(() => {
    const fetchVehicleInfo = async () => {
      const driverId = (await getDriverID(user?.id || 0)) as { id: number };
      try {
        const fetchedData = (await getVehicleInfo(
          driverId.id
        )) as VehicleMaintenanceLog;
        setData(
          fetchedData.filter((item) => {
            const d = new Date(item.createdAt);
            return (
              d.getMonth() === currentMonth && d.getFullYear() === currentYear
            );
          }) as VehicleMaintenanceLog
        );
        console.log("Fetched Data:", fetchedData);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchVehicleInfo();
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    // const year = date.getFullYear();

    return `${day} ${month}`;
  };

  const TotalFuelCost = (data: VehicleMaintenanceLog) => {
    const sum = data
      .filter((item) => item.liters !== null)
      .reduce((sum, item) => sum + parseFloat(item.costRs), 0);
    return sum.toLocaleString();
  };
  const TotalServiceCost = (data: VehicleMaintenanceLog) => {
    const sum = data
      .filter((item) => item.serviceType !== null)
      .reduce((sum, item) => sum + parseFloat(item.costRs), 0);
    return sum.toLocaleString();
  };
  const TotalRepairCost = (data: VehicleMaintenanceLog) => {
    const sum = data
      .filter((item) => item.repairType !== null)
      .reduce((sum, item) => sum + parseFloat(item.costRs), 0);
    return sum.toLocaleString();
  };

  console.log("DATA: ", data);
  return (
    <Screen>
      <ScrollView>
        <View style={styles.card}>
          <View style={styles.centeredContent}>
            <IconSymbol size={100} name="speedometer" color={COLORS.primary} />
            <Text style={styles.nameText}>Vehicle Info</Text>
          </View>
        </View>

        {/* Fuel Log */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <IconSymbol
                size={30}
                name="fuelpump.fill"
                color={COLORS.secondary}
              />
              <Text style={styles.sectionTitle}>Fuel Log</Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                router.push("/activity/fuelEntry");
                console.log("Press");
              }}
            >
              <IconSymbol
                size={20}
                name="plus.circle.fill"
                color={COLORS.primary}
              />
              <Text>Add Entry</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
          >
            <View style={styles.cardRow}>
              {data &&
                data
                  .filter((fuel) => fuel.liters)
                  .map((fuel) => (
                    <View key={fuel.id} style={styles.entryCard}>
                      <Text style={styles.dateText}>
                        {formatDate(fuel.maintenanceDate)}
                      </Text>
                      <Text>Liter: {fuel.liters ?? "N/A"}</Text>
                      <Text>
                        Cost: Rs.{" "}
                        {Number(fuel.costRs).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </Text>
                      <Text>
                        Avg:{" "}
                        {fuel.liters && parseFloat(fuel.costRs)
                          ? (parseFloat(fuel.costRs) / fuel.liters)
                              .toFixed(2)
                              .toLocaleString()
                          : "N/A"}{" "}
                        Rs/L
                      </Text>
                    </View>
                  ))}
            </View>
          </ScrollView>
        </View>

        {/* Service and Maintenance */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <IconSymbol
                size={30}
                name="wrench.and.screwdriver"
                color={COLORS.secondary}
              />
              <Text style={styles.sectionTitle}>Service</Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                router.push("/activity/serviceEntry");
                console.log("Press");
              }}
            >
              <IconSymbol
                size={20}
                name="plus.circle.fill"
                color={COLORS.primary}
              />
              <Text>Add Entry</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
          >
            <View style={styles.cardRow}>
              {data &&
                data
                  .filter((service) => service.serviceType)
                  .map((service) => (
                    <View key={service.id} style={styles.entryCard}>
                      <Text style={styles.dateText}>
                        {formatDate(service.maintenanceDate)}
                      </Text>
                      <Text>{service.serviceType ?? "N/A"}</Text>
                      <Text>
                        Cost: Rs.{" "}
                        {Number(service.costRs).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </Text>
                    </View>
                  ))}
            </View>
          </ScrollView>
        </View>

        {/* Repair and Replacement */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <IconSymbol
                size={30}
                name="gearshape.2.fill"
                color={COLORS.secondary}
              />
              <Text style={styles.sectionTitle}>Repair</Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                router.push("/activity/repairEntry");
                console.log("Press");
              }}
            >
              <IconSymbol
                size={20}
                name="plus.circle.fill"
                color={COLORS.primary}
              />
              <Text>Add Entry</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
          >
            <View style={styles.cardRow}>
              {data &&
                data
                  .filter((repair) => repair.repairType)
                  .map((repair) => (
                    <View key={repair.id} style={styles.entryCard}>
                      <Text style={styles.dateText}>
                        {formatDate(repair.maintenanceDate)}
                      </Text>
                      <Text>{repair.repairType ?? "N/A"}</Text>
                      <Text>
                        Cost: Rs.{" "}
                        {Number(repair.costRs).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </Text>
                    </View>
                  ))}
            </View>
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <IconSymbol
              size={30}
              name="chart.bar.doc.horizontal"
              color={COLORS.secondary}
            />
            <Text style={styles.sectionTitle}>Stats</Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {/* total fuel */}
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: 100,
              }}
            >
              <Text>💧</Text>
              <Text>Fuel Consumption</Text>
              <Text style={styles.sectionTitle}>
                {data && TotalFuelCost(data)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: 100,
              }}
            >
              <Text>🛠️</Text>
              <Text>Service Cost</Text>
              <Text style={styles.sectionTitle}>
                {data && TotalServiceCost(data)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: 100,
              }}
            >
              <Text>🔧</Text>
              <Text>Repair Cost</Text>
              <Text style={styles.sectionTitle}>
                {data && TotalRepairCost(data)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Maintenance;

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
    margin: 10,
  },
  centeredContent: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  scrollView: {
    marginVertical: 10,
  },
  cardRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
  },
  entryCard: {
    backgroundColor: COLORS.surfaceLight,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surface,
    width: 180,
  },
  dateText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
