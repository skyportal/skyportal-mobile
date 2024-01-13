/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  TextInput as DefaultTextInput,
  TouchableOpacity as DefaultTouchableOpacity,
  View as DefaultView,
  Button as DefaultButton,
  StyleSheet,
  useColorScheme,
} from "react-native";

import {default as DefaultRNPickerSelect} from "react-native-picker-select";
import { CheckBox as DefaultCheckBox } from "@rneui/themed";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ButtonProps = ThemeProps & DefaultButton["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type TouchableOpacityProps = ThemeProps & DefaultTouchableOpacity["props"];
export type RNPickerSelectProps = ThemeProps & DefaultRNPickerSelect["props"];
export type CheckBoxProps = ThemeProps & DefaultCheckBox["props"];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightMode: {
    backgroundColor: '#FFFFFF', // Light mode background color
  },
  darkMode: {
    backgroundColor: '#121212', // Dark mode background color
  },
  lightButton: { 
    color: '#007AFF', 
  },
  darkButton: {     
    color: '#CCCCCC',  
  },
  text: {
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  lightText: {
    color: '#333333', // Light mode text color
    backgroundColor: '#FFFFFF', // Light mode background color
    borderColor: '#CCCCCC', // Light mode border color
    borderWidth: 1, // Light mode border width
  },
  darkText: {
    color: '#CCCCCC', // Dark mode text color
    backgroundColor: '#121212', // Dark mode background color
    borderColor: '#555555', // Dark mode border color
    borderWidth: 1, // Dark mode border width
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  lightInput: {
    backgroundColor: '#FFFFFF', // Light mode background color
    color: '#333333', // Light mode text color
  },
  darkInput: {
    backgroundColor: '#121212', // Dark mode background color
    color: '#CCCCCC', // Dark mode text color
  },
  touchable: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  lightTouchable: {
    backgroundColor: '#FFFFFF', // Light mode background color
    borderColor: '#CCCCCC', // Light mode border color
    borderWidth: 1, // Light mode border width
  },
  darkTouchable: {
    backgroundColor: '#121212', // Dark mode background color
    borderColor: '#555555', // Dark mode border color
    borderWidth: 1, // Dark mode border width
  },
    lightCheckbox: {
      containerStyle: {
        backgroundColor: '#FFFFFF', // Light mode background color
        borderColor: '#CCCCCC', // Light mode border color
      },
      textStyle: {
        color: '#333333', // Light mode text color
      },
      checkedColor: '#007AFF', // Light mode checked color
    },
    darkCheckbox: {
      containerStyle: {
        backgroundColor: '#121212', // Dark mode background color
        borderColor: '#555555', // Dark mode border color
      },
      textStyle: {
        color: '#CCCCCC', // Dark mode text color
      },
      checkedColor: '#4CA2FF', // Dark mode checked color
    },
});

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return <DefaultText style={[styles.text, isDarkMode ? styles.darkText : styles.lightText, style]} {...otherProps} />;

}

export function TextInput(props: TextInputProps) {                        
  const { style, lightColor, darkColor, ...otherProps } = props;
                                       
  const colorScheme = useColorScheme();     
  const isDarkMode = colorScheme === 'dark';

  return <DefaultTextInput style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput, style]} {...otherProps} />;

} 

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return <DefaultTouchableOpacity style={[styles.touchable, isDarkMode ? styles.darkTouchable : styles.lightTouchable, style]} {...otherProps} />;

} 

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return <DefaultView style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode, style]} {...otherProps} />;
}

export function Button(props: ButtonProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return <DefaultButton style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton, style]} {...otherProps} />;
}

export function CheckBox(props: CheckboxProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return <DefaultCheckBox containerStyle={[isDarkMode ? styles.darkCheckbox.containerStyle : styles.lightCheckbox.containerStyle, style]} textStyle={[isDarkMode ? styles.darkCheckbox.textStyle : styles.lightCheckbox.textStyle, style]} {...otherProps} />;
}

export function RNPickerSelect(props: RNPickerSelectProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const pickerStyle = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: isDarkMode ? '#555555' : '#CCCCCC',
      borderRadius: 4,
      color: isDarkMode ? '#CCCCCC' : '#333333',
      paddingRight: 30, // to ensure the text is never behind the icon
      backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: isDarkMode ? '#555555' : '#CCCCCC',
      borderRadius: 4,
      color: isDarkMode ? '#CCCCCC' : '#333333',
      paddingRight: 30, // to ensure the text is never behind the icon
      backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
    },
    placeholder: {
      color: isDarkMode ? '#888888' : '#AAAAAA',
    },
  });

  return <DefaultRNPickerSelect       style={{
        inputIOS: pickerStyle.inputIOS,
        inputAndroid: pickerStyle.inputAndroid,
        placeholder: pickerStyle.placeholder,
        style
      }} {...otherProps} />;
}
