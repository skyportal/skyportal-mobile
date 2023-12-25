import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";

import { POST } from "./API";

function PostComment({ sourceId, setComment }) {
  const [commentData, setCommentData] = useState("");
  const [posting, setPosting] = useState(false);

  const handleCommentPost = async () => {
    if (commentData.trim() === "") {
      Alert.alert("Error", "Please enter text for the Comment");
      return;
    }

    setPosting(true);

    // Define the API endpoint URL
    const endpoint = `sources/${sourceId}/comments`;

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
          <ActivityIndicator
            size="small"
            color="#ffffff"
            style={{ marginRight: 10 }}
          />
        ) : (
          <Text style={{ color: "#ffffff" }}>Post comment</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

PostComment.propTypes = {
  setComment: PropTypes.func.isRequired,
  sourceId: PropTypes.string.isRequired,
};

export default PostComment;
