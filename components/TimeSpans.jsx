import React, { useState } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Text, View, TouchableOpacity } from "./Themed.tsx";

function TimeSpans({ onSelectTimeSpan }) {
  const timespans = [
    { label: "DAY", sinceDaysAgo: "1", tooltip: "Past 24 hours" },
    { label: "WEEK", sinceDaysAgo: "7", tooltip: "Past 7 days" },
    { label: "MONTH", sinceDaysAgo: "30", tooltip: "Past 30 days" },
    { label: "6 MONTHS", sinceDaysAgo: "180", tooltip: "Past 180 days" },
    { label: "YEAR", sinceDaysAgo: "365", tooltip: "Past 365 days" },
  ];

  const [selectedTimeSpan, setSelectedTimeSpan] = useState(null);

  const handleTimeSpanPress = (timespan) => {
    setSelectedTimeSpan(timespan);
    onSelectTimeSpan(timespan);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 0.25,
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 10,
    },
    timespanButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: "#ccc",
    },
    selectedTimespan: {
      backgroundColor: "#3498db",
    },
    timespanLabel: {
      fontSize: 12,
      fontWeight: "normal",
    },
    boldLabel: {
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      {timespans.map((timespan) => (
        <TouchableOpacity
          key={timespan.label}
          onPress={() => handleTimeSpanPress(timespan)}
          style={[
            styles.timespanButton,
            selectedTimeSpan === timespan && styles.selectedTimespan,
          ]}
        >
          <Text
            style={[
              styles.timespanLabel,
              selectedTimeSpan?.label === timespan.label && styles.boldLabel,
            ]}
          >
            {timespan.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

TimeSpans.propTypes = {
  onSelectTimeSpan: PropTypes.func.isRequired,
};

export default TimeSpans;
