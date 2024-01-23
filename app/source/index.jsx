import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Image, Linking } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { Text, View, TouchableOpacity } from "../../components/Themed.tsx";

import UserAvatar from "../../components/UserAvatar";
import PostComment from "../../components/PostComment";
import PostFollowupRequest from "../../components/PostFollowupRequest";
import PhotometryPlot from "../../components/PhotometryPlot";
import SpectraPlot from "../../components/SpectraPlot";

import orderAndModifyThumbnailList from "../../components/utils/thumbnails";
import { ra_to_hours, dec_to_dms } from "../../components/utils/units";
import { GET } from "../../components/utils/API";
import { getItem } from "../../components/utils/storage";

function Source() {
  const params = useLocalSearchParams();
  const { id } = params;

  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [userData, setUserData] = useState(null);
  const [photometry, setPhotometry] = useState(null);
  const [spectra, setSpectra] = useState(null);
  const [comment, setComment] = useState(false);

  const styles = StyleSheet.create({
    itemContainer: {
      width: "95%",
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
  }, [id, comment]);

  useEffect(() => {
    const photometry_endpoint = `sources/${id}/photometry`;
    async function fetchPhotometry() {
      const photometry_response = await GET(photometry_endpoint, {});
      setPhotometry(photometry_response.data);
    }
    fetchPhotometry();
  }, [id]);

  useEffect(() => {
    const spectra_endpoint = `sources/${id}/spectra`;
    async function fetchSpectra() {
      const spectra_response = await GET(spectra_endpoint, {});
      setSpectra(spectra_response.data.spectra);
    }
    fetchSpectra();
  }, [id]);

  useEffect(() => {
    const config_endpoint = `config`;
    async function fetchConfig() {
      const config_response = await GET(config_endpoint, {});
      setConfig(config_response.data);
    }
    fetchConfig();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      const userdata = await getItem("userData");
      const parsedData = JSON.parse(userdata);
      setUserData(parsedData);
    }
    fetchUserData();
  }, []);

  if (data === null || data === undefined) {
    return null;
  }

  if (userData === null) {
    return null;
  }

  if (photometry === null) {
    return null;
  }

  if (spectra === null) {
    return null;
  }

  const sourceUrl = `${userData.url}/source/${id}`;
  const orderedThumbnails = orderAndModifyThumbnailList(
    data.thumbnails,
    userData
  );

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

          <Text style={styles.itemText}>
            {ra_to_hours(data.ra, ":")}, {dec_to_dms(data.dec, ":")}
          </Text>
          <View style={{ flex: 0.8, width: 200 }}>
            <PhotometryPlot
              dm={data.dm}
              photometry={photometry}
              config={config}
              height={300}
              width={300}
            />
          </View>
          <View style={{ flex: 0.8, width: 200 }}>
            <SpectraPlot redshift={data.redshift} spectra={spectra} />
          </View>

          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "bold" }}>
            Images:
          </Text>
          <ScrollView horizontal>
            {orderedThumbnails?.map((thumbnail) => (
              <Image
                key={thumbnail.id}
                source={{ uri: thumbnail.public_url }}
                style={{ width: 200, height: 200, marginRight: 10 }}
              />
            ))}
          </ScrollView>

          {data.classifications.length > 0 ? (
            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "bold" }}>
              Classifications:
            </Text>
          ) : null}
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
                <Text>
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
                <UserAvatar
                  size={30}
                  firstName={thisComment.author?.first_name}
                  lastName={thisComment.author?.last_name}
                  username={thisComment.author?.username}
                  gravatarUrl={thisComment.author?.gravatar_url}
                />
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  {thisComment.author?.username}
                </Text>
                <Text style={{ fontSize: 12, marginRight: 40, marginLeft: 20 }}>
                  {thisComment.text}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 5 }}>
            <PostComment sourceId={data.id} setComment={setComment} />
          </View>
          <View style={{ marginTop: 5 }}>
            <PostFollowupRequest sourceId={data.id} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export default Source;
