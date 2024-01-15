import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, FlatList } from "react-native";
import { Text, View } from "./Themed.tsx";

function GcnProperties({ data }) {
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
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
      borderBottomWidth: 0,
      borderColor: "#cccccc",
      paddingVertical: 0,
    },
    headerCell: {
      fontWeight: "bold",
      marginHorizontal: 10,
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

  const renderGWItem = ({ item }) => (
    <View style={board_styles.row}>
      <Text style={board_styles.cell}>{item.data?.FAR?.toExponential(0)}</Text>
      <Text style={board_styles.cell}> {item.data?.num_instruments} </Text>
      <Text style={board_styles.cell}>
        {item.data?.BNS?.toFixed(2)}/{item.data?.NSBH?.toFixed(2)}/
        {item.data?.BBH?.toFixed(2)}
      </Text>
      <Text style={board_styles.cell}>
        {item.data?.HasNS?.toFixed(2)}/{item.data?.HasRemnant?.toFixed(2)}
      </Text>
    </View>
  );

  const renderGRBItem = ({ item }) => (
    <View style={board_styles.row}>
      <Text style={board_styles.cell}>
        {item.data?.Burst_Inten?.toFixed(0)}
      </Text>
      <Text style={board_styles.cell}>
        {item.data?.Data_Signif?.toFixed(1)}
      </Text>
      <Text style={board_styles.cell}>
        {item.data?.Trig_Timescale?.toFixed(4)}
      </Text>
      <Text style={board_styles.cell}>
        {item.data?.Hardness_Ratio?.toFixed(3)}
      </Text>
    </View>
  );

  return (
    <View style={board_styles.table}>
      {data[0].data.num_instruments ? (
        <>
          <View style={board_styles.header}>
            <Text style={board_styles.headerCell}>FAR</Text>
            <Text style={board_styles.headerCell}>#</Text>
            <Text style={board_styles.headerCell}>BNS/NSBH/BBH</Text>
            <Text style={board_styles.headerCell}>NS/Rem</Text>
          </View>
          <FlatList
            data={data}
            renderItem={renderGWItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </>
      ) : (
        <>
          <View style={board_styles.header}>
            <Text style={board_styles.headerCell}>Intensity</Text>
            <Text style={board_styles.headerCell}>Significance</Text>
            <Text style={board_styles.headerCell}>Time</Text>
            <Text style={board_styles.headerCell}>Hardness_Ratio</Text>
          </View>
          <FlatList
            data={data}
            renderItem={renderGRBItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </>
      )}
    </View>
  );
}

GcnProperties.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.shape({
        FAR: PropTypes.number,
        num_instruments: PropTypes.number,
        BNS: PropTypes.number,
        NSBH: PropTypes.number,
        BBH: PropTypes.number,
        HasNS: PropTypes.number,
        HasRemnant: PropTypes.number,
      }),
      id: PropTypes.number,
    })
  ).isRequired,
};

export default GcnProperties;
