import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Tasks from "../screens/Tasks";
import Leaderboard from "../screens/Leaderboard";
import Me from "../screens/Me";

const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="ToDo" component={Tasks} />
    <Tab.Screen name="Leaderboard" component={Leaderboard} />
    <Tab.Screen name="Me" component={Me} />
  </Tab.Navigator>
);

export default HomeTabs;
