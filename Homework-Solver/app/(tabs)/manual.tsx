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
  ActivityIndicator,
} from "react-native";

export default function TabManualScreen() {
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleViewSolution = () => {
    if (!inputText.trim()) return;

    setLoading(true);

    setTimeout(() => {
      router.push({
        pathname: "/solutionModal",
        params: { extractedText: inputText },
      });
      setLoading(false);
    }, 1000); // Simulate short delay for animation effect
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.overallContainer}>
        <View style={styles.container}>
          {/* Top Image */}
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
            placeholderTextColor="#436B95"
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />

          {/* Solve Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleViewSolution}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                color="white"
                style={styles.loader}
              />
            ) : (
              <Text style={styles.buttonText}>SOLVE</Text>
            )}
          </TouchableOpacity>

          {/* Bottom Image */}
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
    fontFamily: "Montserrat",
    color: "#6ecef2",
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 240,
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
    fontFamily: "Montserrat",
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
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
  loader: {},
  bottomImage: {
    width: 100,
    height: 20,
    position: "absolute",
    bottom: 92,
  },
});
