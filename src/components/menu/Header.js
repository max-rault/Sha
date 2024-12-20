import * as React from 'react';
import { Col, Grid } from "react-native-easy-grid";
import { Appbar, Searchbar, IconButton } from 'react-native-paper';

export default function Header(props) {
  const {navigation, options, setUsedTheme, theme} = props
  const title = options.drawerLabel
  
  return (
    <Appbar.Header style={{height:48}} elevated>
      <IconButton icon="menu" onPress={() =>navigation.openDrawer()}/>
    <Appbar.Content
      title={title}
    />
    <Grid style={{alignSelf:'stretch', alignItems:'center'}}>
      <Col size={90}>
        <Searchbar
          inputStyle={{minHeight:25, margin:0}}
          style={{ marginLeft: 20, marginRight: 20, height:25, alignSelf:'center'}}
        />
      </Col>
      <Col size={10}>
        <IconButton 
          icon={theme.dark ? "brightness-2":"brightness-7"} 
          iconColor={theme.dark ? "#fff":"#ff9b00"}
          style={{marginRight:5}}
          onPress={() =>{
            if(theme.dark === true){
              setUsedTheme('light')
            } else{
              setUsedTheme('dark')
            }
          }}
        />
      </Col>
    </Grid>
    </Appbar.Header> 
  );
}