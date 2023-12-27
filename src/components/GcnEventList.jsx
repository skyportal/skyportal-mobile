import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Chip } from "react-native-paper";

import { GET } from "../API";

function GcnEventList() {
  const [events, setEvents] = useState(null);

  const gcnTags = {
    BNS: "#468847",
    NSBH: "#b94a48",
    BBH: "#333333",
    GRB: "#f89406",
    AMON: "#3a87ad",
    Significant: "#8B008B",
    retracted: "#ffffff",
  };

  useEffect(() => {
    // Define the API endpoint URL
    const endpoint = "gcn_event";
    async function fetchData() {
      const response = await GET(endpoint, {});
      setEvents(response.data.events);
    }
    fetchData();
  }, []);

  // Render each row of information
  const renderItem = ({ item }) => (
    <TouchableOpacity>
      <View
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.dateobs}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
          {item.tags?.map((tag) => (
            <View
              key={tag}
              style={{
                padding: 5,
                margin: 5,
                borderRadius: 5,
              }}
            >
              <Chip mode="outlined" selectedColor={gcnTags[tag]}>
                {tag}
              </Chip>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render an empty component if data is null
  if (events === null || events.length === 0) {
    return null; // or any other empty component you want to render
  }

  return (
    <View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.dateobs.toString()} // Use a unique key for each item
        renderItem={renderItem}
      />
    </View>
  );
}

export default GcnEventList;
