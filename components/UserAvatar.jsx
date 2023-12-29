import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, Image, StyleSheet } from "react-native";
import { Text } from "./Themed.tsx";

function UserAvatar({ size, firstName, lastName, username, gravatarUrl }) {
  const [hasRealPicture, setHasRealPicture] = useState(false);

  const styles = StyleSheet.create({
    avatarContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
    },
    initialsContainer: {
      flex: 1,
      backgroundColor: "#3498db", // Background color for initials
      justifyContent: "center",
      alignItems: "center",
    },
    initialsText: {
      color: "#ffffff", // Text color for initials
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  useEffect(() => {
    const checkGravatar = async () => {
      const checkUrl = `${gravatarUrl}&d=404`;
      const response = await fetch(checkUrl, { method: "HEAD" });
      if (response.ok) {
        setHasRealPicture(true);
      }
    };

    checkGravatar();
  }, [gravatarUrl]);

  function bgcolor() {
    let hash = gravatarUrl.split("/");
    hash = hash[hash.length - 1];
    if (hash.length >= 6) {
      // make the color string with a slight transparency
      return `#${hash.slice(0, 6)}aa`;
    }
    return "#aaaaaaaa";
  }

  const usercolor = bgcolor();

  // Return true if all characters in a string are Korean characters
  const isAllKoreanCharacters = (str) =>
    str.match(
      /^([\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff])+$/g
    );

  const getInitials = (first, last) => {
    // Korean names are almost always <=2 characters; last names are written first,
    // so using the full first name is a more natural "initials" than (firstName[0], lastName[0])
    if (isAllKoreanCharacters(first)) {
      return first;
    }
    return `${first?.charAt(0)}${last?.charAt(0)}`;
  };

  const backUpLetters =
    firstName === null
      ? username.slice(0, 2)
      : getInitials(firstName, lastName);

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      {hasRealPicture ? (
        <Image source={{ uri: gravatarUrl }} style={styles.avatarImage} />
      ) : (
        <View
          style={[styles.initialsContainer, { backgroundColor: usercolor }]}
        >
          <Text style={styles.initialsText}>{backUpLetters}</Text>
        </View>
      )}
    </View>
  );
}

UserAvatar.propTypes = {
  size: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  gravatarUrl: PropTypes.string.isRequired,
};

export default UserAvatar;
