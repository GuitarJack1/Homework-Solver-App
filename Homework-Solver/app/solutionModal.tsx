import { findSolution, processInput } from "@/components/functions/getSolution";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ModalScreen() {
  const { extractedText } = useLocalSearchParams<{ extractedText?: string }>();
  const [input, setInput] = useState<string | null>(null);
  const [solution, setSolution] = useState<any>({
    success: false,
    pods: [null],
  });

  useEffect(() => {
    const solve = async () => {
      if (extractedText) {
        const processed = processInput(extractedText);
        setInput(processed);
        const result = await findSolution(processed);
        setSolution(result);
      }
    };

    solve();
  }, [extractedText]);

  return (
    <View style={styles.modalView}>
      <Text style={styles.text}>
        {extractedText ? "Input: " + input : "Something went wrong"}
      </Text>
      <ScrollView>
        {solution.success &&
          solution["pods"].map((pod: any, index: number) => {
            return (
              <View
                key={index}
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Text style={styles.text}>{pod.title}</Text>
                <Image
                  src={pod.subpods[0].img.src}
                  style={{
                    width: pod.subpods[0].img.width,
                    height: pod.subpods[0].img.height,
                    alignSelf: "center",
                  }}
                />
              </View>
            );
          })}
      </ScrollView>
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
