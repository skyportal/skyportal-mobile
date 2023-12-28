import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { Text, View, Button } from "../../components/Themed";
import RNPickerSelect from "react-native-picker-select";

import { GET } from "../../components/API";

function Candidates() {
  const [groups, setGroups] = useState(null);
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
      setSelectedGroup(response.data.all_groups[0].id);
    }

    fetchData();
  }, []);

  // Render an empty component if data is null
  if ((groups === null) | (selectedGroup === null)) {
    return null; // or any other empty component you want to render
  }

  const options = groups.map((item) => ({
    label: item.name,
    value: item.id,
    key: item.id,
  }));

  const handleValueChange = (value) => {
    if (value && value !== -1) {
      setSelectedGroup(value);
    }
  };

  return (
    <View>
      {!queryStatus && groups ? (
        <View>
          <Text>Select an option:</Text>
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
            items={options}
            onValueChange={handleValueChange}
            value={selectedGroup}
            useNativeAndroidPickerStyle={false}
            hideDoneBar
          />
          <Link
            push
            href={{
              pathname: "/candidate/[id]",
              params: { id: selectedGroup },
            }}
          >
            <Text>{selectedGroup}</Text>
          </Link>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

export default Candidates;
