import { useState } from "react";
import { StyleSheet, Image, Button, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { View } from "@/components/Themed";

const GOOGLE_CLOUD_VISION_API_KEY = "YOUR_API_KEY_HERE";

export default function TabCameraScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");

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
      extractText(result.assets[0].uri);
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
      extractText(result.assets[0].uri);
    }
  };

  const extractText = async (imageUri: string) => {
    try {
      const base64Image = await convertImageToBase64(imageUri);
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requests: [{
              image: { content: base64Image },
              features: [{ type: "TEXT_DETECTION" }],
            }],
          }),
        }
      );
      const data = await response.json();
      setExtractedText(data.responses[0]?.fullTextAnnotation?.text || "No text detected");
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText("Failed to extract text");
    }
  };

  const convertImageToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result?.toString().split(",")[1] || "");
      reader.readAsDataURL(blob);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Camera</Text>
      <Button title="Pick an image from gallery" onPress={pickImage} />
      <Button title="Take a photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {extractedText ? <Text style={styles.text}>{extractedText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  },
});