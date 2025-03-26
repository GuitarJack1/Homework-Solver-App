import { View } from "@/components/Themed";
import { MATHPIX_API_KEY, MATHPIX_APP_ID } from "@/constants/SensitiveData";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

  const uploadImage = async () => {
    Alert.alert("Upload Image", "Choose an option", [
      { text: "Take a photo", onPress: takePhoto },
      { text: "Pick from gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

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
    }
  };

  const extractMathText = async (imageUri: string): Promise<void> => {
    setLoading(true);
    try {
      // Resize and compress the image
      const resizedImage = await manipulateAsync(
        imageUri,
        [{ resize: { width: 1024 } }], // Resize width to 1024px, maintaining aspect ratio
        { compress: 0.7, format: SaveFormat.JPEG } // Compress to 70% quality
      );

      // Fetch and convert the resized image to base64
      const response = await fetch(resizedImage.uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(",")[1];

        if (!base64data) {
          console.error("Failed to convert image to base64.");
          return;
        }

        // Prepare the payload for the Mathpix API
        const payload = {
          src: `data:image/jpeg;base64,${base64data}`,
          formats: ["text"],
        };

        // Send the request to Mathpix API
        const mathpixResponse = await fetch("https://api.mathpix.com/v3/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            app_id: MATHPIX_APP_ID,
            app_key: MATHPIX_API_KEY,
          },
          body: JSON.stringify(payload),
        });

        // Parse and log the extracted text
        const result = await mathpixResponse.json();

        console.log(result.text);
        setExtractedText(result.text);

        router.push({
          pathname: "/solutionModal",
          params: {
            extractedText: result.text,
          },
        });

        setLoading(false);
      };
    } catch (error) {
      console.error("Error extracting text from image:", error);
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Tab Camera</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={uploadImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.uploadText}>Upload an Image</Text>
          )}
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="white" style={styles.loader} />
        ) : null}

        <Text style={styles.uploadText}>{extractedText}</Text>

        {image && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => extractMathText(image)}
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
  uploadBox: {
    width: 200,
    height: 200,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
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
