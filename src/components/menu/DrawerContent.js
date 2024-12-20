import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Drawer,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DrawerContent(props) {
  const {navigation} = props
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={
          styles.drawerContent
        }
      >
        <View style={styles.userInfoSection}>
          <Title style={styles.title}>Loic Duhard</Title>
          <Caption style={styles.caption}>Manager Burger King Stades</Caption>
          <Caption style={styles.caption}>Role: Administrateur</Caption>
        </View>
        <Drawer.Section title='Application' style={styles.drawerSection} showDivider={false}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
            )}
            label="Tableau de bord"
            onPress={() => navigation.navigate('dashboard')}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="application-settings-outline" color={color} size={size} />
            )}
            label="Paramètres"
            onPress={() => navigation.navigate('settings')}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="table-account" color={color} size={size} />
            )}
            label="Comptes"
            onPress={() => navigation.navigate('Accounts')}
          />
        </Drawer.Section>
        <Drawer.Section title='Plannings' style={styles.drawerSection} showDivider={false}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="calendar-today"
                color={color}
                size={size}
              />
            )}
            label="Planning journalier"
            onPress={() => navigation.navigate('shifts')}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="calendar-week" color={color} size={size} />
            )}
            label="Planning Affichage"
            onPress={() => navigation.navigate('Displaying_shifts')}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="clock"
                color={color}
                size={size}
              />
            )}
            label="taches journalière"
            onPress={() => navigation.navigate('schedule')}
          />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});