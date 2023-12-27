// include this line for mocking react-native-gesture-handler
import "react-native-gesture-handler/jestSetup";

// eslint-disable-next-line no-undef
jest.mock("@react-native-async-storage/async-storage", () =>
  // eslint-disable-next-line global-require
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
