import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

import { GET } from "./API";

function CandidateScanning() {
  const [groups, setGroups] = useState(null);
  const navigation = useNavigation();
  const [queryStatus, setQueryStatus] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    // Show loading indicator
    setQueryStatus(true);

    // Define the API endpoint URL
    const endpoint = "groups";

    async function fetchData() {
      const response = await GET(endpoint, {});
      setGroups(response.data.all_groups);
      setQueryStatus(false);
    }

    fetchData();
  }, []);

  // Render an empty component if data is null
  if (groups === null) {
    return null; // or any other empty component you want to render
  }

  const options = groups.map((item) => ({
    label: item.name,
    value: item.id,
    key: item.id,
  }));

  // Handle item press and navigate to DetailsComponent
  const handleItemPress = () => {
    navigation.navigate("Candidate List", { groupId: selectedGroup });
  };

  const handleValueChange = (value) => {
    if (value && value !== -1) {
      setSelectedGroup(value);
    }
  };

  const currentGroup = options.find((option) => option.value === selectedGroup)
    ? options.find((option) => option.value === selectedGroup).label
    : null;

  return (
    <ScrollView>
      {!queryStatus && groups ? (
        <View>
          <Text>Select an option:</Text>
          <RNPickerSelect
            style={{
              inputAndroid: {
                color: "black",
                backgroundColor: "black",
              },
            }}
            items={options}
            placeholder={{ label: "Select your group to scan for", value: -1 }}
            onValueChange={handleValueChange}
            onDonePress={handleValueChange}
            value={selectedGroup}
            useNativeDriver
            hideDoneBar
          />
          <Text>Selected option: {currentGroup}</Text>
          <Button title="Start Scanning!" onPress={() => handleItemPress()} />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
}

export default CandidateScanning;
