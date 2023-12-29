import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "../../components/Themed.tsx";

import { ra_to_hours, dec_to_dms } from "../../components/units";
import { GET } from "../../components/API";
import PostComment from "../../components/PostComment";

function Source() {
  const params = useLocalSearchParams();
  const { id } = params;

  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [comment, setComment] = useState(false);

  const styles = StyleSheet.create({
    itemContainer: {
      width: "80%",
      height: 600,
      overflow: "hidden",
      backgroundColor: "lightgray",
      borderRadius: 10,
      padding: 20,
      margin: 10,
    },
    itemText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    linkText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "blue",
    },
  });

  useEffect(() => {
    const endpoint = `sources/${id}`;
    // Define parameters
    const get_params = {
      includeThumbnails: true,
      includeComments: true,
      includeDetectionStats: true,
    };

    async function fetchData() {
      const response = await GET(endpoint, get_params);
      setData(response.data);
    }

    fetchData();
    setComment(false);
  }, [comment, id]);

  useEffect(() => {
    async function fetchUserData() {
      const userdata = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userdata);
      setUserData(parsedData);
    }
    fetchUserData();
  }, []);

  // Render an empty component if data is null
  if (data === null) {
    return null; // or any other empty component you want to render
  }

  const sourceUrl = `${userData.url}/sources/${id}`;

  return (
    <ScrollView style={styles.itemContainer}>
      <Stack.Screen options={{ headerShown: true, title: id }} />
      {!data ? (
        <View style={{ marginTop: 20 }}>
          <Text>No data available.</Text>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(sourceUrl);
            }}
          >
            <Text style={styles.linkText}>{data.id}</Text>
          </TouchableOpacity>

          <Text style={styles.itemText}>RA: {ra_to_hours(data.ra)}</Text>
          <Text style={styles.itemText}>Dec: {dec_to_dms(data.dec)}</Text>

          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "bold" }}>
            Images:
          </Text>
          <ScrollView horizontal>
            {data.thumbnails?.map((thumbnail) => (
              <Image
                key={thumbnail.id}
                source={{ uri: thumbnail.public_url }}
                style={{ width: 200, height: 200, marginRight: 10 }}
              />
            ))}
          </ScrollView>

          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "bold" }}>
            Classifications:
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}
          >
            {data.classifications?.map((classification) => (
              <View
                key={classification.id}
                style={{
                  padding: 5,
                  margin: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "black" }}>
                  {classification.author_name} : {classification.classification}
                </Text>
              </View>
            ))}
          </View>

          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "bold" }}>
            Comments:
          </Text>
          <View style={{ marginTop: 5 }}>
            {data.comments?.map((thisComment) => (
              <View
                style={{ flexDirection: "row", alignItems: "center" }}
                key={thisComment.id}
              >
                <Image
                  source={{ uri: thisComment.author?.gravatar_url }}
                  style={{ width: 30, height: 30, borderRadius: 10 }}
                />
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {thisComment.author?.username}
                </Text>
                <Text style={{ marginRight: 60, marginLeft: 15 }}>
                  {thisComment.text}
                </Text>
              </View>
            ))}
          </View>
          <PostComment sourceId={data.id} setComment={setComment} />
        </View>
      )}
    </ScrollView>
  );
}

export default Source;
