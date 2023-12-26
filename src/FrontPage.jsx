import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";

function FrontPage() {
  const navigation = useNavigation();
  const [textInput, setTextInput] = useState("");
  const [url, setUrl] = useState("");
  const [savedData, setSavedData] = useState("");

  const pickerSelectStyles = {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 4,
      color: "black",
      paddingRight: 30,
      backgroundColor: "gray",
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: "purple",
      borderRadius: 8,
      color: "black",
      paddingRight: 30,
      backgroundColor: "gray",
    },
    useNativeAndroidPickerStyle: false,
  };

  const saveData = async () => {
    // Save user inputs to AsyncStorage
    const dataToSave = {
      token: textInput,
      url,
    };
    await AsyncStorage.setItem("userData", JSON.stringify(dataToSave));

    // Update the savedData state for immediate display
    setSavedData(textInput);

    // Navigate to another screen or perform other actions if needed
    navigation.navigate("Home");
  };

  return (
    <View>
      <Text>Selected URL: {url}</Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setUrl(value)}
        items={[
          { label: "fritz", value: "https://fritz.science" },
          { label: "icare", value: "https://skyportal-icare.ijclab.in2p3.fr" },
        ]}
        placeholder={{ label: "Select an option", value: null }}
      />
      <Button title="Clear Selection" onPress={() => setUrl(null)} />

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

      <Button title="Save Data" onPress={saveData} />

      {savedData && (
        <View style={{ marginTop: 20 }}>
          <Text>Saved Data: {savedData}</Text>
        </View>
      )}
    </View>
  );
}

export default FrontPage;
