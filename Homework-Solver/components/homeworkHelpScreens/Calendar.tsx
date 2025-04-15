import { useRef, useState } from "react";
import {
  Animated,
  Button,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const months = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

export default function CalendarScreen() {
  const today = new Date();
  const [currMonth, setCurrMonth] = useState(today.getMonth());
  const [currYear, setCurrYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Record<string, string[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [monthSelectorVisible, setMonthSelectorVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const daysInMonth = new Date(currYear, currMonth + 1, 0).getDate();
  const firstDay = new Date(currYear, currMonth, 1).getDay();

  const generateGrid = () => {
    const days: (string | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(`${currYear}-${currMonth + 1}-${i}`);
    }
    return days;
  };

  const handleAddEvent = () => {
    if (!selectedDate || input.trim() === "") return;
    setEvents((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), input],
    }));
    setInput("");
  };

  const handleDeleteEvent = (index: number) => {
    if (!selectedDate) return;
    const updated = [...(events[selectedDate] || [])];
    updated.splice(index, 1);
    setEvents((prev) => ({ ...prev, [selectedDate]: updated }));
  };

  const animateMonthChange = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const goToPreviousMonth = () => {
    animateMonthChange(() => {
      if (currMonth === 0) {
        setCurrMonth(11);
        setCurrYear(currYear - 1);
      } else {
        setCurrMonth(currMonth - 1);
      }
    });
  };

  const goToNextMonth = () => {
    animateMonthChange(() => {
      if (currMonth === 11) {
        setCurrMonth(0);
        setCurrYear(currYear + 1);
      } else {
        setCurrMonth(currMonth + 1);
      }
    });
  };

  const handleOpenMonthSelector = () => {
    setMonthSelectorVisible(true);
  };

  const handleSelectMonthYear = (month: number, year: number) => {
    animateMonthChange(() => {
      setCurrMonth(month);
      setCurrYear(year);
      setMonthSelectorVisible(false);
    });
  };

  const [selectedMonth, setSelectedMonth] = useState<string>("Select a month");
  const [monthModalVisible, setMonthModalVisible] = useState<boolean>(false);

  const handleSelect = (month: string, monthVal: number) => {
    setSelectedMonth(month);
    setCurrMonth(monthVal);
    setMonthModalVisible(false);
  };

  const yearsRange = Array.from(
    { length: 21 },
    (_, i) => today.getFullYear() - 10 + i
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.arrow}>◀</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenMonthSelector}>
          <Text style={styles.monthText}>
            {monthNames[currMonth]} {currYear}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.arrow}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysHeader}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <Text key={d} style={styles.dayHeaderText}>
            {d}
          </Text>
        ))}
      </View>

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <FlatList
          data={generateGrid()}
          numColumns={7}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => {
            const day = item ? Number(item.split("-")[2]) : null;
            const hasEvents = item && events[item]?.length > 0;
            return (
              <TouchableOpacity
                style={[styles.dayCell, hasEvents && styles.highlightedDay]}
                onPress={() => {
                  if (item) {
                    setSelectedDate(item);
                    setModalVisible(true);
                  }
                }}
                disabled={!item}
              >
                <Text style={{ color: "white" }}>{day ?? ""}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </Animated.View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Events for {selectedDate}</Text>
          <ScrollView style={{ maxHeight: 150 }}>
            {selectedDate &&
              events[selectedDate]?.map((event, idx) => (
                <View key={idx} style={styles.eventRow}>
                  <Text style={{ color: "white" }}>• {event}</Text>
                  <TouchableOpacity onPress={() => handleDeleteEvent(idx)}>
                    <Text style={{ color: "red", marginLeft: 10 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
          <TextInput
            placeholder="New event"
            value={input}
            onChangeText={setInput}
            style={styles.input}
            selectionColor={"white"}
            placeholderTextColor={"#a1a1a1"}
          />
          <Button title="Add Event" onPress={handleAddEvent} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <Modal
        visible={monthSelectorVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={[styles.modal, { maxHeight: 400 }]}>
          <Text style={styles.modalTitle}>Select Month and Year</Text>

          <View style={styles.dropdown_container}>
            <Text style={styles.dropdown_label}>Month:</Text>

            <TouchableOpacity
              style={styles.dropdown_dropdown}
              onPress={() => setMonthModalVisible(true)}
            >
              <Text style={styles.dropdown_dropdownText}>{selectedMonth}</Text>
            </TouchableOpacity>

            <Modal
              transparent
              animationType="fade"
              visible={monthModalVisible}
              onRequestClose={() => setMonthModalVisible(false)}
            >
              <TouchableOpacity
                style={styles.dropdown_modalBackground}
                onPress={() => setMonthModalVisible(false)}
                activeOpacity={1}
              >
                <View style={styles.dropdown_modalContent}>
                  <FlatList
                    data={months}
                    keyExtractor={(item) => {
                      return "" + item.value;
                    }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.dropdown_item}
                        onPress={() => handleSelect(item.label, item.value)}
                      >
                        <Text style={styles.dropdown_itemText}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
            <TextInput
              placeholder={"" + currYear}
              value={"" + currYear}
              onChangeText={(val) => {
                setCurrYear(+val);
              }}
              style={styles.input}
              selectionColor={"white"}
              placeholderTextColor={"#a1a1a1"}
              textContentType="creditCardNumber"
              maxLength={4}
            />
            <Button
              title="Close"
              onPress={() => setMonthSelectorVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 150,
    paddingHorizontal: 10,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    color: "white",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  arrow: {
    fontSize: 24,
    color: "white",
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayHeaderText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 5,
    color: "white",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.3,
    borderColor: "#ccc",
  },
  highlightedDay: {
    backgroundColor: "#007AFF",
  },
  modal: {
    marginTop: 150,
    backgroundColor: "#0B1523",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: "white",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 5,
    marginBottom: 10,
    marginTop: 10,
    color: "white",
    borderColor: "white",
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dropdown_container: {
    padding: 16,
  },
  dropdown_label: {
    fontSize: 16,
    marginBottom: 8,
    color: "white",
  },
  dropdown_dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdown_dropdownText: {
    fontSize: 16,
  },
  dropdown_modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  dropdown_modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    maxHeight: 300,
    padding: 10,
  },
  dropdown_item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  dropdown_itemText: {
    fontSize: 16,
  },
});
