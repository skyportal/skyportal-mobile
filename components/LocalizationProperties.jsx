import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, FlatList } from "react-native";
import { Text, View } from "./Themed.tsx";

import { ra_to_hours, dec_to_dms } from "./utils/units";

function LocalizationProperties({ data }) {
  const board_styles = StyleSheet.create({
    table: {
      padding: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 0,
      borderWidth: 0,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 0,
      borderBottomWidth: 0,
      borderColor: "#cccccc",
      paddingVertical: 8,
      borderWidth: 0,
    },
    headerCell: {
      fontWeight: "bold",
      marginHorizontal: 0,
      justifyContent: "center",
      borderWidth: 0,
    },
    cell: {
      height: "100%",
      justifyContent: "center",
      marginHorizontal: 0,
      borderWidth: 0,
    },
  });

  const renderItem = ({ item }) => {
    let properties;
    if (item.properties && item.properties.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      properties = item.properties[0];
    }

    return (
      <View style={board_styles.row}>
        <Text style={board_styles.cell}>
          {ra_to_hours(item.center?.ra, ":")},{" "}
          {dec_to_dms(item.center?.dec, ":")}
        </Text>
        <Text style={board_styles.cell}>
          {properties?.data?.area_90?.toFixed(1)}
        </Text>
        <Text style={board_styles.cell}>
          {properties?.data?.distmean?.toFixed(0)}
        </Text>
      </View>
    );
  };

  return (
    <View style={board_styles.table}>
      <View style={board_styles.header}>
        <Text style={board_styles.headerCell}>RA/Dec</Text>
        <Text style={board_styles.headerCell}>Area [sq. deg.]</Text>
        <Text style={board_styles.headerCell}>Dist [Mpc]</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}

LocalizationProperties.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      properties: PropTypes.arrayOf(
        PropTypes.shape({
          FAR: PropTypes.number,
          num_instruments: PropTypes.number,
          BNS: PropTypes.number,
          NSBH: PropTypes.number,
          BBH: PropTypes.number,
          HasNS: PropTypes.number,
          HasRemnant: PropTypes.number,
        })
      ),
      id: PropTypes.number.isRequired,
    })
  ),
};

LocalizationProperties.defaultProps = {
  data: null,
};

export default LocalizationProperties;
