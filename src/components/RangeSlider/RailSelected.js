import React,{memo} from "react";
import { StyleSheet, View } from "react-native";

const RailSelected = ({theme}) => <View style={[styles.root, {backgroundColor: theme.colors.primary}]} />;

export default RailSelected;

const styles = StyleSheet.create({
  root: {
    height: 5,
    borderRadius: 2
  }
});
