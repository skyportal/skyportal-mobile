import {
  and,
  or,
  ControlProps,
  ControlState,
  isNumberControl,
  isStringControl,
  optionIs,
  RankedTester,
  rankWith,
} from "@jsonforms/core";
import { Control, withJsonFormsControlProps } from "@jsonforms/react";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../Themed.tsx";
import { TextInput, HelperText } from "react-native-paper";

/** this is defined as a class component in order to extend from the jsonforms package's Control class */
export class TextInputControl extends Control<ControlProps, ControlState> {
  private onChange(value: string) {
    this.props.handleChange(this.props.path, value);
  }

  public render() {
    const { label, data, required, description, errors, schema, visible } =
      this.props;

    const isValid = errors.length === 0;
    const title = schema.title;
    const type = schema.type;
    const placeholder =
      typeof schema.default === "number"
        ? schema.default.toString()
        : schema.default;
    const minimum = schema.minimum;
    const maximum = schema.maximum;

    let errorText = "";

    const hasErrors = () => {
      if (minimum !== null) {
        if (data < minimum) {
          errorText = `Must be >= ${minimum}`;
          return true;
        }
      }
      if (maximum !== null) {
        if (data > maximum) {
          errorText = `Must be <= ${maximum}`;
          return true;
        }
      }
      return false;
    };

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
          <TextInput
            onChangeText={this.onChange.bind(this)}
            value={data}
            placeholder={placeholder}
          />
          <HelperText type="error" visible={hasErrors()}>
            {errorText}
          </HelperText>
        </View>
      </View>
    );
  }
}

export const textInputControlTester: RankedTester = rankWith(
  20,
  or(
    and(isStringControl, optionIs("format", "string")),
    and(isNumberControl, optionIs("format", "number"))
  )
);

export default withJsonFormsControlProps(TextInputControl);

const styles = StyleSheet.create({
  errorText: { color: "red" },
  standardContainer: { padding: 5, flex: 1 },
});
