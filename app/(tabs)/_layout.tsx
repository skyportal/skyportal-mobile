import { Ionicons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/info" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="help-circle-outline"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="sources"
        options={{
          title: "Sources",
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-tray-stacked" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="candidates"
        options={{
          title: "Candidates",
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gcn_events"
        options={{
          title: "Events",
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => <TabBarIcon name="radio" color={color} />,
        }}
      />
    </Tabs>
  );
}
