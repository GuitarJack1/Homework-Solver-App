import {
  findSolution,
  processInput,
  processSolution,
} from "@/components/functions/getSolution";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ModalScreen() {
  let { extractedText } = useLocalSearchParams<{ extractedText?: string }>();
  const [solution, setSolution] = useState<string>("");
  let [input, setInput] = useState<string>("");

  if (extractedText) {
    let tempInput = processInput(extractedText);
    setInput(tempInput);
    setSolution(processSolution(findSolution(tempInput)));
  }

  return (
    <View style={styles.modalView}>
      <Text style={styles.text}>
        {extractedText ? "Input: " + input : "Something went wrong"}
      </Text>
      <Text style={styles.text}>
        {extractedText ? "Solution: " + solution : "Something went wrong"}
      </Text>
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
