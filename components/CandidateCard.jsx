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
import { View, Text } from "./Themed.tsx";

import PopupMessage from "./PopupMessage";
import PhotometryPlot from "./PhotometryPlot";
import { getItem } from "./utils/storage";
import { GET } from "./utils/API";
import orderAndModifyThumbnailList from "./utils/thumbnails";

function CandidateCard({
  item: candidate,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}) {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [userData, setUserData] = useState(null);
  const [photometry, setPhotometry] = useState(null);

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
    container: {
      width: "95%",
      flex: 0.95,
      backgroundColor: "lightgray",
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
    const photometry_endpoint = `sources/${candidate.id}/photometry`;
    async function fetchPhotometry() {
      const photometry_response = await GET(photometry_endpoint, {});
      setPhotometry(photometry_response.data);
    }
    fetchPhotometry();
  }, [candidate.id]);

  useEffect(() => {
    async function fetchUserData() {
      const userdata = await getItem("userData");
      const parsedData = JSON.parse(userdata);
      setUserData(parsedData);
    }
    fetchUserData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center", borderWidth: 0, fontSize: 12 }}>
        {item.type}
      </Text>
      <Image
        key={item.id}
        source={{ uri: item.public_url }}
        style={{ width: 100, height: 100 }}
        resizeMode="cover"
      />
    </View>
  );

  useEffect(() => {
    const config_endpoint = `config`;
    async function fetchConfig() {
      const config_response = await GET(config_endpoint, {});
      setConfig(config_response.data);
    }
    fetchConfig();
  }, []);

  if (data === null) {
    return null;
  }

  if (userData === null) {
    return null;
  }

  if (photometry === null) {
    return null;
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
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(sourceUrl);
            }}
          >
            <Text style={styles.linkText}>{data.id}</Text>
          </TouchableOpacity>

          <View>
            <PhotometryPlot
              dm={data.dm}
              photometry={photometry}
              config={config}
            />
          </View>

          <View>
            {orderedThumbnails ? (
              <FlatList
                contentContainerStyle={{ margin: 4, width: 200 }}
                horizontal={false}
                data={orderedThumbnails}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsHorizontalScrollIndicator // Hide horizontal scrollbar
              />
            ) : (
              <View />
            )}
          </View>
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
