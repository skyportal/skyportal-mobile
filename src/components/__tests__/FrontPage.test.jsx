import React from "react";
import { render, fireEvent } from "expo-router/testing-library";
import App from "../../../App";

describe("App", () => {
  test("navigates to the Front page, selects an option and inputs text, then goes to Home screen", async () => {
    const rendered = render(<App />);

    // Open the picker
    // fireEvent.press(getByText('fritz'));

    // Select an option (in this case, "Option 2")
    // fireEvent.press(getByText('https://fritz.science'));

    // Check if the selected option is displayed
    // expect(getByText('https://fritz.science')).toBeTruthy();

    // Type something in the TextInput
    fireEvent.changeText(
      rendered.getByPlaceholderText("Enter your token here"),
      "1234"
    );

    // Check if the TextInput value has been updated
    expect(
      rendered.getByPlaceholderText("Enter your token here").props.value
    ).toBe("1234");

    fireEvent.press(rendered.getByText("Save Data"));
  });
});
