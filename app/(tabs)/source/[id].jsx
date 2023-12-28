import React, { useEffect, useState } from "react";
import { ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "../../../components/Themed.tsx";

import { ra_to_hours, dec_to_dms } from "../../../components/units";
import { GET } from "../../../components/API";
import PostComment from "../../../components/PostComment";

function Source() {
  const params = useLocalSearchParams();
  const { id } = params;

  const [data, setData] = useState(null);
  const [comment, setComment] = useState(false);

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

  // Render an empty component if data is null
  if (data === null) {
    return null; // or any other empty component you want to render
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      {!data ? (
        <View style={{ marginTop: 20 }}>
          <Text>No data available.</Text>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{data.id}</Text>
          <Text>
            RA: {ra_to_hours(data.ra)} Dec: {dec_to_dms(data.dec)}
          </Text>

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
              <View style={{ marginBottom: 15 }} key={thisComment.id}>
                <Image
                  source={{ uri: thisComment.gravatarUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <Text style={{ marginLeft: 10 }}>
                  {thisComment.author?.username}: {thisComment.text}
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
