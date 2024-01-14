import React, { useEffect, useState } from "react";
import { StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { View, Text, Button } from "../components/Themed";

const styles = StyleSheet.create({
  infoContainer: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  linkContainer: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderWidth: 0,
    borderColor: "#333",
    borderRadius: 0,
    overflow: "hidden",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    borderWidth: 0,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default function Home() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const userdata = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userdata);
      setUserData(parsedData);
    }
    fetchUserData();
  }, []);

  return (
    <View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>SkyPortal Mobile</Text>
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
      </View>
      <View style={styles.linkContainer}>
        {userData ? (
          <View>
            <Link
              push
              href={{
                pathname: "/(tabs)",
              }}
              asChild
            >
              <Button title="Continue" />
            </Link>
          </View>
        ) : (
          <View />
        )}
        <View>
          <Link
            push
            href={{
              pathname: "/login",
            }}
            asChild
          >
            <Button title="Login" />
          </Link>
        </View>
      </View>
    </View>
  );
}
