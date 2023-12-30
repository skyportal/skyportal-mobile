import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Image } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { Text, View, Button } from "../../components/Themed.tsx";

import { ra_to_hours, dec_to_dms } from "../../components/units";
import { GET } from "../../components/API";
import SourceQuery from "../../components/SourceQuery";
import orderAndModifyThumbnailList from "../../components/thumbnails";

dayjs.extend(calendar);

function Sources() {
  const [sources, setSources] = useState(null);
  const [page, setPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState("");
  const [userData, setUserData] = useState(null);
  const [queryStatus, setQueryStatus] = useState(false);

  useEffect(() => {
    // Show loading indicator
    setQueryStatus(true);

    // Define the API endpoint URL
    const endpoint = "sources";
    // Define parameters
    const params = {
      numPerPage: 10,
      pageNumber: page,
      includeThumbnails: true,
      sourceID: sourceFilter,
      sortBy: "saved_at",
      sort_order: "desc",
    };

    async function fetchData() {
      const response = await GET(endpoint, params);
      setSources(response.data.sources);
      setQueryStatus(false);
    }

    fetchData();
  }, [page, sourceFilter]);

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
      marginTop: 10,
      marginRight: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    itemText: {
      fontSize: 12,
      fontWeight: "bold",
      backgroundColor: "lightgray",
    },
    linkText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "blue",
      backgroundColor: "lightgray",
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
          <View>
            <Image
              source={{ uri: thumbnail }}
              style={{ width: 80, height: 80 }}
            />
          </View>
          <View style={{ backgroundColor: "lightgray" }}>
            <Text style={styles.linkText}>{item.id}</Text>
            <Text style={styles.itemText}>RA: {ra_to_hours(item.ra)}</Text>
            <Text style={styles.itemText}>Dec: {dec_to_dms(item.dec)}</Text>
          </View>
          <View>
            <Text style={styles.itemText}>
              {dayjs().to(dayjs.utc(`${item.created_at}Z`))}
            </Text>
          </View>
        </Link>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (!queryStatus) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View>
      <SourceQuery
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        queryStatus={queryStatus}
      />
      <Button title="Load More" onPress={handleLoadMore} />
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
