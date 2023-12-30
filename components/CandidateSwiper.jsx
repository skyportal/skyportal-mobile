import React, { useState } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

import CandidateCard from "./CandidateCard";
import { POST } from "./API";

function CandidateSwiper({ items, save, reject }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const handleSwipeLeft = async () => {
    // Handle left swipe
    // console.log('Swiped left');

    // Define the API endpoint URL
    const endpoint = "sources";

    async function postSource() {
      await POST(endpoint, { id: items[currentIndex].id, group_ids: [reject] });
    }
    postSource();
  };

  const handleSwipeRight = () => {
    // Handle right swipe

    // Define the API endpoint URL
    const endpoint = "sources";

    async function postSource() {
      await POST(endpoint, { id: items[currentIndex].id, group_ids: [save] });
    }
    postSource();
  };

  const handleSwipeUp = () => {
    // Handle up swipe
    // console.log('Swiped up');
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, items.length - 1));
    // Update current index or perform other actions as needed
  };

  const handleSwipeDown = () => {
    // Handle down swipe
    // console.log('Swiped down');
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const itemId = items[currentIndex].id;
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: itemId }} />
      <CandidateCard
        key={currentIndex}
        item={items[currentIndex]}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onSwipeUp={handleSwipeUp}
        onSwipeDown={handleSwipeDown}
      />
    </View>
  );
}

CandidateSwiper.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      ra: PropTypes.number,
      dec: PropTypes.number,
      thumbnails: PropTypes.arrayOf(PropTypes.shape({})),
      classifications: PropTypes.arrayOf(
        PropTypes.shape({
          author_name: PropTypes.string,
          probability: PropTypes.number,
          modified: PropTypes.string,
          classification: PropTypes.string,
          id: PropTypes.number,
          obj_id: PropTypes.string,
          author_id: PropTypes.number,
          taxonomy_id: PropTypes.number,
          created_at: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  save: PropTypes.string.isRequired,
  reject: PropTypes.string.isRequired,
};

export default CandidateSwiper;
