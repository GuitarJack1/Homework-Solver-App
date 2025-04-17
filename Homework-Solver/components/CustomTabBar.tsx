import Colors from "@/constants/Colors";
import Numbers from "@/constants/Numbers";
import useKeyboardStore from "@/components/functions/useKeyboardStore";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabButton from "./TabButton";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });

  // Fetch the state for keyboard input focus
  const isInputFocused = useKeyboardStore((state) => state.isInputFocused);

  // Don't render the tab bar when input is focused, but ensure hooks are still called
  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  // Only render the tab bar if input is not focused
  if (isInputFocused) {
    return null; // The hooks above are still executed before this return.
  }

  return (
    <View onLayout={onTabbarLayout} style={styles.tab_bar}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: Colors.animatedIconBG,
            borderRadius: 30,
            marginHorizontal: "3.3%",
            width: "18%",
            height: "150%",
            bottom: -8,
          },
        ]}
      ></Animated.View>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: Numbers.animatedIconBGDuration,
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? Colors.tabActiveTint : Colors.tabInactiveTint}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tab_bar: {
    position: "absolute",
    bottom: "0%", // Bottom of the tab bar
    marginBottom: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.tabBarBG,
    zIndex: 1,
    marginHorizontal: Numbers.horizontalMargin, // Margin between tab bar sides and screen sides
  },
});
