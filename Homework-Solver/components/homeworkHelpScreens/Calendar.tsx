import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CalendarScreen() {
  let todaysDate: Date = new Date();
  const [currDate, setCurrDate] = useState<Date>(todaysDate);
  const [currMonth, setCurrMonth] = useState<number>(todaysDate.getMonth());
  const [currYear, setCurrYear] = useState<number>(todaysDate.getFullYear());

  return (
    <View>
      <Text>Calendar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    position: "absolute",
    top: 0,
  },
});
