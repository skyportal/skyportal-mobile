import React, { useState } from "react";
import PropTypes from "prop-types";
import { Alert, ActivityIndicator } from "react-native";

import { Text, TextInput, View, TouchableOpacity } from "./Themed.tsx";
import { POST } from "./API";

function PostComment({ sourceId = null, eventId = null, setComment }) {
  const [commentData, setCommentData] = useState("");
  const [posting, setPosting] = useState(false);

  const handleCommentPost = async () => {
    if (commentData.trim() === "") {
      Alert.alert("Error", "Please enter text for the Comment");
      return;
    }

    setPosting(true);
    let endpoint;

    // Define the API endpoint URL
    if (sourceId) {
      endpoint = `sources/${sourceId}/comments`;
    } else if (eventId) {
      endpoint = `gcn_event/${eventId}/comments`;
    }

    async function postComment() {
      await POST(endpoint, { text: commentData });
      setPosting(false);
      setComment(true);
    }
    postComment();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        POST Comment
      </Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
        }}
        placeholder="Enter data for comment"
        value={commentData}
        onChangeText={(text) => setCommentData(text)}
      />

      {/* Custom button with posting indicator */}
      <TouchableOpacity
        style={{
          backgroundColor: "#007BFF",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
        onPress={handleCommentPost}
        disabled={posting} // Disable the button while loading
      >
        {posting ? (
          <ActivityIndicator size="small" style={{ marginRight: 10 }} />
        ) : (
          <Text>Post comment</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

PostComment.propTypes = {
  setComment: PropTypes.func.isRequired,
  sourceId: PropTypes.string,
  eventId: PropTypes.number,
};

PostComment.defaultProps = {
  sourceId: null,
  eventId: null,
};

export default PostComment;
