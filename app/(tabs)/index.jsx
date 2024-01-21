import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import { Link } from "expo-router";

import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
} from "../../components/Themed.tsx";

import SourceQuery from "../../components/SourceQuery";

import { ra_to_hours, dec_to_dms } from "../../components/utils/units";
import { GET } from "../../components/utils/API";
import { getItem } from "../../components/utils/storage";
import orderAndModifyThumbnailList from "../../components/utils/thumbnails";

dayjs.extend(calendar);

function Sources() {
  const [sources, setSources] = useState(null);
  const [page, setPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState("");
  const [hasSpectrum, setHasSpectrum] = useState(false);
  const [hasFollowupRequest, setHasFollowupRequest] = useState(false);
  const [sourceScreenOpen, setSourceScreenOpen] = useState(false);

  const [userData, setUserData] = useState(null);
  const [queryStatus, setQueryStatus] = useState(false);

  useEffect(() => {
    // Show loading indicator
    setQueryStatus(true);

    // Define the API endpoint URL
    const endpoint = "sources";
    // Define parameters
    const params = {
      numPerPage: 30,
      pageNumber: page,
      includeThumbnails: true,
      sourceID: sourceFilter,
      hasSpectrum,
      hasFollowupRequest,
      sortBy: "saved_at",
      sortOrder: "desc",
    };

    async function fetchData() {
      const response = await GET(endpoint, params);
      setSources(response?.data?.sources);
      setQueryStatus(false);
    }

    fetchData();
  }, [page, sourceFilter, hasSpectrum, hasFollowupRequest]);

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
      height: 150,
      overflow: "hidden",
      borderRadius: 10,
      padding: 20,
      marginTop: 10,
      marginRight: 5,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "lightgray",
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
            pathname: "/source",
            params: { id: item.id },
          }}
        >
          <View>
            <Image
              source={{ uri: thumbnail }}
              style={{ width: 80, height: 80 }}
            />
          </View>
          <View>
            <Text style={styles.itemText}>{item.id}</Text>
            <Text style={styles.itemText}>
              {dayjs().to(dayjs.utc(`${item.created_at}Z`))}
            </Text>
          </View>
          <View>
            <Text style={styles.itemText}>RA: {ra_to_hours(item.ra, ":")}</Text>
            <Text style={styles.itemText}>
              Dec: {dec_to_dms(item.dec, ":")}
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

  const toggleSourceScreen = () => {
    setSourceScreenOpen(!sourceScreenOpen);
  };

  return (
    <View>
      <SourceQuery
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        hasSpectrum={hasSpectrum}
        setHasSpectrum={setHasSpectrum}
        hasFollowupRequest={hasFollowupRequest}
        setHasFollowupRequest={setHasFollowupRequest}
        queryStatus={queryStatus}
        isOpen={sourceScreenOpen}
        onClose={toggleSourceScreen}
      />
      <TouchableOpacity onPress={handleLoadMore} disabled={queryStatus}>
        {queryStatus ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button title="Load More" onPress={handleLoadMore} />
        )}
      </TouchableOpacity>
      {!queryStatus && sources ? (
        <View>
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
