import CalendarScreen from "@/components/homeworkHelpScreens/Calendar";
import NotepadScreen from "@/components/homeworkHelpScreens/Notepad";
import TimerScreen from "@/components/homeworkHelpScreens/Timer";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function TabHomeworkHelpScreen() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<React.JSX.Element>(
    <NotepadScreen />
  );
  const [currentPageName, setPageName] = useState<string>("Notepad");

  const helpScreens = [
    {
      name: "Notepad",
      icon: "document-text-sharp",
      content: <NotepadScreen />,
    },
    {
      name: "Timer",
      icon: "timer-sharp",
      content: <TimerScreen />,
    },
    {
      name: "Calendar",
      icon: "calendar-clear-sharp",
      content: <CalendarScreen />,
    },
  ];

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setMenuOpen(false);
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Ionicons name="menu-sharp" size={30} color={"white"} />
        </TouchableOpacity>

        {menuOpen && (
          <View style={styles.sideMenu}>
            {helpScreens.map((option) => (
              <TouchableOpacity
                key={option.name}
                style={styles.menuItem}
                onPress={() => {
                  setCurrentContent(option.content);
                  setPageName(option.name);
                  setMenuOpen(false);
                }}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={option.name == currentPageName ? "#0D92F4" : "white"}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    {
                      color:
                        option.name == currentPageName ? "#0D92F4" : "white",
                    },
                  ]}
                >
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.content}>{currentContent}</View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1523",
  },
  menuButton: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 2,
    padding: 10,
    backgroundColor: "#1E2A38",
    borderRadius: 5,
  },
  menuText: {
    fontSize: 24,
    color: "white",
  },
  sideMenu: {
    position: "absolute",
    top: 130,
    left: 20,
    backgroundColor: "#1E2A38",
    padding: 10,
    borderRadius: 10,
    zIndex: 1,
  },
  menuItem: {
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  menuItemText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    color: "white",
    fontSize: 24,
  },
});
