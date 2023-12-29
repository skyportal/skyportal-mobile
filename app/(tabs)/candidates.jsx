import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "expo-router";
import { FlatList, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Text, View, Button } from "../../components/Themed.tsx";

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
      starColor = "#000000"; // Default color (black) for unknown type
      starIcon = "?"; // Default icon for unknown type
  }

  return (
    <View>
      <Text style={{ color: starColor }}>{starIcon}</Text>
    </View>
  );
}

Star.propTypes = {
  type: PropTypes.string.isRequired,
};

function LeaderBoard({ data }) {
  const board_styles = StyleSheet.create({
    table: {
      padding: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
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
    headerCell: {
      fontWeight: "bold",
      marginHorizontal: 10,
      justifyContent: "center",
    },
    cell: {
      height: "100%",
      justifyContent: "center",
      marginHorizontal: 18,
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
      <View style={board_styles.header}>
        <Text style={board_styles.headerCell}>#</Text>
        <Text style={board_styles.headerCell}>Avatar</Text>
        <Text style={board_styles.headerCell}>User name</Text>
        <Text style={board_styles.headerCell}>Saved sources</Text>
      </View>
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

function Candidates() {
  const [groups, setGroups] = useState(null);
  const [queryStatus, setQueryStatus] = useState(false);
  const [selectedScanGroup, setSelectedScanGroup] = useState(null);
  const [selectedSaveGroup, setSelectedSaveGroup] = useState(null);
  const [selectedRejectGroup, setSelectedRejectGroup] = useState(null);
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
    // eslint-disable-next-line no-use-before-define
    // eslint-disable-next-line no-unused-vars
    const endpoint = "internal/source_savers";

    async function fetchScanners() {
      // eslint-disable-next-line no-use-before-define
      // eslint-disable-next-line no-unused-vars
      const sinceDaysAgo = selectedTimeSpan
        ? selectedTimeSpan.label
        : defaultPrefs.sinceDaysAgo;
      // const response = await GET(endpoint, { sinceDaysAgo });
      const response = {
        status: "success",
        data: [
          {
            author: {
              username: "provisioned-admin",
              first_name: "provisioned",
              last_name: "admin",
              affiliations: [],
              contact_email: null,
              contact_phone: null,
              oauth_uid: null,
              expiration_date: null,
              id: 1,
              created_at: "2023-12-29T14:38:28.046268",
              modified: "2023-12-29T17:41:18.964282",
              gravatar_url:
                "https://secure.gravatar.com/avatar/74c1a55d67d81634eb5aaaf5d82489b4?d=blank",
            },
            saves: 21,
          },
          {
            author: {
              username: "testadmin",
              first_name: "Jada",
              last_name: "Lilleboe",
              affiliations: [],
              contact_email: null,
              contact_phone: null,
              oauth_uid: null,
              expiration_date: null,
              id: 3,
              created_at: "2023-12-29T15:24:56.372068",
              modified: "2023-12-29T20:54:41.205119",
              gravatar_url:
                "https://secure.gravatar.com/avatar/9283a03246ef2dacdc21a9b137817ec1?d=blank",
            },
            saves: 8,
          },
        ],
        version: "0.9.dev0+git20231229.a344ca6a",
      };
      setScanners(response.data);
    }

    fetchScanners();
  }, []);

  // Render an empty component if data is null
  if (groups === null || selectedScanGroup === null) {
    return null; // or any other empty component you want to render
  }

  const options = groups.map((item) => ({
    label: item.name,
    value: item.id,
    key: item.id,
  }));

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

  const picker_style = {
    inputAndroid: {
      color: "black",
      backgroundColor: "transparent",
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: "purple",
      borderRadius: 8,
      paddingRight: 30,
    },
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
    },
    text: {
      marginHorizontal: 10, // Adjust the margin between Text components
      fontSize: 16,
    },
  });

  const handleSelectTimeSpan = (timespan) => {
    setSelectedTimeSpan(timespan);
  };

  return (
    <View>
      <TimeSpans onSelectTimeSpan={handleSelectTimeSpan} />
      {scanners ? (
        <LeaderBoard data={scanners} />
      ) : (
        <Text>No scanner data available...</Text>
      )}

      {!queryStatus && groups ? (
        <View>
          <View style={styles.container}>
            <Text style={styles.text}>Group to scan for:</Text>
            <RNPickerSelect
              style={picker_style}
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
              style={picker_style}
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
              style={picker_style}
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
    </View>
  );
}

export default Candidates;
