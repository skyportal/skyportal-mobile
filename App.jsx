import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FrontPage from "./src/components/FrontPage";
import HomeScreen from "./src/components/HomeScreen";
import SourceList from "./src/components/SourceList";
import SourcePage from "./src/components/SourcePage";
import CandidateScanning from "./src/components/CandidateScanning";
import CandidateList from "./src/components/CandidateList";
import GcnEventList from "./src/components/GcnEventList";

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
