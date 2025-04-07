import { View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

export default function TabManualScreen() {
  const [inputText, setInputText] = useState<string>("");

  const handleViewSolution = () => {
    router.push({
      pathname: "/solutionModal",
      params: { extractedText: inputText },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.overallContainer}>
        <View style={styles.container}>
          {/* Top Image - matching Camera screen style */}
          <Image
            source={require("@/assets/images/manual-input-graphic.png")}
            style={[styles.topImage, { opacity: 1 }]}
          />

          {/* Title */}
          <Text style={styles.title}>Manual Input</Text>

          {/* Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Type/Paste here"
            placeholderTextColor="#436B95" // new, more aesthetic color
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />


          {/* Solve Button */}
          <TouchableOpacity style={styles.button} onPress={handleViewSolution}>
            <Text style={styles.buttonText}>SOLVE</Text>
          </TouchableOpacity>

          {/* Bottom Image like camera screen (optional) */}
          <Image
            source={require("@/assets/images/bottom_ui_piece3.png")}
            style={styles.bottomImage}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#0B1523",
  },
  overallContainer: {
    flexGrow: 1,
    backgroundColor: "#0B1523",
    width: "100%",
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B1523",
    width: "100%",
  },
  topImage: {
    width: "92%",
    top: 55,
    height: 320,
    position: "absolute",
  },
  title: {
    fontSize: 30,
    color: "#6ecef2",
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 240, // same as uploadTitle in camera screen
  },
  textInput: {
    width: 280,
    height: 180,
    backgroundColor: "#C4E2FF",
    color: "#0B1523",
    padding: 12,
    borderWidth: 4,
    borderColor: "#3fb6dd",
    borderRadius: 15,
    fontSize: 15,
    marginBottom: 20,
  },
  button: {
    width: 280,
    backgroundColor: "#004E89",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomImage: {
    width: 100,
    height: 20,
    position: "absolute",
    bottom: 92,
  },
});
