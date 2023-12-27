import React from "react";
import PropTypes from "prop-types";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

function CandidateSwipeMessage({ visible, message, onClose }) {
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
    },
    modalText: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
  });

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

CandidateSwipeMessage.propTypes = {
  visible: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CandidateSwipeMessage;
