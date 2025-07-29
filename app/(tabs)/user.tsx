import { IconSymbol } from "@/components/IconSymbol";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type DriverProfile = {
  id: number;
  name: string;
  cnic: string;
  gender: string;
  residenceArea: string;
  licenseNumber: string;
  dateOfBirth: string;
  createdAt: string;
  vehicleName: string;
};

const mockDriverData: DriverProfile = {
  id: 101,
  name: "Hassan Mansoor",
  cnic: "42101-1234567-1",
  gender: "Male",
  residenceArea: "North Nazimabad, Karachi",
  licenseNumber: "PK-2025-45892",
  dateOfBirth: "1990-05-15",
  createdAt: "2023-06-01",
  vehicleName: "Suzuki Bolan",
};

const Profile = () => {
  return (
    <Screen>
      <ScrollView>
        <View
          style={{
            backgroundColor: COLORS.green,
            borderRadius: 15,
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              flex: 1,
              // justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconSymbol
              size={100}
              name={"person.circle"}
              color={COLORS.primary}
            />
            <Text
              style={{ fontSize: 20, fontWeight: "600", color: COLORS.primary }}
            >
              {mockDriverData.name}
            </Text>
            <Text>DRV-2024-{mockDriverData.id}</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Profile;

const styles = StyleSheet.create({});

// import { FontAwesome5 } from "@expo/vector-icons";
// import React, { useState } from "react";
// import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

// interface DriverProfile {
//   id: number;
//   cnic: string;
//   gender: string;
//   residenceArea: string;
//   licenseNumber: string;
//   dateOfBirth: string;
//   createdAt: string;
//   vehicleName: string;
// }

// const mockDriverData: DriverProfile = {
//   id: 101,
//   cnic: "42101-1234567-1",
//   gender: "Male",
//   residenceArea: "North Nazimabad, Karachi",
//   licenseNumber: "PK-2025-45892",
//   dateOfBirth: "1990-05-15",
//   createdAt: "2023-06-01",
//   vehicleName: "Suzuki Bolan",
// };

// const ProfileScreen = () => {
//   const [isAvailable, setIsAvailable] = useState<boolean>(true);

//   const toggleAvailability = () => {
//     setIsAvailable((prev) => !prev);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Driver Profile</Text>

//       <View style={styles.card}>
//         <ProfileItem label="ID" value={mockDriverData.id.toString()} />
//         <ProfileItem label="CNIC" value={mockDriverData.cnic} icon="id-card" />
//         <ProfileItem label="Gender" value={mockDriverData.gender} icon="user" />
//         <ProfileItem
//           label="Residence Area"
//           value={mockDriverData.residenceArea}
//           icon="map-marker-alt"
//         />
//         <ProfileItem
//           label="License Number"
//           value={mockDriverData.licenseNumber}
//           icon="car"
//         />
//         <ProfileItem
//           label="Date of Birth"
//           value={mockDriverData.dateOfBirth}
//           icon="calendar"
//         />
//         <ProfileItem
//           label="Created At"
//           value={mockDriverData.createdAt}
//           icon="clock"
//         />
//         <ProfileItem
//           label="Vehicle Name"
//           value={mockDriverData.vehicleName}
//           icon="truck"
//         />

//         <View style={styles.availabilityContainer}>
//           <Text style={styles.label}>Availability:</Text>
//           <View style={styles.switchRow}>
//             <Text style={styles.availabilityText}>
//               {isAvailable ? "Active" : "On Break"}
//             </Text>
//             <Switch
//               value={isAvailable}
//               onValueChange={toggleAvailability}
//               thumbColor={isAvailable ? "#4CAF50" : "#f44336"}
//               trackColor={{ false: "#ccc", true: "#a5d6a7" }}
//             />
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// interface ProfileItemProps {
//   label: string;
//   value: string;
//   icon?: string;
// }

// const ProfileItem: React.FC<ProfileItemProps> = ({ label, value, icon }) => (
//   <View style={styles.itemRow}>
//     <View style={styles.labelRow}>
//       {icon && (
//         <FontAwesome5 name={icon as any} size={16} style={styles.icon} />
//       )}
//       <Text style={styles.label}>{label}:</Text>
//     </View>
//     <Text style={styles.value}>{value}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#f9f9f9",
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#333",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   itemRow: {
//     marginBottom: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   labelRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   icon: {
//     marginRight: 6,
//     color: "#666",
//   },
//   label: {
//     fontWeight: "600",
//     fontSize: 14,
//     color: "#444",
//   },
//   value: {
//     fontSize: 16,
//     color: "#000",
//   },
//   availabilityContainer: {
//     marginTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     paddingTop: 15,
//   },
//   switchRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 6,
//   },
//   availabilityText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//   },
// });

// export default ProfileScreen;
