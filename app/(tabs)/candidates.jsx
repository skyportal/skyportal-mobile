import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "expo-router";
import { FlatList, StyleSheet, useColorScheme } from "react-native";
import {
  Text,
  View,
  Button,
  RNPickerSelect,
} from "../../components/Themed.tsx";

import { GET } from "../../components/API";
import UserAvatar from "../../components/UserAvatar";
import TimeSpans from "../../components/TimeSpans";

const defaultPrefs = {
  sinceDaysAgo: "7",
};

const getStarType = (index) => {
  const positions = ["gold", "silver", "bronze"];

  if (index < positions.length) {
    return positions[index];
  }
  return index + 1; // Continue with numbers after bronze
};

function Star({ type }) {
  let starColor;
  let starIcon;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Set star color and icon based on the type prop
  switch (type) {
    case "gold":
      starColor = "#FFD700"; // Gold color
      starIcon = "★"; // Gold star icon
      break;
    case "silver":
      starColor = "#C0C0C0"; // Silver color
      starIcon = "★"; // Silver star icon
      break;
    case "bronze":
      starColor = "#CD7F32"; // Bronze color
      starIcon = "★"; // Bronze star icon
      break;
    default:
      starColor = isDarkMode ? "#CCCCCC" : "#333333"; // Default color (black) for unknown type
      starIcon = type; // Default icon for unknown type
  }

  return (
    <View>
      <Text style={{ color: starColor, borderWidth: 0 }}>{starIcon}</Text>
    </View>
  );
}

Star.propTypes = {
  type: PropTypes.string.isRequired,
};

function LeaderBoard({ data }) {
  const board_styles = StyleSheet.create({
    table: {
      justifyContent: "center",
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      borderBottomWidth: 1,
      borderColor: "#cccccc",
      paddingVertical: 8,
    },
    cell: {
      height: "100%",
      justifyContent: "center",
      marginHorizontal: 18,
      borderWidth: 0,
    },
  });

  const renderItem = ({ item, index }) => (
    <View style={board_styles.row}>
      <Star type={getStarType(index)} />
      <Text style={board_styles.cell}>{}</Text>
      <UserAvatar
        size={25}
        firstName={item.author?.first_name}
        lastName={item.author?.last_name}
        username={item.author?.username}
        gravatarUrl={item.author?.gravatar_url}
      />
      <Text style={board_styles.cell}> {item.author?.username} </Text>
      <Text style={board_styles.cell}> {item.saves} </Text>
    </View>
  );

  return (
    <View style={board_styles.table}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.author.id.toString()}
      />
    </View>
  );
}

LeaderBoard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.objectOf({
      author: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        username: PropTypes.string,
        contact_email: PropTypes.string,
        contact_phone: PropTypes.string,
        gravatar_url: PropTypes.string,
      }).isRequired,
      saves: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const savedStatusSelectOptions = [
  { value: "all", label: "regardless of saved status" },
  { value: "savedToAllSelected", label: "and is saved to all selected groups" },
  {
    value: "savedToAnySelected",
    label: "and is saved to at least one of the selected groups",
  },
  {
    value: "savedToAnyAccessible",
    label: "and is saved to at least one group I have access to",
  },
  {
    value: "notSavedToAnyAccessible",
    label: "and is not saved to any of group I have access to",
  },
  {
    value: "notSavedToAnySelected",
    label: "and is not saved to any of the selected groups",
  },
  {
    value: "notSavedToAllSelected",
    label: "and is not saved to all of the selected groups",
  },
];

