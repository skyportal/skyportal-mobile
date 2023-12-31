import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  FlatList,
  PanResponder,
  Linking,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "./Themed.tsx";

import { ra_to_hours, dec_to_dms } from "./units";
import { GET } from "./API";
import PopupMessage from "./PopupMessage";
import orderAndModifyThumbnailList from "./thumbnails";

function CandidateCard({
  item: candidate,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}) {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);

  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 15 || Math.abs(gestureState.dx) > 15,
      onPanResponderMove: (_, gestureState) => {
        // Adjust the threshold for vertical swiping
        if (Math.abs(gestureState.dy) > 10) {
          translateY.setValue(gestureState.dy);
          translateX.setValue(0);
        } else if (Math.abs(gestureState.dx) > 10) {
          translateX.setValue(gestureState.dx);
          translateY.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < 0 && Math.abs(gestureState.dy) > 100) {
          // Swiped up
          onSwipeUp();
        } else if (gestureState.dy > 0 && Math.abs(gestureState.dy) > 100) {
          // Swiped down
          onSwipeDown();
        }

        if (gestureState.dx < 0 && Math.abs(gestureState.dx) > 100) {
          // Swiped left
          onSwipeLeft();
          setShowModal(true);
          setModalMessage("Successfully rejected source!");
        }

        if (gestureState.dx > 0 && Math.abs(gestureState.dx) > 100) {
          // Swiped right
          onSwipeRight();
          setShowModal(true);
          setModalMessage("Successfully saved source!");
        }

        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      },
    })
  ).current;

  const styles = StyleSheet.create({
    itemContainer: {
      width: "95%",
      height: 700,
      overflow: "hidden",
      backgroundColor: "lightgray",
      borderRadius: 20,
      padding: 20,
      margin: 5,
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

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  useEffect(() => {
    const endpoint = `candidates/${candidate.id}`;
    async function fetchData() {
      const response = await GET(endpoint, {});
      setData(response.data);
    }
    fetchData();
  }, [candidate.id]);

  useEffect(() => {
    async function fetchUserData() {
      const userdata = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userdata);
      setUserData(parsedData);
    }
    fetchUserData();
  }, []);

  const renderItem = ({ item }) => (
    <View>
      <Text style={{ textAlign: "center" }}>{item.type}</Text>
      <Image
        key={item.id}
        source={{ uri: item.public_url }}
        style={{ width: 140, height: 140 }}
        resizeMode="cover"
      />
    </View>
  );

  // Render an empty component if data is null
  if (data === null) {
    return null; // or any other empty component you want to render
  }

  const sourceUrl = `${userData.url}/source/${data.id}`;
  const orderedThumbnails = orderAndModifyThumbnailList(
    data.thumbnails,
    userData
  );

  return (
    <>
      <Animated.View
        style={[
          styles.itemContainer,
          { transform: [{ translateY }, { translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(sourceUrl);
            }}
          >
            <Text style={styles.linkText}>{data.id}</Text>
          </TouchableOpacity>
          <Text style={styles.itemText}>RA: {ra_to_hours(data.ra, ":")}</Text>
          <Text style={styles.itemText}>Dec: {dec_to_dms(data.dec, ":")}</Text>

          <Text style={styles.itemText}>Images:</Text>
          {orderedThumbnails ? (
            <FlatList
              data={orderedThumbnails}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
            />
          ) : (
            <View />
          )}
        </View>
      </Animated.View>
      <PopupMessage
        visible={showModal}
        message={modalMessage}
        onClose={closeModal}
      />
    </>
  );
}

CandidateCard.propTypes = {
  item: PropTypes.shape({
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
  }).isRequired,
  onSwipeLeft: PropTypes.func.isRequired,
  onSwipeRight: PropTypes.func.isRequired,
  onSwipeUp: PropTypes.func.isRequired,
  onSwipeDown: PropTypes.func.isRequired,
};

export default CandidateCard;
