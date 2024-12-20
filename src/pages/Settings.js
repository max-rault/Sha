import React, {useState} from 'react';
import {Text, Divider} from 'react-native-paper';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { ScrollView, StyleSheet } from 'react-native';


const Settings = (props) => {
  const {theme} = props
  return (
    <ScrollView style={{flex: 1}}>
      <Grid>
        <Row style={styles.title}>
          <Col style={styles.title}>
            <Text variant='headlineLarge'>Plannings</Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Text variant='titleLarge'>Règles</Text>
            <Divider style={styles.divider}/>
            <Text>interval entre deux shifts: </Text>
            <Text>Interval deux journées: </Text>
            <Text>... Paramètres</Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Text variant='titleLarge'>Categories</Text>
            <Divider style={styles.divider}/>
            <Text>Repos</Text>
            <Text>Actif</Text>
            <Text></Text>
          </Col>
        </Row>
        <Row style={styles.title}>
          <Col style={styles.title}>
            <Text variant='headlineLarge'>Périodes d'activitées</Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Text variant='titleLarge'>Horraire d'ouverture</Text>
            <Divider style={styles.divider}/>
            <Text>Lundi: </Text>
            <Text>Mardi: </Text>
            <Text>Mercredi: </Text>
            <Text>Jeudi: </Text>
            <Text>Vendredi: </Text>
            <Text>Samedi: </Text>
            <Text>Dimanche: </Text>
          </Col>
          <Col>
            <Text variant='titleLarge'>Période de forte influence</Text>
            <Divider style={styles.divider}/>
            <Text>semaine: </Text>
            <Text>année: </Text>
          </Col>
        </Row>
      </Grid>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title:{
    alignSelf:'center',
  },
  divider:{
    width:"75%"
  },
  Text:{

  }
})

export default Settings;