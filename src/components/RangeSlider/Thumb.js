import React,{memo} from "react";
import { StyleSheet, View } from "react-native";

const THUMB_RADIUS = 15;

const Thumb = ({theme}) => <View style={[styles.root, {backgroundColor: theme.colors.primary}]} />;

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderWidth: 1,
    borderColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.16,
    shadowRadius: 6
  }
});

export default Thumb;
