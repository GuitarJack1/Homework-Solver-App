import { View } from "@/components/Themed";
import { MATHPIX_API_KEY, MATHPIX_APP_ID } from "@/constants/SensitiveData";
import { Ionicons } from "@expo/vector-icons";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function TabCameraScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [extractedText, setExtractedText] = useState<string>("");

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
    <View style={styles.overallContainer}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/camera_page_badge_dark.png")}
          style={styles.topImage}
        />
        <Text style={styles.uploadTitle}>Upload Image</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={uploadImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Ionicons name="cloud-upload-outline" size={50} color="#00114D" />
          )}
        </TouchableOpacity>

        {image && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => extractMathText(image)}
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
        )}
        <Image
          source={require("@/assets/images/bottom_ui_piece.png")}
          style={styles.bottomImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    top: 50,
    height: 320,
    position: "absolute",
  },
  bottomImage: {
    width: 100,
    height: 20,
    position: "absolute",
    bottom: 95,
  },
  uploadTitle: {
    fontSize: 30,
    color: "#6ecef2",
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 240,
  },
  uploadBox: {
    width: 280,
    height: 180,
    backgroundColor: "#C4E2FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 4,
    borderColor: "#3fb6dd",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  loader: {},
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
    fontWeight: "bold",
  },
});
