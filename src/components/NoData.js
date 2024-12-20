import * as React from 'react';
import { Text } from 'react-native-paper';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get("window").width;

export default function NoData(){
  return(
   <View style={styles.container}>
      <Image source={require('../../assets/no_data.png')} style={styles.image} resizeMode='contain'/>
      {/* <Text>Pas de données disponnibles !</Text> */}
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width:'100%',
    height:'100%',
    flex:1,
  },
});