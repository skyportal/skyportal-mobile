import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { Text, View, Button } from "../../components/Themed";
import RNPickerSelect from "react-native-picker-select";

import { GET } from "../../components/API";

function Candidates() {
  const [groups, setGroups] = useState(null);
  const [queryStatus, setQueryStatus] = useState(false);
  const [selectedScanGroup, setSelectedScanGroup] = useState(null);
  const [selectedSaveGroup, setSelectedSaveGroup] = useState(null);
  const [selectedRejectGroup, setSelectedRejectGroup] = useState(null);

  useEffect(() => {
    // Show loading indicator
    setQueryStatus(true);

    // Define the API endpoint URL
    const endpoint = "groups";

    async function fetchData() {
      const response = await GET(endpoint, {});
      setGroups(response.data.all_groups);
      setQueryStatus(false);
      setSelectedScanGroup(response.data.all_groups[0].id);
      setSelectedSaveGroup(response.data.all_groups[0].id);
      setSelectedRejectGroup(response.data.all_groups[0].id);
    }

    fetchData();
  }, []);

  // Render an empty component if data is null
  if ((groups === null) | (selectedScanGroup === null)) {
    return null; // or any other empty component you want to render
  }

  const options = groups.map((item) => ({
    label: item.name,
    value: item.id,
    key: item.id,
  }));

  const handleScanChange = (value) => {
    if (value && value !== -1) {
      setSelectedScanGroup(value);
    }
  };

  const handleSaveChange = (value) => {
    if (value && value !== -1) {
      setSelectedSaveGroup(value);
    }
  };

  const handleRejectChange = (value) => {
    if (value && value !== -1) {
      setSelectedRejectGroup(value);
    }
  };

  const picker_style = {
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
  };

  return (
    <View>
      {!queryStatus && groups ? (
        <View>
          <Text>Group to scan for:</Text>
          <RNPickerSelect
            style={picker_style}
            items={options}
            onValueChange={handleScanChange}
            value={selectedScanGroup}
            useNativeAndroidPickerStyle={false}
            hideDoneBar
          />
          <Text>{selectedScanGroup}</Text>

          <Text>Group to save candidate to:</Text>
          <RNPickerSelect
            style={picker_style}
            items={options}
            onValueChange={handleSaveChange}
            value={selectedSaveGroup}
            useNativeAndroidPickerStyle={false}
            hideDoneBar
          />
          <Text>{selectedSaveGroup}</Text>

          <Text>Group to saved rejected candidates to:</Text>
          <RNPickerSelect
            style={picker_style}
            items={options}
            onValueChange={handleRejectChange}
            value={selectedRejectGroup}
            useNativeAndroidPickerStyle={false}
            hideDoneBar
          />
          <Text>{selectedRejectGroup}</Text>

          <Link
            push
            href={{
              pathname: "/(tabs)/candidate",
              params: {
                id: selectedScanGroup,
                save: selectedSaveGroup,
                reject: selectedRejectGroup,
              },
            }}
            asChild
          >
            <Button title="Let's do some scanning!" />
          </Link>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

export default Candidates;
