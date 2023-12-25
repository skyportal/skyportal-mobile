import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";

function SourceQuery({ handleApiCall, queryStatus }) {
  const [sourceFilter, setSourceFilter] = useState("");

  const handleSourceQuery = async () => {
    if (sourceFilter.trim() === "") {
      Alert.alert("Error", "Please enter a valid source/ID query");
      return;
    }

    try {
      // Trigger the API call
      await handleApiCall(sourceFilter);
    } catch (error) {
      Alert.alert("Error", `An error occurred during the API call: ${error}`);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Filter Sources By
      </Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
        }}
        placeholder="ZTF23"
        value={sourceFilter}
        onChangeText={(text) => setSourceFilter(text)}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#007BFF",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
        onPress={handleSourceQuery}
        disabled={queryStatus} // Disable the button while loading
      >
        {queryStatus ? (
          <ActivityIndicator
            size="small"
            color="#ffffff"
            style={{ marginRight: 10 }}
          />
        ) : (
          <Text style={{ color: "#ffffff" }}>Make Source Query</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

SourceQuery.propTypes = {
  handleApiCall: PropTypes.func.isRequired,
  queryStatus: PropTypes.bool.isRequired,
};

export default SourceQuery;
