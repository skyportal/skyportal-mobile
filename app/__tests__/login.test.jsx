import React from "react";
// eslint-disable-next-line import/no-unresolved
import { render, fireEvent } from "expo-router/testing-library";
import { NavigationContainer } from "@react-navigation/native";

import * as SecureStore from "expo-secure-store";
import { BarCodeScanner } from "expo-barcode-scanner";
import Login from "../login/index.tsx";

// eslint-disable-next-line no-undef
jest.mock("expo-secure-store");
// eslint-disable-next-line no-undef
jest.mock("expo-barcode-scanner");

// eslint-disable-next-line no-undef
describe("App", () => {
  // eslint-disable-next-line no-undef
  test("navigates to the Front page, selects an option and inputs text, then goes to Home screen", async () => {
    SecureStore.getItemAsync.mockResolvedValue(
      '{"token":"1234","url":"https://fritz.science"}'
    );
    BarCodeScanner.requestPermissionsAsync.mockResolvedValue("granted");

    const rendered = render(
      <NavigationContainer>
        {" "}
        <Login />{" "}
      </NavigationContainer>
    );

    // Type something in the TextInput
    fireEvent.changeText(
      rendered.getByPlaceholderText("Enter your token here"),
      "1234"
    );

    // Check if the TextInput value has been updated
    // eslint-disable-next-line no-undef
    expect(
      rendered.getByPlaceholderText("Enter your token here").props.value
    ).toBe("1234");

    fireEvent.press(rendered.getByText("Save Login"));
  });
});
