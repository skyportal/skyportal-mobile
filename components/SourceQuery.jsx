import React from "react";
import PropTypes from "prop-types";
import { ActivityIndicator } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  CheckBox,
} from "./Themed.tsx";

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
    <View
      style={{
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        width: "95%",
        height: 10,
      }}
    >
      <View
        style={{ flexDirection: "row", width: "95%", height: 10, margin: 0 }}
      >
        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10 }}>
          Filter Sources By
        </Text>
        <TextInput
          style={{
            height: 40,
            borderWidth: 1,
            marginBottom: 10,
            paddingLeft: 10,
          }}
          placeholder="ZTF24"
          value={sourceFilter}
          onChangeText={(text) => setSourceFilter(text)}
        />
        <TouchableOpacity onPress={handleSourceQuery} disabled={queryStatus}>
          {queryStatus ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text>Query</Text>
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{ flexDirection: "row", width: "95%", height: 10, margin: 0 }}
      >
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
