import * as SecureStore from "expo-secure-store";

export function getItem(key) {
  return SecureStore.getItemAsync(key);
}

export function setItem(key, value) {
  return SecureStore.setItemAsync(key, value);
}
