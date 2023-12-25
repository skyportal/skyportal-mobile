import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FrontPage from "./src/FrontPage";
import SourceList from "./src/SourceList";
import SourcePage from "./src/SourcePage";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="FrontPage" component={FrontPage} />
        <Stack.Screen name="SourceList" component={SourceList} />
        <Stack.Screen name="SourcePage" component={SourcePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
