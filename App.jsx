import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FrontPage from "./src/FrontPage";
import HomeScreen from "./src/HomeScreen";
import SourceList from "./src/SourceList";
import SourcePage from "./src/SourcePage";
import CandidateScanning from "./src/CandidateScanning";
import CandidateList from "./src/CandidateList";
import GcnEventList from "./src/GcnEventList";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="FrontPage" component={FrontPage} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Candidate Scanning" component={CandidateScanning} />
        <Stack.Screen name="Candidate List" component={CandidateList} />
        <Stack.Screen name="Sources" component={SourceList} />
        <Stack.Screen name="Source Page" component={SourcePage} />
        <Stack.Screen name="GCN Events" component={GcnEventList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