function Candidates() {
  const [groups, setGroups] = useState(null);
  const [queryStatus, setQueryStatus] = useState(false);
  const [selectedScanGroup, setSelectedScanGroup] = useState(null);
  const [selectedSaveGroup, setSelectedSaveGroup] = useState(null);
  const [selectedRejectGroup, setSelectedRejectGroup] = useState(null);
  const [savedStatus, setSavedStatus] = useState(null);
  const [scanners, setScanners] = useState(null);
  const [selectedTimeSpan, setSelectedTimeSpan] = useState(null);

  useEffect(() => {
    // Show loading indicator
    setQueryStatus(true);

    // Define the API endpoint URL
    const endpoint = "groups";

    async function fetchData() {
      const response = await GET(endpoint, {});
      setGroups(response.data.all_groups);
      setQueryStatus(false);
      setSelectedScanGroup(response.data.all_groups[0].id);
      setSelectedSaveGroup(response.data.all_groups[0].id);
      setSelectedRejectGroup(response.data.all_groups[0].id);
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Define the API endpoint URL
    const endpoint = "internal/source_savers";
    async function fetchScanners() {
      // eslint-disable-next-line no-use-before-define
      // eslint-disable-next-line no-unused-vars
      const sinceDaysAgo = selectedTimeSpan
        ? selectedTimeSpan.label
        : defaultPrefs.sinceDaysAgo;
      const response = await GET(endpoint, { sinceDaysAgo, maxNumSavers: 10 });
      setScanners(response.data);
    }

    fetchScanners();
  }, [selectedTimeSpan]);

  // Render an empty component if data is null
  if (groups === null || selectedScanGroup === null) {
    return null; // or any other empty component you want to render
  }

  const options = groups.map((item) => ({
    label: item.name,
    value: item.id,
    key: item.id,
  }));

  const handleSavedStatusChange = (value) => {
    if (value && value !== -1) {
      setSavedStatus(value);
    }
  };

  const handleScanChange = (value) => {
    if (value && value !== -1) {
      setSelectedScanGroup(value);
    }
  };

  const handleSaveChange = (value) => {
    if (value && value !== -1) {
      setSelectedSaveGroup(value);
    }
  };

  const handleRejectChange = (value) => {
    if (value && value !== -1) {
      setSelectedRejectGroup(value);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      padding: 20,
      fontSize: 14,
    },
  });

  const handleSelectTimeSpan = (timespan) => {
    setSelectedTimeSpan(timespan);
  };

  return (
    <View>
      {!queryStatus && groups ? (
        <View>
          <View style={styles.container}>
            <Text style={styles.text}>Saved status:</Text>
            <RNPickerSelect
              items={savedStatusSelectOptions}
              onValueChange={handleSavedStatusChange}
              value={savedStatus}
              useNativeAndroidPickerStyle={false}
              hideDoneBar
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.text}>Group to scan for:</Text>
            <RNPickerSelect
              items={options}
              onValueChange={handleScanChange}
              value={selectedScanGroup}
              useNativeAndroidPickerStyle={false}
              hideDoneBar
            />
            <Text style={styles.text}>{selectedScanGroup}</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.text}>Group to save candidate to:</Text>
            <RNPickerSelect
              items={options}
              onValueChange={handleSaveChange}
              value={selectedSaveGroup}
              useNativeAndroidPickerStyle={false}
              hideDoneBar
            />
            <Text style={styles.text}>{selectedSaveGroup}</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.text}>
              Group to save rejected candidates to:
            </Text>
            <RNPickerSelect
              items={options}
              onValueChange={handleRejectChange}
              value={selectedRejectGroup}
              useNativeAndroidPickerStyle={false}
              hideDoneBar
            />
            <Text style={styles.text}>{selectedRejectGroup}</Text>
          </View>

          <Link
            push
            href={{
              pathname: "/(tabs)/candidate",
              params: {
                id: selectedScanGroup,
                save: selectedSaveGroup,
                reject: selectedRejectGroup,
                savedStatus,
              },
            }}
            asChild
          >
            <Button title="Let's do some scanning!" />
          </Link>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}

      <TimeSpans onSelectTimeSpan={handleSelectTimeSpan} />
      {scanners ? (
        <LeaderBoard data={scanners} />
      ) : (
        <Text>No scanner data available...</Text>
      )}
    </View>
  );
}

export default Candidates;
