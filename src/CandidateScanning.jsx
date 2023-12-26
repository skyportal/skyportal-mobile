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

  return (
    <ScrollView>
      {!queryStatus && groups ? (
        <View>
          <Text>Select an option:</Text>
          <RNPickerSelect
            items={options}
            onValueChange={(value) => setSelectedGroup(value)}
            value={selectedGroup}
            hideDoneBar
          />
          <Text>Selected option: {selectedGroup}</Text>
          <Button title="Start Scanning!" onPress={() => handleItemPress()} />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
}

export default CandidateScanning;
