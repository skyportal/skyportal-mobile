import React from "react";
import PropTypes from "prop-types";
import { Text, TextInput, View, CheckBox } from "./Themed.tsx";

function SourceQuery({
  sourceFilter,
  setSourceFilter,
  hasSpectrum,
  setHasSpectrum,
  hasFollowupRequest,
  setHasFollowupRequest,
}) {
  const handleSpectrumCheckboxToggle = () => {
    setHasSpectrum(!hasSpectrum);
  };

  const handleFollowupRequestCheckboxToggle = () => {
    setHasFollowupRequest(!hasFollowupRequest);
  };

  return (
    <View
      style={{
        flex: 0.25,
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
};

export default SourceQuery;
