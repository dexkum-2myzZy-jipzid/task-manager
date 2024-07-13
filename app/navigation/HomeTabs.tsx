import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TasksList from "../screens/TasksList";
import Leaderboard from "../screens/Leaderboard";
import Me from "../screens/Me";
import { Icon } from "react-native-elements";

const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Tasks"
      component={TasksList}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="check" type="font-awesome" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Leaderboard"
      component={Leaderboard}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="trophy" type="font-awesome" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Me"
      component={Me}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="user" type="font-awesome" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default HomeTabs;
