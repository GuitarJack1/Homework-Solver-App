import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle}>
        <Image
          source={require("../../assets/shield.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.appName1}>THE</Text>
      <Text style={styles.appName1}>HOMEWORK</Text>
      <Text style={styles.appName2}>SOLVER</Text>
      <Text style={styles.description}>
        Experience the ease of getting all your problems solved with built-in
        image reading and manual input functions.
      </Text>
      <View style={styles.paginationContainer}>
        <View style={[styles.paginationDot, styles.activeDot]} />
        <View style={styles.paginationDot} />
        <View style={styles.paginationDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1523",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundCircle: {
    width: 400,
    height: 350,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    top: -40,
  },
  logo: {
    width: 350,
    height: 350,
    borderRadius: 200,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    lineHeight: 36,
    fontFamily: "Montserrat",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: "center",
    top: -40,
  },
  appName1: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4DA8DA",
    textAlign: "center",
    fontFamily: "Montserrat",
    top: -40,
  },
  appName2: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4DA8DA",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Montserrat",
    top: -40,
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
    lineHeight: 24,
    fontFamily: "Montserrat",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    top: -40,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4DA8DA",
    marginHorizontal: 4,
    opacity: 0.5,
    top: -10,
  },
  activeDot: {
    opacity: 1,
    width: 40,
    height: 10,
    top: -10,
  },
});
