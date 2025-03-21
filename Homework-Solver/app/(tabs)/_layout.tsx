import CustomTabBar from "@/components/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          tabBarLabel: "Camera",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="manual"
        options={{
          tabBarLabel: "Manual",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
