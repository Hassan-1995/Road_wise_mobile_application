import { getDriverInfo } from "@/api/driverInfo";
import { IconSymbol } from "@/components/IconSymbol";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

type DriverProfile = {
  id: number;
  name: string;
  cnicNumber: string;
  gender: string;
  residenceArea: string;
  licenseNumber: string;
  dateOfBirth: string;
  createdAt: string;
  phone: string;
};

const Profile = () => {
  const [data, setData] = useState<DriverProfile | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchDriverInfo = async () => {
      // const driverId = 11;
      const driverId = 1;
      try {
        const fetchedData = await getDriverInfo(driverId);
        // setData(fetchedData[0] as DriverProfile);
        setData((fetchedData as DriverProfile[])[0]);
        console.log("Fetched Data:", fetchedData);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchDriverInfo();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const toggleSwitch = () => setIsActive((previous) => !previous);

  return (
    <Screen>
      <ScrollView>
        <View style={styles.card}>
          <View style={styles.centeredContent}>
            <IconSymbol
              size={100}
              name="person.circle"
              color={COLORS.primary}
            />
            <Text style={styles.nameText}>{data && data.name}</Text>
            <Text>
              DRV-{data && new Date(data.createdAt).getFullYear()}-
              {data && String(data.id).padStart(3, "0")}
            </Text>
          </View>
        </View>

        {data && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {/* Name */}
            <View style={styles.infoRow}>
              <IconSymbol
                size={40}
                name="person.crop.circle"
                color={COLORS.grey}
                style={styles.iconMargin}
              />
              <View>
                <Text style={styles.infoLabel}>Driver Name</Text>
                <Text style={styles.infoSubTitle}>{data.name}</Text>
              </View>
            </View>
            {/* CNIC Number */}
            <View style={styles.infoRow}>
              <IconSymbol
                size={40}
                name="person.text.rectangle"
                color={COLORS.grey}
                style={styles.iconMargin}
              />
              <View>
                <Text style={styles.infoLabel}>CNIC Number</Text>
                <Text style={styles.infoSubTitle}>
                  {/* {data?.cnicNumber.slice(0, 4)} -{" "}
                  {data?.cnicNumber.slice(4, 12)} - {data?.cnicNumber.slice(12)} */}
                  {data?.cnicNumber
                    ? `${data.cnicNumber.slice(0, 4)} - ${data.cnicNumber.slice(
                        4,
                        12
                      )} - ${data.cnicNumber.slice(12)}`
                    : "N/A"}
                </Text>
              </View>
            </View>
            {/* Gender */}
            <View style={styles.infoRow}>
              <IconSymbol
                size={40}
                name="figure.stand.line.dotted.figure.stand"
                color={COLORS.grey}
                style={styles.iconMargin}
              />
              <View>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoSubTitle}>{data.gender}</Text>
              </View>
            </View>
            {/* Residence Area */}
            <View style={styles.infoRow}>
              <IconSymbol
                size={40}
                name="house.circle"
                color={COLORS.grey}
                style={styles.iconMargin}
              />
              <View>
                <Text style={styles.infoLabel}>Residence Area</Text>
                <Text style={styles.infoSubTitle}>{data.residenceArea}</Text>
              </View>
            </View>
          </View>
        )}
        {data && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Driver Information</Text>
            {/* License Number */}
            <View style={styles.infoRow}>
              <IconSymbol
                size={40}
                name="car.circle"
                color={COLORS.grey}
                style={styles.iconMargin}
              />
              <View>
                <Text style={styles.infoLabel}>License Number</Text>
                <Text style={styles.infoSubTitle}>{data.licenseNumber}</Text>
              </View>
            </View>
            {/* Date of Birth */}
            <View style={styles.infoRow}>
              <IconSymbol
                size={40}
                name="calendar.circle"
                color={COLORS.grey}
                style={styles.iconMargin}
              />
              <View>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoSubTitle}>
                  {formatDate(data.dateOfBirth)}
                </Text>
              </View>
            </View>
            {/* Created */}
            <View style={styles.infoRow}>
              <IconSymbol
                size={40}
                name="calendar.badge.plus"
                color={COLORS.grey}
                style={styles.iconMargin}
              />
              <View>
                <Text style={styles.infoLabel}>Account Created At</Text>
                <Text style={styles.infoSubTitle}>
                  {formatDate(data.createdAt)}
                </Text>
              </View>
            </View>
            {/* Number */}
            <View style={styles.infoRow}>
              <IconSymbol
                size={40}
                name="phone.circle.fill"
                color={COLORS.grey}
                style={styles.iconMargin}
              />
              <View>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoSubTitle}>
                  {/* {data?.phone.slice(0, 4)} - {data?.phone.slice(4)} */}
                  {data?.phone
                    ? `${data.phone.slice(0, 4)} - ${data.phone.slice(4)}`
                    : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        )}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Driver Status</Text>
          <View style={[styles.infoRow, { justifyContent: "space-between" }]}>
            <Text
              style={[
                styles.infoLabel,
                { color: isActive ? COLORS.green : COLORS.amber },
              ]}
            >
              {isActive ? "Active" : "On Break"}
            </Text>
            <Switch
              trackColor={{ false: COLORS.grey, true: COLORS.grey }}
              thumbColor={isActive ? COLORS.green : COLORS.amber}
              ios_backgroundColor={COLORS.grey}
              onValueChange={toggleSwitch}
              value={isActive}
              style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Profile;

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
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconMargin: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  infoSubTitle: {
    fontSize: 14,
    color: COLORS.secondary,
  },
});
