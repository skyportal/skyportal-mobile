import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, FlatList } from "react-native";
import { Link } from "expo-router";
import { TagCloud } from "react-tagcloud/rn";

import {
  Text,
  View,
  Button,
  RNPickerSelect,
  TouchableOpacity,
} from "../../components/Themed";
import { Chip } from "react-native-paper";

import { GET } from "../../components/utils/API";
import { getItem } from "../../components/utils/storage";

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
    Gold: "#FFD700",
    Bronze: "#CD7F32",
    Subthreshold: "#808080",
    retracted: "#ffffff",
  };
  const ignoredTags = [
    "GW",
    "LVC",
    "MultiInstrument",
    "pycbc",
    "gstlal",
    "spiir",
    "MBTA",
    "AllSky",
    "< 1 per year",
    "< 1 per 100 years",
  ];

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
      const userdata = await getItem("userData");
      const parsedData = JSON.parse(userdata);
      setUserData(parsedData);
    }
    fetchUserData();
  }, []);

  const styles = StyleSheet.create({
    itemContainer: {
      width: "95%",
      height: 100,
      overflow: "hidden",
      backgroundColor: "lightgray",
      borderRadius: 10,
      padding: 20,
      marginTop: 10,
      marginRight: 5,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    text: {
      fontSize: 12,
      fontWeight: "bold",
    },
    linkText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "blue",
    },
  });

  const customRenderer = (tag, size, color) => {
    return (
      <Text
        key={tag.value}
        style={{
          fontSize: size,
          margin: 1,
          padding: 1,
          color: gcnTags[tag.value] ? gcnTags[tag.value] : color,
        }}
      >
        {tag.value}
      </Text>
    );
  };

  // Render each row of information
  const renderItem = ({ item }) => {
    const eventUrl = `${userData.url}/gcn_events/${item.dateobs}`;
    const tags = item.tags
      .filter((value) => !ignoredTags.includes(value))
      .map((value) => ({ value, count: 1 }));

    return (
      <ScrollView style={styles.itemContainer}>
        <Link
          push
          href={{
            pathname: "/gcn_event",
            params: { dateobs: item.dateobs },
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {item.dateobs}
            </Text>
          </View>
          <View style={{ width: 120, height: 60 }}>
            <TagCloud
              minSize={15}
              maxSize={15}
              tags={tags}
              shuffle={false}
              renderer={customRenderer}
            />
          </View>
        </Link>
      </ScrollView>
    );
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
      <View style={{ flex: 0.25 }}>
        <Text style={styles.text}>Tag to filter by:</Text>
        <RNPickerSelect
          items={options}
          onValueChange={handleTagChange}
          value={selectedTag}
          useNativeAndroidPickerStyle={false}
          hideDoneBar
        />
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
