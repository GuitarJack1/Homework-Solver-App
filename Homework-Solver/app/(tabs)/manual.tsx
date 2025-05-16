import { View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";

import MathKeyboard from "@/components/MathKeyBoard";
import useKeyboardStore from "@/components/functions/useKeyboardStore";

export default function TabManualScreen() {
  const [inputText, setInputText] = useState<string>("");

  const isInputFocused = useKeyboardStore((state) => state.isInputFocused);
  const setIsInputFocused = useKeyboardStore(
    (state) => state.setIsInputFocused
  );

  const handleSymbolPress = (symbol: string) => {
    setInputText((prev) => prev + symbol);
  };

  const handleViewSolution = () => {
    router.push({
      pathname: "/solutionModal",
      params: { extractedText: inputText },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setIsInputFocused(false);
        }}
      >
        <View style={styles.overallContainer}>
          <View style={styles.container}>
            <Image
              source={require("@/assets/images/manual-input-graphic.png")}
              style={[styles.topImage, { opacity: 1 }]}
            />

            <Text style={styles.title}>Manual Input</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Type/Paste here"
              placeholderTextColor="#436B95"
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="top"
              scrollEnabled={false}
              showSoftInputOnFocus={false}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleViewSolution}
            >
              <Text style={styles.buttonText}>SOLVE</Text>
            </TouchableOpacity>

            <Image
              source={require("@/assets/images/bottom_ui_piece3.png")}
              style={styles.bottomImage}
            />
          </View>
          <View style={{ height: isInputFocused ? 100 : 0 }} />
        </View>
      </TouchableWithoutFeedback>

      {isInputFocused && (
        <View style={styles.keyboardWrapper}>
          <MathKeyboard onPress={handleSymbolPress} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
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
    width: "90%",
    height: 320,
    alignSelf: "center",
    top: -30,
  },
  title: {
    fontSize: 30,
    color: "#6ecef2",
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: -30,
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
    marginTop: -3,
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
    top: 740,
  },
  keyboardWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});
