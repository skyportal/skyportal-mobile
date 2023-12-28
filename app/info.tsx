import { Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SkyPortal</Text>
      <View style={styles.iconContainer}>
        <Image
          source={require("../assets/images/icon-medium.png")}
          style={styles.icon}
          resizeMode="stretch"
        />
      </View>
      <Text style={styles.infoText}>
        Welcome to SkyPortal Mobile: An Astronomical Data Platform.
      </Text>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 150, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    borderWidth: 1, // Optional: Add a border for better visibility
    borderColor: "#333",
    borderRadius: 2, // Optional: Add border radius for a rounded look
    overflow: "hidden", // Ensure the image stays within the container
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
