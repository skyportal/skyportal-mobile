import React, { useState } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import { Link } from "expo-router";

import { GET } from "../../components/API";
import SourceQuery from "../../components/SourceQuery";

function Sources() {
  const [sources, setSources] = useState(null);
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

  // Render each row of information
  const renderItem = ({ item }) => {
    const thumbnail_order = ["new", "ref", "sub", "sdss", "ls", "ps1"];
    const { thumbnails } = item;
    thumbnails?.sort((a, b) =>
      thumbnail_order.indexOf(a.type) < thumbnail_order.indexOf(b.type) ? -1 : 1
    );

    return (
      <View>
        <Link
          push
          href={{
            pathname: "/(tabs)/source",
            params: { id: item.id },
          }}
        >
          <Text>{item.id}</Text>
          <Image
            source={{ uri: thumbnails[0].public_url }}
            style={{ width: 200, height: 200, marginTop: 5 }}
          />
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
        <Text>Loading...</Text>
      )}
    </View>
  );
}

export default Sources;
