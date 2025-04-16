import { findSolution, processInput } from "@/components/functions/getSolution";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ModalScreen() {
  const { extractedText } = useLocalSearchParams<{ extractedText?: string }>();
  const [input, setInput] = useState<string | null>(null);
  const [solution, setSolution] = useState<any>({
    success: false,
    pods: [],
  });
  const [exitLoading, setExitLoading] = useState(false);

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

  const getPodByTitle = (title: string) => {
    return solution.pods.find((pod: any) =>
      pod.title?.toLowerCase().includes(title.toLowerCase())
    );
  };

  const renderPod = (label: string, keyword: string) => {
    const pod = getPodByTitle(keyword);
    const imageSrc = pod?.subpods?.[0]?.img?.src || "";
    const isBlurry = imageSrc.includes("blur");
    if (!pod || isBlurry) {
      return (
        <View style={styles.section}>
          <Text style={styles.label}>{label}:</Text>
          <Text style={styles.notAvailable}>Not available</Text>
        </View>
      );
    }

    const imageWidth = width * 0.8;
    const aspectRatio = pod.subpods[0].img.width / pod.subpods[0].img.height;

    return (
      <View style={styles.section}>
        <Text style={styles.label}>{label}:</Text>
        <View
          style={[
            styles.imageBorderWrapper,
            { width: imageWidth, height: imageWidth / aspectRatio },
          ]}
        >
          <Image
            source={{ uri: imageSrc }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  };

  const handleExit = () => {
    setExitLoading(true);
    setTimeout(() => {
      router.back();
      setExitLoading(false);
    }, 800); // Quick UX delay for smoothness
  };

  return (
    <View style={styles.modalContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentBox}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Input:</Text>
            <Text style={styles.inputText}>{input || "No input provided"}</Text>
          </View>

          {renderPod("Plot", "plot")}
          {renderPod("Alternate form", "alternate form")}
          {renderPod("Number Line", "number line")}
          {renderPod("Solution", "solution")}

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.exitButton}
              onPress={handleExit}
              disabled={exitLoading}
            >
              {exitLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.exitButtonText}>EXIT</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#0F1B2B",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentBox: {
    width: "100%",
    backgroundColor: "#DCEFF5",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#0F1B2B55",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F1B2B",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Montserrat",
  },
  inputText: {
    fontSize: 16,
    color: "#0F1B2B",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Montserrat",
  },
  notAvailable: {
    fontSize: 15,
    color: "#0F1B2B99",
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
    fontFamily: "Montserrat",
  },
  section: {
    alignItems: "center",
    width: "100%",
    marginBottom: 18,
  },
  imageBorderWrapper: {
    borderWidth: 1,
    borderColor: "#3fb6dd",
    borderRadius: 10,
    marginTop: 8,
    overflow: "hidden",
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  exitButton: {
    width: "80%",
    backgroundColor: "#004E89",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  exitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
});
