import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Tasks from "../screens/Tasks";
import Leaderboard from "../screens/Leaderboard";
import Me from "../screens/Me";
import { Button, Icon } from "react-native-elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddTask from "../screens/AddTask";

const Tab = createBottomTabNavigator();

const TaskStack = createNativeStackNavigator();

function TaskStackNavigator() {
  return (
    <TaskStack.Navigator initialRouteName="Tasks">
      <TaskStack.Screen name="Tasks" component={Tasks} />
      <TaskStack.Screen name="AddTask" component={AddTask} />
    </TaskStack.Navigator>
  );
}

const HomeTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="TasksStack"
      component={TaskStackNavigator}
      options={{
        headerShown: false,
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
