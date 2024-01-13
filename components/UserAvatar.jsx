import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet } from "react-native";
import { View, Text } from "./Themed.tsx";

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
      width: 50,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    initialsText: {
      fontSize: 12,
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
          <Text style={[{backgroundColor: usercolor},
              styles.initialsText]}>{backUpLetters}</Text>
        </View>
      )}
    </View>
  );
}

UserAvatar.propTypes = {
  size: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  gravatarUrl: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
};

UserAvatar.defaultProps = {
  firstName: null,
  lastName: null,
};

export default UserAvatar;
