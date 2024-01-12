import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Text, View } from "./Themed.tsx";

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: "60%",
  },
  camera: {
    flex: 1,
  },
  resultContainer: {
    width: "100%",
    height: "33%",
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    color: "white",
    fontSize: 20,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

function QRScanner({ setTextInput }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(BarCodeScanner.Constants.Type.back);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    setTextInput(data);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  const startScanning = () => {
    setScanning(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const toggleCameraType = () => {
    setType((current) =>
      current === BarCodeScanner.Constants.Type.back
        ? BarCodeScanner.Constants.Type.front
        : BarCodeScanner.Constants.Type.back
    );
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          type={type}
        >
          <View style={styles.resultContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </BarCodeScanner>
      ) : (
        <View style={styles.resultContainer}>
          <TouchableOpacity style={styles.button} onPress={startScanning}>
            <Text style={styles.buttonText}>Use SkyPortal QR Code</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

QRScanner.propTypes = {
  setTextInput: PropTypes.func.isRequired,
};

export default QRScanner;
