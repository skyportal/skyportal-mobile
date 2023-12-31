import React, { useEffect, useState } from "react";
import { StyleSheet, Linking, FlatList, TouchableOpacity } from "react-native";
import { Text, View, Button } from "../../components/Themed";
import { Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";

import { GET } from "../../components/API";

function GcnEvents() {
  const [events, setEvents] = useState(null);
  const [tags, setTags] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
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
    // Define the API endpoint URL
    const endpoint = "gcn_event/tags";
    async function fetchTags() {
      const response = await GET(endpoint, {});
      setTags(response.data);
      setQueryStatus(false);
    }
    fetchTags();
  }, []);

  useEffect(() => {
    // Show loading indicator
    setQueryStatus(true);

    // Define the API endpoint URL
    const endpoint = "gcn_event";
    const params = {
      numPerPage: 30,
      pageNumber: page,
      gcnTagKeep: selectedTag,
    };

    async function fetchData() {
      const response = await GET(endpoint, params);
      setEvents(response.data.events);
      setQueryStatus(false);
    }
    fetchData();
  }, [page, selectedTag]);

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

  // Render an empty component if data is null
  if (events === null || events === undefined || events.length === 0) {
    return null; // or any other empty component you want to render
  }

  const options = tags.sort().map((item) => ({
    label: item,
    value: item,
    key: item,
  }));

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
    },
    text: {
      marginHorizontal: 10, // Adjust the margin between Text components
      fontSize: 16,
    },
  });

  const handleTagChange = (value) => {
    if (value && value !== -1) {
      setSelectedTag(value);
    }
  };

  const handleLoadMore = () => {
    if (!queryStatus) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text}>Tag to filter by:</Text>
        <RNPickerSelect
          style={picker_style}
          items={options}
          onValueChange={handleTagChange}
          value={selectedTag}
          useNativeAndroidPickerStyle={false}
          hideDoneBar
        />
        <Text style={styles.text}>{selectedTag}</Text>
      </View>
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
