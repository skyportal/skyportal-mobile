import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { Text, View } from "../../components/Themed.tsx";
import { GET } from "../../components/API";
import { getItem } from "../../components/storage";
import UserAvatar from "../../components/UserAvatar";
import PostComment from "../../components/PostComment";
import GcnProperties from "../../components/GcnProperties";
import LocalizationProperties from "../../components/LocalizationProperties";

function GcnEvent() {
  const params = useLocalSearchParams();
  const { dateobs } = params;

  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [comment, setComment] = useState(false);

  const styles = StyleSheet.create({
    itemContainer: {
      width: "95%",
      height: 600,
      overflow: "hidden",
      borderRadius: 10,
      padding: 20,
      margin: 10,
    },
    itemText: {
      fontSize: 18,
      fontWeight: "bold",
      borderWidth: 0,
    },
    linkText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "blue",
    },
    itemLinkText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "blue",
    },
  });

  useEffect(() => {
    const endpoint = `gcn_event/${dateobs}`;
    async function fetchData() {
      const response = await GET(endpoint, {});
      setData(response.data);
    }

    fetchData();
    setComment(false);
  }, [comment, dateobs]);

  useEffect(() => {
    async function fetchUserData() {
      const userdata = await getItem("userData");
      const parsedData = JSON.parse(userdata);
      setUserData(parsedData);
    }
    fetchUserData();
  }, []);

  if (data === null) {
    return null;
  }

  if (userData === null) {
    return null;
  }

  const eventUrl = `${userData.url}/gcn_events/${dateobs}`;

  return (
    <ScrollView style={styles.itemContainer}>
      <Stack.Screen options={{ headerShown: true, title: dateobs }} />
      {!data ? (
        <View style={{ marginTop: 20 }}>
          <Text>No data available.</Text>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(eventUrl);
            }}
          >
            <Text style={styles.linkText}>{data.dateobs}</Text>
          </TouchableOpacity>

          <View>
            {data.properties ? (
              <GcnProperties data={data.properties} />
            ) : (
              <Text />
            )}
          </View>

          <View>
            {data.localizations ? (
              <LocalizationProperties data={data.localizations} />
            ) : (
              <Text />
            )}
          </View>

          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "bold" }}>
            Comments:
          </Text>
          <View style={{ marginTop: 5 }}>
            {data.comments?.map((thisComment) => {
              const attachmentUrl = `${userData.url}/api/gcn_event/${data.id}/comments/${thisComment.id}/attachment`;

              return (
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
                  {thisComment.attachment_name ? (
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(attachmentUrl);
                      }}
                    >
                      <Text style={styles.itemLinkText}>
                        {thisComment.text}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={{ marginRight: 80, marginLeft: 5 }}>
                      {thisComment.text}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
          <PostComment eventId={data.id} setComment={setComment} />
        </View>
      )}
    </ScrollView>
  );
}

export default GcnEvent;
