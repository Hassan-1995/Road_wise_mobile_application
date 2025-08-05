import { repairLogCreateEntry } from "@/api/repairEntry";
import AppButton from "@/components/AppButton";
import { IconSymbol } from "@/components/IconSymbol";
import Screen from "@/components/Screen";
import { COLORS } from "@/constants/theme";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
const RepairLogEntry = () => {
  const [repair, setRepair] = useState("");
  const [repairCost, setRepairCost] = useState("");
  const [odometer, setOdometer] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleRepairEntry = async () => {
    if (!repair || !repairCost || !odometer) {
      console.log("Hello");
      return;
    }
    try {
      const data = {
        driverId: 1,
        vehicleId: 1,
        repairType: repair,
        costRs: parseFloat(repairCost),
        odometerKm: parseInt(odometer),
        location,
        notes,
      };

      const response = await repairLogCreateEntry(data);

      Alert.alert("Success", "Repair log entry created successfully!");
      console.log(response);
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", "Failed to submit repair log.");
    }
  };
  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={styles.card}>
            <View style={styles.titleRow}>
              <IconSymbol
                size={20}
                name="gearshape.2.fill"
                color={COLORS.secondary}
              />
              <Text style={styles.sectionTitle}>Repair Type</Text>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={repair}
                onValueChange={(itemValue) => {
                  setRepair(itemValue);
                  console.log(itemValue);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Engine" value="ENGINE" />
                <Picker.Item label="Transmission" value="TRANSMISSION" />
                <Picker.Item label="Brakes" value="BRAKES" />
                <Picker.Item label="Suspension" value="SUSPENSION" />
                <Picker.Item label="Electrical" value="ELECTRICAL" />
                <Picker.Item label="Body" value="BODY" />
              </Picker>
            </View>
          </View>

          {/* Cost */}
          <View style={styles.card}>
            <View style={styles.titleRow}>
              <IconSymbol
                size={20}
                name="creditcard.circle"
                color={COLORS.secondary}
              />
              <Text style={styles.sectionTitle}>Repair Cost</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="0.00"
                value={repairCost}
                onChangeText={(text) => setRepairCost(text)}
                keyboardType="numeric"
              />
              <Text style={styles.unitText}>Rupees</Text>
            </View>
          </View>
          {/* Odometer */}
          <View style={styles.card}>
            <View style={styles.titleRow}>
              <IconSymbol size={20} name="gauge" color={COLORS.secondary} />
              <Text style={styles.sectionTitle}>Odometer Reading</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="0.00"
                value={odometer}
                onChangeText={(text) => setOdometer(text)}
                keyboardType="numeric"
              />
              <Text style={styles.unitText}>km</Text>
            </View>
          </View>
          {/* Location */}
          <View style={styles.card}>
            <View style={styles.titleRow}>
              <IconSymbol
                size={20}
                name="mappin.and.ellipse"
                color={COLORS.secondary}
              />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="Enter repair station or location"
                value={location}
                onChangeText={(text) => setLocation(text)}
                keyboardType="default"
              />
            </View>
          </View>
          {/* Notes */}
          <View style={styles.card}>
            <View style={styles.titleRow}>
              <IconSymbol size={20} name="note.text" color={COLORS.secondary} />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.inputText,
                  { height: 100, textAlignVertical: "top" },
                ]}
                placeholder="Add any additional comments..."
                value={notes}
                onChangeText={(text) => setNotes(text)}
                keyboardType="default"
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <AppButton title="Save Repair Entry" onPress={handleRepairEntry} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default RepairLogEntry;

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
    // marginBottom: 15,
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // height: 50,
    borderColor: COLORS.grey,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 20,
  },
  inputText: {
    fontSize: 16,
    flex: 1,
  },
  unitText: {
    fontSize: 16,
    marginLeft: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  picker: {
    width: "100%",
  },
});
