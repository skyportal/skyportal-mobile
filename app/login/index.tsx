import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";

import {
  RNPickerSelect,
  Text,
  TextInput,
  View,
  Button,
} from "../../components/Themed.tsx";

import { getItem, setItem } from "../../components/storage";
import QRScanner from "../../components/QRScanner";
import PopupMessage from "../../components/PopupMessage";

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

function Login() {
  const [userData, setUserData] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [url, setUrl] = useState("https://fritz.science");
  const [dataSaved, setDataSaved] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const saveData = async () => {
    // Save user inputs
    const dataToSave = {
      token: textInput,
      url,
    };
    await setItem("userData", JSON.stringify(dataToSave));

    setShowModal(true);
    setModalMessage("Successfully saved login!");
    setDataSaved(true);
  };

  useEffect(() => {
    async function fetchUserData() {
      const userdata = await getItem("userData");
      const parsedData = JSON.parse(userdata);
      setUserData(parsedData);
    }
    fetchUserData();
  }, [dataSaved]);

  return (
    <View style={styles.container}>
      <View />
      <Text style={styles.title}>Selected URL: {url}</Text>
      <RNPickerSelect
        onValueChange={(value) => setUrl(value)}
        items={[
          { label: "fritz", value: "https://fritz.science" },
          { label: "icare", value: "https://skyportal-icare.ijclab.in2p3.fr" },
        ]}
        placeholder={{ label: "Select your SkyPortal instance", value: null }}
        useNativeAndroidPickerStyle={false}
        hideDoneBar
      />
      <TextInput
        placeholder="Enter your token here"
        value={textInput}
        onChangeText={(text) => setTextInput(text)}
      />
      <QRScanner setTextInput={setTextInput} />
      <Button title="Save Login" onPress={saveData} />
      <PopupMessage
        visible={showModal}
        message={modalMessage}
        onClose={closeModal}
      />
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
      <View />
    </View>
  );
}

export default Login;
