import React, { useEffect, useState } from "react";
import { Linking, FlatList, TouchableOpacity } from "react-native";
import { Text, View, Button } from "../../components/Themed";
import { Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GET } from "../../components/API";

function GcnEvents() {
  const [events, setEvents] = useState(null);
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState(null);
  const [queryStatus, setQueryStatus] = useState(false);

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
    // Show loading indicator
    setQueryStatus(true);

    // Define the API endpoint URL
    const endpoint = "gcn_event";
    const params = {
      numPerPage: 30,
      pageNumber: page,
    };

    async function fetchData() {
      const response = await GET(endpoint, params);
      setEvents(response.data.events);
      setQueryStatus(false);
    }
    fetchData();
  }, [page]);

  useEffect(() => {
    async function fetchUserData() {
      const userdata = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userdata);
      setUserData(parsedData);
    }
    fetchUserData();
  }, []);

  // Render each row of information
  const renderItem = ({ item }) => {
    const eventUrl = `${userData.url}/gcn_events/${item.dateobs}`;
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(eventUrl);
        }}
      >
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {item.dateobs}
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}
          >
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
  };

  // Render an empty component if data is null
  if (events === null || events === undefined || events.length === 0) {
    return null; // or any other empty component you want to render
  }

  const handleLoadMore = () => {
    if (!queryStatus) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View>
      <Button title="Load More" onPress={handleLoadMore} />
      {!queryStatus && events ? (
        <View>
          <FlatList
            data={events}
            keyExtractor={(item) => item.dateobs.toString()} // Use a unique key for each item
            renderItem={renderItem}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  );
}

export default GcnEvents;
