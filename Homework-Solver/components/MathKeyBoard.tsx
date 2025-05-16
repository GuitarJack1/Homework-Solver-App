import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type MathKeyboardProps = {
  onPress: (symbol: string) => void;
};

const symbolsTab1 = [
  "(",
  ")",
  "7",
  "8",
  "9",
  "%",
  "sqrt",
  "4",
  "5",
  "6",
  "x",
  "y",
  "1",
  "2",
  "3",
  "□/□",
  "^",
  "0",
  ".",
  "=",
  "π",
  "+",
  "-",
  "×",
  "/",
];

const symbolsTab2 = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "z",
  "_",
];

const symbolsTab3 = [
  "sin()",
  "cos()",
  "tan()",
  "deg",
  "rad",
  "arcsin()",
  "arccos()",
  "arctan()",
  "e",
  "d/dx",
  "csc",
  "sec",
  "cot",
  "log()",
  "integral()",
  "arccsc",
  "arcsec",
  "arccot",
  "|",
  "theta",
];

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
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#1e293b",
    borderTopWidth: 2,
    borderColor: "#3fb6dd",
    elevation: 10,
  },

  key: {
    width: 70,
    height: 35,
    zIndex: 999,
    margin: 1,
    backgroundColor: "#3fb6dd",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: 24,
    color: "#fff",
  },
});
