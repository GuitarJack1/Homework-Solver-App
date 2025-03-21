import { View } from "@/components/Themed";
import { GOOGLE_CLOUD_VISION_API_KEY } from "@/constants/SensitiveData";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function TabCameraScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      //extractText(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      //extractText(result.assets[0].uri);
    }
  };

  const extractText = async (imageUri: string) => {
    setLoading(true);
    setExtractedText("");
    try {
      const base64Image = await convertImageToBase64(imageUri);
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requests: [
              {
                image: { content: base64Image },
                features: [{ type: "TEXT_DETECTION" }],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      setExtractedText(
        data.responses[0]?.fullTextAnnotation?.text || "No text detected"
      );

      router.push({
        pathname: "/solutionModal",
        params: {
          extractedText:
            data.responses[0]?.fullTextAnnotation?.text || "No text detected",
        },
      });
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText("Failed to extract text");
    }
    setLoading(false);
  };

  const convertImageToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve(reader.result?.toString().split(",")[1] || "");
      reader.readAsDataURL(blob);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Tab Camera</Text>
        <Button title="Pick an image from gallery" onPress={pickImage} />
        <Button title="Take a photo" onPress={takePhoto} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {loading ? (
          <ActivityIndicator size="large" color="white" style={styles.loader} />
        ) : null}
        {image && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => extractText(image)}
          >
            <Text style={styles.buttonText}>View Solution</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "white",
  },
  loader: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
