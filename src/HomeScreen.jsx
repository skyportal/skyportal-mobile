import React from "react";
import { View, Button, StyleSheet } from "react-native";

import { useNavigation } from "@react-navigation/native";

function HomeScreen() {
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Button
        title="Let's look at sources!"
        onPress={() => navigation.navigate("Sources")}
      />
      <Button
        title="Let's look at candidates!"
        onPress={() => navigation.navigate("Candidate Scanning")}
      />
      <Button
        title="Let's look at GCN Events!"
        onPress={() => navigation.navigate("GCN Events")}
      />
    </View>
  );
}

export default HomeScreen;
