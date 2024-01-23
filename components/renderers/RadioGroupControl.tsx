import {
  and,
  computeLabel,
  ControlProps,
  ControlState,
  isEnumControl,
  optionIs,
  RankedTester,
  rankWith,
} from "@jsonforms/core";
import { Control, withJsonFormsControlProps } from "@jsonforms/react";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../Themed.tsx";
import { RadioButton } from "react-native-paper";

/** this is defined as a class component in order to extend from the jsonforms package's Control class */
export class RadioGroupControl extends Control<ControlProps, ControlState> {
  private onChange(value: string) {
    this.props.handleChange(this.props.path, value);
  }

  public render() {
    const { label, data, required, description, errors, schema, visible } =
      this.props;

    const isValid = errors.length === 0;
    const options = schema.enum;
    const title = schema.title;

    return (
      <View
        style={
          isValid
            ? {
                ...styles.standardContainer,
                display: visible ? "flex" : "none",
              }
            : {
                ...styles.errorContainer,
                display: visible ? "flex" : "none",
              }
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15, marginBottom: 5 }}>
            {title}
          </Text>
          <RadioButton.Group
            onValueChange={this.onChange.bind(this)}
            value={this.data}
          >
            {options.map((optionValue, index) => (
              <RadioButton.Item
                mode="android"
                position="leading"
                status={optionValue === data ? "checked" : "unchecked"}
                key={index}
                label={optionValue}
                value={optionValue}
              />
            ))}
          </RadioButton.Group>
        </View>
      </View>
    );
  }
}

export const radioGroupControlTester: RankedTester = rankWith(
  20,
  and(isEnumControl, optionIs("format", "radio"))
);

export default withJsonFormsControlProps(RadioGroupControl);

const styles = StyleSheet.create({
  errorText: { color: "red" },
  standardContainer: { padding: 5, flex: 1 },
  radioButtonContainer: { flex: 1, minWidth: 200 },
});
