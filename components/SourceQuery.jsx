import React from "react";
import PropTypes from "prop-types";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { CheckBox } from "@rneui/themed";

function SourceQuery({
  sourceFilter,
  setSourceFilter,
  hasSpectrum,
  setHasSpectrum,
  hasFollowupRequest,
  setHasFollowupRequest,
  queryStatus,
}) {
  const handleSourceQuery = async () => {
    setSourceFilter(sourceFilter);
  };

  const handleSpectrumCheckboxToggle = () => {
    setHasSpectrum(!hasSpectrum);
  };

  const handleFollowupRequestCheckboxToggle = () => {
    setHasFollowupRequest(!hasFollowupRequest);
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
      <View style={{ flexDirection: "row" }}>
        <CheckBox
          title="Spectrum?"
          checked={hasSpectrum}
          onPress={handleSpectrumCheckboxToggle}
        />
        <CheckBox
          title="Followup Request?"
          checked={hasFollowupRequest}
          onPress={handleFollowupRequestCheckboxToggle}
        />
      </View>
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
        disabled={queryStatus}
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
  sourceFilter: PropTypes.string.isRequired,
  setSourceFilter: PropTypes.func.isRequired,
  hasSpectrum: PropTypes.bool.isRequired,
  setHasSpectrum: PropTypes.func.isRequired,
  hasFollowupRequest: PropTypes.bool.isRequired,
  setHasFollowupRequest: PropTypes.func.isRequired,
  queryStatus: PropTypes.bool.isRequired,
};

export default SourceQuery;
