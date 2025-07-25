import LogCard from "@/components/LogCard";
import Screen from "@/components/Screen";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const DeliveryLog = () => {
  return (
    <Screen>
      <ScrollView>
        <LogCard />
      </ScrollView>
    </Screen>
  );
};

export default DeliveryLog;

const styles = StyleSheet.create({
  header: {},
});
