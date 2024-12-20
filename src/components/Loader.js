import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  interpolate,
  Easing
} from "react-native-reanimated";

const Ring = (props) => {
  const {delay } = props
  const ring = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.8 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 4]),
        },
      ],
    };
  });

  useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 4000,
        }),
        -1,
        false
      )
    );
  }, []);
  return <Animated.View style={[styles.ring, ringStyle]}/>;
};

export default function Loader() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Ring delay={0}/>
      <Ring delay={1000}/>
      <Ring delay={2000}/>
      <Ring delay={3000}/>
      <Text style={styles.animatedText}>Chargement ...</Text>
      {/* <AnimatedText delay={10000} duration={10000} text="Veuillez patientez"/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "tomato",
    borderWidth: 5,
  },
  animatedText:{
    // fontSize: 12,
    position:'absolute',
    color: "tomato",
    top:'75%'
  }
});