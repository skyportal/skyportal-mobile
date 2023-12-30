import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Image } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { Text, View } from "../../components/Themed.tsx";

import { ra_to_hours, dec_to_dms } from "../../components/units";
import { GET } from "../../components/API";
import SourceQuery from "../../components/SourceQuery";
import orderAndModifyThumbnailList from "../../components/thumbnails";

dayjs.extend(calendar);

function Sources() {
  const [sources, setSources] = useState(null);
  const [userData, setUserData] = useState(null);
  const [queryStatus, setQueryStatus] = useState(false);

  const handleApiCall = (sourceFilter) => {
    // Show loading indicator
    setQueryStatus(true);

    // Define the API endpoint URL
    const endpoint = "sources";
    // Define parameters
    const params = {
      numPerPage: 10,
      includeThumbnails: true,
      includeComments: true,
      includeDetectionStats: true,
      sourceID: sourceFilter,
      sortBy: "saved_at",
      sort_order: "asc",
      // Add any other parameters as needed
    };

    async function fetchData() {
      const response = await GET(endpoint, params);
      setSources(response.data.sources);
      setQueryStatus(false);
    }

    fetchData();
  };

  useEffect(() => {
    async function fetchUserData() {
      const userdata = await AsyncStorage.getItem("userData");
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
      margin: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    itemText: {
      fontSize: 12,
      fontWeight: "bold",
    },
    linkText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "blue",
    },
  });

  // Render each row of information
  const renderItem = ({ item }) => {
    const { thumbnails } = item;
    const orderedThumbnails = orderAndModifyThumbnailList(thumbnails, userData);
    const thumbnail = orderedThumbnails[0].public_url;

    return (
      <View style={styles.itemContainer}>
        <Link
          push
          href={{
            pathname: "/(tabs)/source",
            params: { id: item.id },
          }}
        >
          <View style={{ backgroundColor: "lightgray", marginRight: 5 }}>
            <Image
              source={{ uri: thumbnail }}
              style={{ width: 80, height: 80 }}
            />
          </View>
          <View style={{ backgroundColor: "lightgray", marginRight: 5 }}>
            <Text style={styles.linkText}>{item.id}</Text>
            <Text style={styles.itemText}>RA: {ra_to_hours(item.ra)}</Text>
            <Text style={styles.itemText}>Dec: {dec_to_dms(item.dec)}</Text>
          </View>
          <View
            style={{
              backgroundColor: "lightgray",
              marginTop: 10,
              marginRight: 10,
            }}
          >
            <Text style={styles.itemText}>
              {dayjs().to(dayjs.utc(`${item.created_at}Z`))}
            </Text>
          </View>
        </Link>
      </View>
    );
  };

  return (
    <View>
      <SourceQuery handleApiCall={handleApiCall} queryStatus={queryStatus} />
      {!queryStatus && sources ? (
        <View>
          {/* Use FlatList to render the list */}
          <FlatList
            data={sources}
            keyExtractor={(item) => item.id.toString()} // Use a unique key for each item
            renderItem={renderItem}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  );
}

export default Sources;
