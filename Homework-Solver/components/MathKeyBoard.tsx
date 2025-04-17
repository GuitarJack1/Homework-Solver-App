import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type MathKeyboardProps = {
  onPress: (symbol: string) => void;
};

const symbolsTab1 = ["+", "-", "x", "÷", "=", "√", "^", "(", ")"];

export default function MathKeyboard({ onPress }: MathKeyboardProps) {
  return (
    <View style={styles.keyboardContainer}>
      {symbolsTab1.map((symbol, index) => (
        <TouchableOpacity
          key={index}
          style={styles.key}
          onPress={() => onPress(symbol)}
        >
          <Text style={styles.keyText}>{symbol}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999, // Ensures it's on top of everything
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#1e293b",
    borderTopWidth: 2,
    borderColor: "#3fb6dd",
    elevation: 10, // Needed for Android
  },

  key: {
    width: 50,
    height: 50,
    zIndex: 999,
    margin: 5,
    backgroundColor: "#3fb6dd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: 24,
    color: "#fff",
  },
});
