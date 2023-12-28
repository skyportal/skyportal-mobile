import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import { Text, View, Button } from "./Themed.tsx";

import PopupMessage from "./PopupMessage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

function Login() {
  const [textInput, setTextInput] = useState("");
  const [url, setUrl] = useState("https://fritz.science");

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const saveData = async () => {
    // Save user inputs to AsyncStorage
    const dataToSave = {
      token: textInput,
      url,
    };
    await AsyncStorage.setItem("userData", JSON.stringify(dataToSave));

    setShowModal(true);
    setModalMessage("Successfully saved login!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected URL: {url}</Text>
      <RNPickerSelect
        style={{
          inputAndroid: {
            color: "black",
            backgroundColor: "transparent",
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderColor: "purple",
            borderRadius: 8,
            paddingRight: 30,
          },
        }}
        onValueChange={(value) => setUrl(value)}
        items={[
          { label: "fritz", value: "https://fritz.science" },
          { label: "icare", value: "https://skyportal-icare.ijclab.in2p3.fr" },
        ]}
        placeholder={{}}
        useNativeAndroidPickerStyle={false}
        hideDoneBar
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
        }}
        placeholder="Enter your token here"
        value={textInput}
        onChangeText={(text) => setTextInput(text)}
      />

      <Button title="Login" onPress={saveData} />

      <PopupMessage
        visible={showModal}
        message={modalMessage}
        onClose={closeModal}
      />
    </View>
  );
}

export default Login;
